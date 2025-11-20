const Product = require("../models/Product");
const { itemsInStock, itemsSoldTotal } = require('../metrics/inventoryMetrics');

//Function to sync MongoDB data with Prometheus Gauge on startup
exports.initializeMetrics = async () => {
  try {
    const products = await Product.find({});

    //Reset the gauge to avoid stale data
    itemsInStock.reset();

    products.forEach(product => {
      itemsInStock.set(
        //Set the gauge value for each product
        {product_id: product._id.toString(), product_name: product.name},
        product.quantity
      );
      console.log('Metrics initialized with current data');
    })
  } catch (error) {
    console.error('Error initializing metrics:', error);
  }
}

// Handle image upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Return the complete URL that can be used to access the image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Update the items in stock metric with the initial quantity
    itemsInStock.set({ 
      product_id: product._id.toString(),
      product_name: product.name
    }, product.quantity);

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Set the stock to 0 for the deleted product
    itemsInStock.set({ 
      product_id: product._id.toString(),
      product_name: product.name
    }, 0);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product quantity
exports.updateQuantity = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If quantity decreased, update the items sold counter
    if(product.quantity > req.body.quantity) {
      const itemsSold = product.quantity - req.body.quantity;
      itemsSoldTotal.inc({ 
        product_id: product._id.toString(),
        product_name: product.name
      }, itemsSold);
    }
    
    // Update the stock gauge with the new quantity
    itemsInStock.set({ 
      product_id: product._id.toString(),
      product_name: product.name
    }, req.body.quantity);
    
    product.quantity = req.body.quantity;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reduce stock quantity
exports.reduceStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reduceBy = req.body.quantity || 1;
    if (product.quantity < reduceBy) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.quantity -= reduceBy;
    await product.save();

    itemsInStock.set(
      {
        product_id: product._id.toString(),
        product_name: product.name
      },
      product.quantity
    );
    
    itemsSoldTotal.inc(
      { 
      product_id: product._id.toString(),
      product_name: product.name
      }, 
      reduceBy
    );
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
