# Variables - À modifier avec vos informations
IMAGE_NAME = devops-validator-api
DOCKER_USER = sarrahamz
TAG = latest
CLUSTER_NAME = devops-cluster

.PHONY: help install test build run-docker kind-setup kind-load deploy-k8s clean

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# --- LOCAL ---
install: ## Installe les dépendances Node.js
	npm install

test: ## Lance les tests unitaires (Jest)
	npm test

# --- DOCKER ---
build: ## Construit l'image Docker localement
	docker build -t $(DOCKER_USER)/$(IMAGE_NAME):$(TAG) .

run-docker: ## Lance le conteneur Docker localement sur le port 8080
	docker run -d -p 8080:5000 --name $(IMAGE_NAME)-container $(DOCKER_USER)/$(IMAGE_NAME):$(TAG)

# --- KUBERNETES (KIND) ---
kind-setup: ## Crée le cluster Kind
	kind create cluster --name $(CLUSTER_NAME)

kind-load: build ## Construit l'image et la charge dans Kind
	kind load docker-image $(DOCKER_USER)/$(IMAGE_NAME):$(TAG) --name $(CLUSTER_NAME)

deploy-k8s: ## Déploie l'application sur Kind
	kubectl apply -f deployment.yaml
	kubectl apply -f service.yaml
	@echo "Attente du déploiement..."
	kubectl rollout status deployment/validator-deployment

port-forward: ## Lance le tunnel pour accéder à l'API (localhost:8080)
	@echo "API accessible sur http://localhost:8080"
	kubectl port-forward $$(kubectl get pods -l app=string-validator -o jsonpath='{.items[0].metadata.name}') 8080:5000

# --- NETTOYAGE ---
clean: ## Supprime le conteneur Docker et le cluster Kind
	docker stop $(IMAGE_NAME)-container || true
	docker rm $(IMAGE_NAME)-container || true
	kind delete cluster --name $(CLUSTER_NAME)