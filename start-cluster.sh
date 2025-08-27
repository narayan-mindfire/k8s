#!/bin/bash
set -e  

CLUSTER_NAME="k8s-assessment"

# delete any existing cluster with same
echo "Deleting old cluster (if exists)..."
kind delete cluster --name $CLUSTER_NAME || true

# create new cluster
echo "Creating new cluster..."
kind create cluster --name $CLUSTER_NAME

# load docker images into kind cluster
echo "Loading Docker images into cluster..."
kind load docker-image k8s-assesment-service-a --name $CLUSTER_NAME
kind load docker-image k8s-assesment-service-b --name $CLUSTER_NAME
kind load docker-image k8s-assesment-service-c --name $CLUSTER_NAME

# apply kuberenets mainfests
echo "Applying Kubernetes manifests..."
kubectl apply -f k8s-manifests/app-config.yaml
kubectl apply -f k8s-manifests/redis.yaml
kubectl apply -f k8s-manifests/service-a.yaml
kubectl apply -f k8s-manifests/service-b.yaml
kubectl apply -f k8s-manifests/service-c.yaml
kubectl apply -f k8s-manifests/hpa.yaml

#setus metrics server to read stats for hpa
echo "Installing Metrics Server..."
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl patch deployment metrics-server -n kube-system \
  --type='json' \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

echo "Waiting for Metrics Server to be ready..."
kubectl wait --namespace kube-system \
  --for=condition=Available deployment/metrics-server \
  --timeout=300s

echo "Waiting for pods to be ready (5 min timeout each)..."
kubectl wait --for=condition=ready pod -l app=service-a --timeout=300s
kubectl wait --for=condition=ready pod -l app=service-b --timeout=300s
kubectl wait --for=condition=ready pod -l app=service-c --timeout=300s

echo "Cluster is up and running!"
kubectl get pods -o wide
