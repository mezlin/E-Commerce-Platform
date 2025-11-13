resource "kubernetes_secret" "user-db-secret" {
    metadata {
        name      = "user-db-secret"
        namespace = kubernetes_namespace.app_services.metadata[0].name
    }

    data = {
        MONGODB_URI = "mongodb://user-db-service:27017/user-db"
    }
}

resource "kubernetes_secret" "order-db-secret" {
    metadata {
        name      = "order-db-secret"
        namespace = kubernetes_namespace.app_services.metadata[0].name
    }

    data = {
        MONGODB_URI = "mongodb://order-db-service:27017/order-db"
    }
}

resource "kubernetes_secret" "inventory-db-secret" {
    metadata {
        name      = "inventory-db-secret"
        namespace = kubernetes_namespace.app_services.metadata[0].name
    }

    data = {
        MONGODB_URI = "mongodb://inventory-db-service:27017/inventory-db"
    }
}

resource "kubernetes_secret" "payment-db-secret" {
    metadata {
        name      = "payment-db-secret"
        namespace = kubernetes_namespace.app_services.metadata[0].name
    }

    data = {
        MONGODB_URI = "mongodb://payment-db-service:27017/payment-db"
    }
}

resource "kubernetes_secret" "user-service-secret" {
    metadata {
        name = "user-service-secret"
        namespace = kubernetes_namespace.app_services.metadata[0].name
    }

    data = {
        JWT_SECRET = base64encode("dla;hdf;ajklsdfahsd;flkasdfnsjfhlas")
    }
}