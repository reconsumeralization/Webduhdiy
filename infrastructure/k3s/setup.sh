#!/bin/bash

# webduh K3s Cluster Setup Script
# Inspired by Dokploy and other open source deployment platforms

set -e

echo "🚀 Setting up webduh K3s cluster..."

# Configuration
CLUSTER_NAME="${CLUSTER_NAME:-webduh}"
K3S_VERSION="${K3S_VERSION:-v1.28.0+k3s1}"
NAMESPACE="${NAMESPACE:-webduh}"
DOMAIN="${DOMAIN:-webduh.local}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if curl is installed
    if ! command -v curl &> /dev/null; then
        print_error "curl is required but not installed"
        exit 1
    fi
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        print_warning "Docker not found. K3s will use containerd instead."
    elif ! docker info &> /dev/null; then
        print_warning "Docker is installed but not running"
    fi
    
    print_success "Prerequisites check completed"
}

# Install K3s
install_k3s() {
    print_status "Installing K3s ${K3S_VERSION}..."
    
    # Install K3s with custom configuration
    curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="${K3S_VERSION}" sh -s - \
        --write-kubeconfig-mode 644 \
        --disable traefik \
        --disable servicelb \
        --disable local-storage \
        --cluster-init \
        --node-name "${CLUSTER_NAME}-master" \
        --cluster-domain "${DOMAIN}" \
        --kubelet-arg="max-pods=110" \
        --kube-controller-manager-arg="node-cidr-mask-size=24"
    
    # Wait for K3s to be ready
    print_status "Waiting for K3s to be ready..."
    timeout 60 bash -c 'until kubectl get nodes | grep -q Ready; do sleep 2; done'
    
    print_success "K3s installed successfully"
}

# Setup kubectl access
setup_kubectl() {
    print_status "Setting up kubectl access..."
    
    # Copy kubeconfig to user directory
    mkdir -p ~/.kube
    sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
    sudo chown $(id -u):$(id -g) ~/.kube/config
    
    # Set KUBECONFIG environment variable
    export KUBECONFIG=~/.kube/config
    echo 'export KUBECONFIG=~/.kube/config' >> ~/.bashrc
    
    # Test kubectl access
    kubectl cluster-info
    
    print_success "kubectl configured successfully"
}

# Create webduh namespace
create_namespace() {
    print_status "Creating webduh namespace..."
    
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: ${NAMESPACE}
  labels:
    name: ${NAMESPACE}
    app.kubernetes.io/name: webduh
    app.kubernetes.io/component: core
EOF
    
    print_success "Namespace '${NAMESPACE}' created"
}

# Install Helm
install_helm() {
    print_status "Installing Helm..."
    
    if ! command -v helm &> /dev/null; then
        curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
        print_success "Helm installed successfully"
    else
        print_success "Helm already installed"
    fi
}

# Install Traefik (Load Balancer)
install_traefik() {
    print_status "Installing Traefik..."
    
    # Add Traefik Helm repository
    helm repo add traefik https://helm.traefik.io/traefik
    helm repo update
    
    # Create Traefik configuration
    cat <<EOF > traefik-values.yaml
deployment:
  replicas: 2

service:
  type: LoadBalancer

ports:
  web:
    port: 80
    expose: true
    exposedPort: 80
  websecure:
    port: 443
    expose: true
    exposedPort: 443
  metrics:
    port: 8080
    expose: false

ingressRoute:
  dashboard:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: traefik

additionalArguments:
  - "--certificatesresolvers.letsencrypt.acme.email=admin@${DOMAIN}"
  - "--certificatesresolvers.letsencrypt.acme.storage=/data/acme.json"
  - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
  - "--metrics.prometheus=true"
  - "--log.level=INFO"

persistence:
  enabled: true
  size: 1Gi

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi
EOF
    
    # Install Traefik
    helm upgrade --install traefik traefik/traefik \
        --namespace kube-system \
        --values traefik-values.yaml \
        --wait
    
    print_success "Traefik installed successfully"
}

# Install ArgoCD (GitOps)
install_argocd() {
    print_status "Installing ArgoCD..."
    
    # Create ArgoCD namespace
    kubectl create namespace argocd || true
    
    # Install ArgoCD
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    
    # Wait for ArgoCD to be ready
    print_status "Waiting for ArgoCD to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd
    
    # Get ArgoCD admin password
    ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
    
    # Create ArgoCD ingress
    cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: argocd
  annotations:
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls.certresolver: letsencrypt
spec:
  rules:
  - host: argocd.${DOMAIN}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: argocd-server
            port:
              number: 80
  tls:
  - hosts:
    - argocd.${DOMAIN}
    secretName: argocd-tls
EOF
    
    print_success "ArgoCD installed successfully"
    print_status "ArgoCD admin password: ${ARGOCD_PASSWORD}"
    print_status "ArgoCD URL: https://argocd.${DOMAIN}"
}

