resource "kubernetes_manifest" "allow_prometheus_ingress" {
  manifest = {
    apiVersion = "networking.k8s.io/v1"
    kind       = "NetworkPolicy"
    metadata = {
      name      = "allow-prometheus-ingress"
      namespace = kubernetes_namespace.app_services.metadata[0].name
    }
    spec = {
      # Apply this policy to ALL pods in 'app-services'
      podSelector = {}
      policyTypes = ["Ingress"]
      ingress = [
        {
          # 1. Allow from any pod in the 'monitoring' namespace
          from = [
            {
              namespaceSelector = {
                matchLabels = {
                  "kubernetes.io/metadata.name" = "monitoring"
                }
              }
            }
          ]
        }
      ]
    }
  }
}

resource "kubernetes_manifest" "allow_jaeger_egress" {
  manifest = {
    apiVersion = "networking.k8s.io/v1"
    kind       = "NetworkPolicy"
    metadata = {
      name      = "allow-jaeger-egress"
      namespace = kubernetes_namespace.app_services.metadata[0].name
    }
    spec = {
      # Apply this policy to ALL pods in 'app-services'
      podSelector = {}
      policyTypes = ["Egress"]
      egress = [
        {
          # 1. Allow traffic TO any pod in the 'monitoring' namespace
          to = [
            {
              namespaceSelector = {
                matchLabels = {
                  "kubernetes.io/metadata.name" = "monitoring"
                }
              }
            }
          ]
        }
      ]
    }
  }
}

resource "kubernetes_manifest" "allow_jaeger_ingress" {
  manifest = {
    apiVersion = "networking.k8s.io/v1"
    kind       = "NetworkPolicy"
    metadata = {
      name      = "allow-jaeger-ingress"
      #This policy lives in the destination namespace
      namespace = kubernetes_namespace.monitoring.metadata[0].name
    }
    spec = {
      podSelector = {
        matchLabels = {
          app = "jaeger"
        }
      }
      policyTypes = ["Ingress"]
      ingress = [
        {
          # Allow traffic FROM the app_services namespace
          from = [
            {
              namespaceSelector = {
                matchLabels = {
                  "kubernetes.io/metadata.name" = kubernetes_namespace.app_services.metadata[0].name
                }
              }
            }
          ]
          # Restrict to the OTLP HTTP port
          ports = [
            {
              protocol = "TCP"
              port     = 4318
            }
          ]
        }
      ]
    }
  }
}