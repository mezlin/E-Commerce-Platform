resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
  }
}

resource "kubernetes_namespace" "app-services" {
  metadata {
    name = "app-services"
  }
}