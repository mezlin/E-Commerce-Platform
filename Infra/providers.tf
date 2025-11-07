terraform {
    required_providers {
        kubernetes = {
            source = "hashicorp/kubernetes"
            version = "2.38.0"
        }
        helm = {
            source = "hashicorp/helm"
            version = "3.0.0"
        }
        /*docker = {
            source = "kreuzwerker/docker"
            version = "2.22.0"
        }*/
    }
}

provider "kubernetes" {
    config_path = "~/.kube/config"
}

provider "helm" {
    kubernetes = {
        config_path = "~/.kube/config"
    }
}
/*provider "docker" {
    host = "tcp://localhost:2375/"
}*/