# Install Prometheus and Grafana (Monitoring)
install_monitoring() {
    print_status "Installing monitoring stack (Prometheus + Grafana)..."
    
    # Add Prometheus Helm repository
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    
    # Create monitoring namespace
    kubectl create namespace monitoring || true
    
    # Install kube-prometheus-stack
    cat <<EOF > monitoring-values.yaml
grafana:
  adminPassword: webduh123
  ingress:
    enabled: true
    ingressClassName: traefik
    hosts:
      - grafana.${DOMAIN}
    tls:
      - secretName: grafana-tls
        hosts:
          - grafana.${DOMAIN}

prometheus:
  ingress:
    enabled: true
    ingressClassName: traefik
    hosts:
      - prometheus.${DOMAIN}
    tls:
      - secretName: prometheus-tls
        hosts:
          - prometheus.${DOMAIN}

alertmanager:
  ingress:
    enabled: true
    ingressClassName: traefik
    hosts:
      - alertmanager.${DOMAIN}
    tls:
      - secretName: alertmanager-tls
        hosts:
          - alertmanager.${DOMAIN}
EOF
    
    helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --values monitoring-values.yaml \
        --wait
    
    print_success "Monitoring stack installed successfully"
    print_status "Grafana URL: https://grafana.${DOMAIN} (admin/webduh123)"
    print_status "Prometheus URL: https://prometheus.${DOMAIN}"
}

# Install cert-manager (SSL Certificates)
install_cert_manager() {
    print_status "Installing cert-manager..."
    
    # Add cert-manager Helm repository
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    
    # Create cert-manager namespace
    kubectl create namespace cert-manager || true
    
    # Install cert-manager
    helm upgrade --install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --set installCRDs=true \
        --wait
    
    # Create Let's Encrypt ClusterIssuer
    cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@${DOMAIN}
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: traefik
EOF
    
    print_success "cert-manager installed successfully"
}

# Create webduh service account and RBAC
setup_rbac() {
    print_status "Setting up RBAC for webduh..."
    
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: webduh-deployer
  namespace: ${NAMESPACE}
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: webduh-deployer
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "secrets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["batch"]
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: webduh-deployer
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: webduh-deployer
subjects:
- kind: ServiceAccount
  name: webduh-deployer
  namespace: ${NAMESPACE}
EOF
    
    # Get service account token
    kubectl create token webduh-deployer -n ${NAMESPACE} --duration=8760h > webduh-token.txt
    
    print_success "RBAC configured successfully"
    print_status "Service account token saved to webduh-token.txt"
}

# Create storage classes
setup_storage() {
    print_status "Setting up storage classes..."
    
    cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: webduh-fast
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: rancher.io/local-path
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Delete
allowVolumeExpansion: true
EOF
    
    print_success "Storage classes configured"
}

# Create network policies
setup_network_policies() {
    print_status "Setting up network policies..."
    
    cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: webduh-default
  namespace: ${NAMESPACE}
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    - namespaceSelector:
        matchLabels:
          name: ${NAMESPACE}
    - podSelector: {}
  egress:
  - {}
EOF
    
    print_success "Network policies configured"
}

# Create resource quotas
setup_resource_quotas() {
    print_status "Setting up resource quotas..."
    
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ResourceQuota
metadata:
  name: webduh-quota
  namespace: ${NAMESPACE}
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    persistentvolumeclaims: "10"
    count/deployments.apps: "50"
    count/services: "50"
    count/secrets: "100"
    count/configmaps: "100"
EOF
    
    print_success "Resource quotas configured"
}

# Print cluster information
print_cluster_info() {
    echo ""
    echo "=========================================="
    echo "🎉 webduh K3s Cluster Setup Complete!"
    echo "=========================================="
    echo ""
    echo "📋 Cluster Information:"
    echo "  Cluster Name: ${CLUSTER_NAME}"
    echo "  Namespace: ${NAMESPACE}"
    echo "  Domain: ${DOMAIN}"
    echo "  K3s Version: ${K3S_VERSION}"
    echo ""
    echo "🔧 Services:"
    echo "  ArgoCD: https://argocd.${DOMAIN}"
    echo "  Grafana: https://grafana.${DOMAIN} (admin/webduh123)"
    echo "  Prometheus: https://prometheus.${DOMAIN}"
    echo "  Traefik Dashboard: https://traefik.${DOMAIN}/dashboard/"
    echo ""
    echo "📁 Important Files:"
    echo "  Kubeconfig: ~/.kube/config"
    echo "  Service Account Token: ./webduh-token.txt"
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. Update your DNS to point *.${DOMAIN} to this server"
    echo "  2. Deploy the webduh API and dashboard"
    echo "  3. Configure your applications to use the cluster"
    echo ""
    echo "📖 Useful Commands:"
    echo "  kubectl get nodes"
    echo "  kubectl get pods -n ${NAMESPACE}"
    echo "  kubectl logs -f deployment/webduh-api -n ${NAMESPACE}"
    echo ""
}

# Cleanup on error
cleanup_on_error() {
    print_error "Setup failed. Cleaning up..."
    # Add cleanup commands here if needed
    exit 1
}

# Main setup function
main() {
    print_status "Starting webduh K3s cluster setup..."
    
    # Set error handler
    trap cleanup_on_error ERR
    
    # Run setup steps
    check_root
    check_prerequisites
    install_k3s
    setup_kubectl
    create_namespace
    install_helm
    install_traefik
    install_argocd
    install_monitoring
    install_cert_manager
    setup_rbac
    setup_storage
    setup_network_policies
    setup_resource_quotas
    
    # Print final information
    print_cluster_info
}

# Run main function
main "$@" 