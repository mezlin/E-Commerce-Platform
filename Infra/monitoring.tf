resource "helm_release" "monitoring-stack" {
    name = "monitoring-stack"
    repository = "https://prometheus-community.github.io/helm-charts"
    chart = "kube-prometheus-stack"
    version = "79.1.0"

    namespace = kubernetes_namespace.monitoring.metadata[0].name

    depends_on = [
        kubernetes_namespace.monitoring
    ]
}

data "kubernetes_secret" "grafana-admin" {
    metadata {
      name = "monitoring-stack-grafana"
      namespace = kubernetes_namespace.monitoring.metadata[0].name
    }

    depends_on = [
        helm_release.monitoring-stack
    ]
}

resource "kubernetes_deployment" "jaeger-deployment" {
    metadata {
        name = "jaeger-deployment"
        namespace = kubernetes_namespace.monitoring.metadata[0].name
        labels = {
            app = "jaeger"
        }
    }

    spec {
        replicas = 1

        selector {
            match_labels = {
                app = "jaeger"
            }
        }

        template {
            metadata {
                labels = {
                    app = "jaeger"
                }
            }

            spec {
                container {
                    name  = "jaeger"
                    image = "jaegertracing/all-in-one:1.58.1"

                    env {
                        name = "COLLECTOR_OTLP_ENABLED"
                        value = "true"
                    }

                    port {
                        name = "otlp-http"
                        container_port = 4318
                    }

                    port {
                        name = "ui"
                        container_port = 16686
                    }
                }
            }
        }
    }
}

resource "kubernetes_service" "jaeger-service" {
    metadata {
        name = "jaeger-service"
        namespace = kubernetes_namespace.monitoring.metadata[0].name
    }

    spec {
        selector = {
            app = "jaeger"
        }

        port {
            name = "otlp-http"
            port = 4318
            target_port = "otlp-http"
        }

        port {
            name = "ui"
            port = 16686
            target_port = "ui"
        }
    }
}

# --- Service Monitors for Application Services (This tells Prometheus to find and scrape our new services) ---
resource "kubernetes_manifest" "app-monitors" {
  for_each = toset([
    "user-s2",
    "inventory-s2",
    "order-s2",
    "payment-s2",
    "user-service"

  ])

  manifest = {
    apiVersion = "monitoring.coreos.com/v1"
    kind       = "ServiceMonitor"
    metadata = {
      name      = "${each.key}-monitor"
      namespace = kubernetes_namespace.monitoring.metadata[0].name
      labels = {
        release = "monitoring-stack"
      }
    }
    spec = {
      namespaceSelector = {
        matchNames = [
          kubernetes_namespace.app_services.metadata[0].name
        ]
      }
      selector = {
        matchLabels = {
          app = each.key
        }
      }
      endpoints = [{
        port = "http"
        path = "/api/metrics"
        interval = "15s"
      }]
    }
  }
}