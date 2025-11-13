resource "kubernetes_config_map" "frontend-config" {
  metadata {
    name      = "frontend-config"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  data = {
    REACT_APP_USER_API_URL      = "/api/users"
    REACT_APP_INVENTORY_API_URL = "/api/inventory"
    REACT_APP_ORDER_API_URL     = "/api/orders"
    REACT_APP_PAYMENT_API_URL   = "/api/payments"
    NODE_ENV                    = "development"
  }
}

# --- User Service Config ---
resource "kubernetes_config_map" "user-service-config" {
  metadata {
    name      = "user-service-config"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  data = {
    PORT        = "4000"
    JWT_SECRET  = kubernetes_secret.user-service-secret.data["JWT_SECRET"]
    NODE_ENV    = "development"
  }
}

# --- Inventory Service Config ---
resource "kubernetes_config_map" "inventory-service-config" {
  metadata {
    name      = "inventory-service-config"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  data = {
    PORT        = "4001"
    NODE_ENV    = "development"
  }
}

# --- Order Service Config ---
resource "kubernetes_config_map" "order-service-config" {
  metadata {
    name      = "order-service-config"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  data = {
    PORT                  = "4002"
    NODE_ENV              = "development"
    INVENTORY_SERVICE_URL = "http://inventory-service:4001"
    PAYMENT_SERVICE_URL   = "http://payment-service:4003"
  }
}

# --- Payment Service Config ---
resource "kubernetes_config_map" "payment-service-config" {
  metadata {
    name      = "payment-service-config"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  data = {
    PORT        = "4003"
    NODE_ENV    = "development"
  }
}