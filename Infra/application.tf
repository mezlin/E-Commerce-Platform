
# --- Frontend Service ---
resource "kubernetes_deployment" "frontend-service" {
  metadata {
    name      = "frontend-service"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "frontend-service" }
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "frontend-service" } }
    template {
      metadata { labels = { app = "frontend-service" } }
      spec {
        container {
          name              = "frontend-service"
          image             = "mezlin/frontend-service:latest"
          image_pull_policy = "Always"
          port { container_port = 80 }
          env_from {
            config_map_ref {
              name = kubernetes_config_map.frontend-config.metadata[0].name
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend-s2" {
  metadata {
    name      = "frontend-s2"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "frontend-s2" } # For Prometheus
  }
  spec {
    selector = { app = "frontend-service" }
    port {
      name        = "http"
      port        = 80
      target_port = 80
    } 
  }
}

# --- User Service ---
resource "kubernetes_deployment" "user-service" {
  metadata {
    name      = "user-service"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "user-service" }
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "user-service" } }
    template {
      metadata { labels = { app = "user-service" } }
      spec {
        container {
          name              = "user-service"
          image             = "mezlin/user-service:latest"
          image_pull_policy = "Always"
          port { container_port = 4000 }
          env_from {
            config_map_ref {
              name = kubernetes_config_map.user-service-config.metadata[0].name
            }
          }
          env_from {
            secret_ref {
              name = kubernetes_secret.user-service-secret.metadata[0].name
            }
          }
          env_from {
            secret_ref {
              name = kubernetes_secret.user-db-secret.metadata[0].name
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "user-s2" {
  metadata {
    name      = "user-s2"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "user-s2" } 
  }
  spec {
    selector = { app = "user-service" }
    port {
      name        = "http"
      port        = 4000
      target_port = 4000
    }
  }
}

# --- Inventory Service ---
resource "kubernetes_deployment" "inventory-service" {
  metadata {
    name      = "inventory-service"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "inventory-service" }
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "inventory-service" } }
    template {
      metadata { labels = { app = "inventory-service" } }
      spec {
        container {
          name              = "inventory-service"
          image             = "mezlin/inventory-service:latest"
          image_pull_policy = "Always"
          port { container_port = 4001 }
          env_from {
            config_map_ref {
              name = kubernetes_config_map.inventory-service-config.metadata[0].name
            }
          }
          env_from {
            secret_ref {
              name = kubernetes_secret.inventory-db-secret.metadata[0].name
            }
          }
        }
      }
    }
  }
}
    
resource "kubernetes_service" "inventory-s2" {
  metadata {
    name      = "inventory-s2"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "inventory-s2" } 
  }
  spec {
    selector = { app = "inventory-service" }
    port {
      name        = "http"
      port        = 4001
      target_port = 4001
    }
  }
}

# --- Order Service ---
resource "kubernetes_deployment" "order-service" {
  metadata {
    name      = "order-service"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "order-service" }
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "order-service" } }
    template {
      metadata { labels = { app = "order-service" } }
      spec {
        container {
          name              = "order-service"
          image             = "mezlin/order-service:latest"
          image_pull_policy = "Always"
          port { container_port = 4002 }
          env_from {
            config_map_ref {
              name = kubernetes_config_map.order-service-config.metadata[0].name
            }
          }
          env_from {
            secret_ref {
              name = kubernetes_secret.order-db-secret.metadata[0].name
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "order-s2" {
  metadata {
    name      = "order-s2"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "order-s2" }
  }
  spec {
    selector = { app = "order-service" }
    port {
      name        = "http"
      port        = 4002
      target_port = 4002
    }
  }
}

# --- Payment Service ---
resource "kubernetes_deployment" "payment-service" {
  metadata {
    name      = "payment-service"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "payment-service" }
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "payment-service" } }
    template {
      metadata { labels = { app = "payment-service" } }
      spec {
        container {
          name              = "payment-service"
          image             = "mezlin/payment-service:latest"
          image_pull_policy = "Always"
          port { container_port = 4003 }
          env_from {
            config_map_ref {
              name = kubernetes_config_map.payment-service-config.metadata[0].name
            }
          }
          env_from {
            secret_ref {
              name = kubernetes_secret.payment-db-secret.metadata[0].name
            }
          }
        }
      }
    }
  }
}
    
resource "kubernetes_service" "payment-s2" {
  metadata {
    name      = "payment-s2"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    labels    = { app = "payment-s2" } 
  }
  spec {
    selector = { app = "payment-service" }
    port {
      name        = "http"
      port        = 4003
      target_port = 4003
    }
  }
}

# --- Ingress ---
resource "kubernetes_ingress_v1" "main-ingress" {
  metadata {
    name      = "main-ingress"
    namespace = kubernetes_namespace.app_services.metadata[0].name
    annotations = {
      # Use the Nginx Ingress Controller
      "kubernetes.io/ingress.class" = "nginx"
      "nginx.ingress.kubernetes.io/proxy-body-size" = "25m"
    }
  }

  spec {
    rule {
      http {
        # --- Backend API Routes ---

        # --- User Route ---
        path {
          path_type = "Prefix"
          path      = "/api/users"
          backend {
            service {
              name = kubernetes_service.user-s2.metadata[0].name
              port { number = 4000 }
            }
          }
        }

        # --- Health/metrics Route User---
        path {
          path_type = "Prefix"
          path      = "/api"
          backend {
            service {
              name = kubernetes_service.user-s2.metadata[0].name
              port { number = 4000 }
            }
          }
        }
        path {
          path_type = "Prefix"
          path      = "/api"
          backend {
            service {
              name = kubernetes_service.user-s2.metadata[0].name
              port { number = 4000 }
            }
          }
        }

        # --- Inventory Route ---
        path {
          path_type = "Prefix"
          path      = "/api/products"
          backend {
            service {
              name = kubernetes_service.inventory-s2.metadata[0].name
              port { number = 4001 }
            }
          }
        }

        # --- Health/metrics Route Inventory---
        path {
          path_type = "Prefix"
          path      = "/api"
          backend {
            service {
              name = kubernetes_service.inventory-s2.metadata[0].name
              port { number = 4001 }
            }
          }
        }
        path {
          path_type = "Prefix"
          path      = "/api"
          backend {
            service {
              name = kubernetes_service.inventory-s2.metadata[0].name
              port { number = 4001 }
            }
          }
        }

        # --- Order Route ---
        path {
          path_type = "Prefix"
          path      = "/api/orders"
          backend {
            service {
              name = kubernetes_service.order-s2.metadata[0].name
              port { number = 4002 }
            }
          }
        }

        # --- Health/metrics Route Order---
        path {
          path_type = "Prefix"
          path      = "/api"
          backend {
            service {
              name = kubernetes_service.order-s2.metadata[0].name
              port { number = 4002 }
            }
          }
        }
        path {
          path_type = "Prefix"
          path      = "/api"
          backend {
            service {
              name = kubernetes_service.order-s2.metadata[0].name
              port { number = 4002 }
            }
          }
        }

        # --- Payment Route ---
        path {
          path_type = "Prefix"
          path      = "/api/payments"
          backend {
            service {
              name = kubernetes_service.payment-s2.metadata[0].name
              port { number = 4003 }
            }
          }
        }

        # --- Health/metrics Route Payment---
        path {
          path_type = "Prefix"
          path      = "/api"
          backend {
            service {
              name = kubernetes_service.payment-s2.metadata[0].name
              port { number = 4003 }
            }
          }
        }
        path {
          path_type = "Prefix"
          path      = "/api"
          backend {
            service {
              name = kubernetes_service.payment-s2.metadata[0].name
              port { number = 4003 }
            }
          }
        }
        
        # --- Frontend Route ---
        # All other traffic goes to the frontend
        path {
          path_type = "Prefix"
          path      = "/"
          backend {
            service {
              name = kubernetes_service.frontend-s2.metadata[0].name
              port { number = 80 }
            }
          }
        }
      }
    }
  }
}