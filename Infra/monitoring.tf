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