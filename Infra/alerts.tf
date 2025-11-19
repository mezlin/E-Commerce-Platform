resource "kubernetes_manifest" "app_alerts" {
  manifest = {
    apiVersion = "monitoring.coreos.com/v1"
    kind       = "PrometheusRule"
    metadata = {
      name      = "app-alerts"
      namespace = kubernetes_namespace.monitoring.metadata[0].name
      labels = {
        # This label is CRITICAL. It must match the 'release' name of your kube-prometheus-stack 
        release = "monitoring-stack" 
      }
    }
    spec = {
      groups = [
        {
          name = "inventory.rules"
          rules = [
            # --- BUSINESS ALERT: Low Stock ---
            # Triggers if any product has fewer than 5 items left
            {
              alert = "InventoryLowStock"
              expr  = "inventory_items_in_stock < 5"
              for   = "1m"
              labels = {
                severity = "warning"
              }
              annotations = {
                summary = "Low Stock: {{ $labels.product_name }}"
                description = "The product {{ $labels.product_name }} (ID: {{ $labels.product_id }}) has only {{ $value }} items left."
              }
            },

            # --- SYSTEM ALERT: High Error Rate ---
            # Triggers if 500-level errors exceed 5% of total traffic
            {
              alert = "HighErrorRate"
              expr  = "sum(rate(http_request_duration_seconds_count{status_code=~'5.*'}[5m])) by (service_name) / sum(rate(http_request_duration_seconds_count[5m])) by (service_name) > 0.05"
              for   = "2m"
              labels = {
                severity = "critical"
              }
              annotations = {
                summary = "High Error Rate on {{ $labels.service_name }}"
                description = "{{ $labels.service_name }} is failing 5% of requests."
              }
            },

            # --- PERFORMANCE ALERT: Slow Response ---
            # Triggers if the 95th percentile latency is > 2 seconds
            {
              alert = "HighLatency"
              expr  = "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service_name)) > 2"
              for   = "5m"
              labels = {
                severity = "warning"
              }
              annotations = {
                summary = "Slow Responses on {{ $labels.service_name }}"
                description = "95% of requests to {{ $labels.service_name }} are taking longer than 2 seconds."
              }
            }
          ]
        }
      ]
    }
  }
}