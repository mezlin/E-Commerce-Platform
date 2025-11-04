output "grafana_admin_user" {
    description = "Grafana admin username"
    value       = "admin"
}

output "grafana_admin_password" {
    description = "Grafana admin password retrieved from Kubernetes secret"
    value       = data.kubernetes_secret.grafana-admin.data["admin-password"]
    sensitive = true
}