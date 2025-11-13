# --- User DB ---
resource "kubernetes_persistent_volume_claim" "user-db-pvc" {
  metadata {
    name      = "user-db-pvc"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}

resource "kubernetes_deployment" "user-db" {
  metadata {
    name      = "user-db"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "user-db" } }
    template {
      metadata { labels = { app = "user-db" } }
      spec {
        container {
          name  = "mongo"
          image = "mongo:latest"
          port { container_port = 27017 }
          volume_mount {
            name       = "user-db-data"
            mount_path = "/data/db"
          }
        }
        volume {
          name = "user-db-data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.user-db-pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "user-db-service" {
  metadata {
    name      = "user-db-service"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    selector = { app = "user-db" }
    port {
      port        = 27017
      target_port = 27017
    }
  }
}

# --- Inventory DB ---
resource "kubernetes_persistent_volume_claim" "inventory-db-pvc" {
  metadata {
    name      = "inventory-db-pvc"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}

resource "kubernetes_deployment" "inventory-db" {
  metadata {
    name      = "inventory-db"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "inventory-db" } }
    template {
      metadata { labels = { app = "inventory-db" } }
      spec {
        container {
          name  = "mongo"
          image = "mongo:latest"
          port { container_port = 27017 }
          volume_mount {
            name       = "inventory-db-data"
            mount_path = "/data/db"
          }
        }
        volume {
          name = "inventory-db-data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.inventory-db-pvc.metadata[0].name
          }
        }
      }
    }
  }
}
resource "kubernetes_service" "inventory-db-service" {
  metadata {
    name      = "inventory-db-service"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    selector = { app = "inventory-db" }
    port {
      port        = 27017
      target_port = 27017
    }
  }
}

# --- Order DB ---
resource "kubernetes_persistent_volume_claim" "order-db-pvc" {
  metadata {
    name      = "order-db-pvc"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}
resource "kubernetes_deployment" "order-db" {
  metadata {
    name      = "order-db"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "order-db" } }
    template {
      metadata { labels = { app = "order-db" } }
      spec {
        container {
          name  = "mongo"
          image = "mongo:latest"
          port { container_port = 27017 }
          volume_mount {
            name       = "order-db-data"
            mount_path = "/data/db"
          }
        }
        volume {
          name = "order-db-data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.order-db-pvc.metadata[0].name
          }
        }
      }
    }
  }
}
resource "kubernetes_service" "order-db-service" {
  metadata {
    name      = "order-db-service"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    selector = { app = "order-db" }
    port {
      port        = 27017
      target_port = 27017
    }
  }
}

# --- Payment DB ---
resource "kubernetes_persistent_volume_claim" "payment-db-pvc" {
  metadata {
    name      = "payment-db-pvc"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}
resource "kubernetes_deployment" "payment-db" {
  metadata {
    name      = "payment-db"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    replicas = 1
    selector { match_labels = { app = "payment-db" } }
    template {
      metadata { labels = { app = "payment-db" } }
      spec {
        container {
          name  = "mongo"
          image = "mongo:latest"
          port { container_port = 27017 }
          volume_mount {
            name       = "payment-db-data"
            mount_path = "/data/db"
          }
        }
        volume {
          name = "payment-db-data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.payment-db-pvc.metadata[0].name
          }
        }
      }
    }
  }
}
resource "kubernetes_service" "payment-db-service" {
  metadata {
    name      = "payment-db-service"
    namespace = kubernetes_namespace.app_services.metadata[0].name
  }
  spec {
    selector = { app = "payment-db" }
    port {
      port        = 27017
      target_port = 27017
    }
  }
}