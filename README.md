# 🚀 DevOps Project: String Validator API

Ce projet est une simple API RESTful Node.js/Express développée dans le cadre d'un projet individuel DevOps. Le but est de démontrer la maîtrise des concepts de la chaîne de valeur DevOps, de l'écriture du code au déploiement automatisé (CI/CD) et à l'observabilité.

---

## 🏗️ Architecture et Composants

| Composant | Technologie/Outil | Rôle dans le Projet |
| :--- | :--- | :--- |
| **Langage/Framework** | Node.js / Express | Implémentation de l'API REST. |
| **Conteneurisation** | Docker | Empaquetage de l'application pour garantir la portabilité. |
| **CI/CD** | GitHub Actions | Automatisation du build, des tests, du scan SAST et de la publication (Docker Hub). |
| **Orchestration** | Kubernetes (Kind) | Déploiement et gestion du cycle de vie du conteneur. |
| **Observabilité** | Pino (Logs), Prom-Client (Métriques) | Instrumentation pour le suivi des requêtes et de la performance. |
| **Sécurité** | Hadolint (SAST), OWASP ZAP (DAST) | Vérification statique du Dockerfile et scan dynamique de l'API déployée. |

---

## 🛠️ Configuration et Prérequis

Assurez-vous d'avoir les outils suivants installés localement :

* **Node.js** (v18+)
* **Git**
* **Docker Desktop** (ou un moteur Docker compatible)
* **Kind** (ou Minikube)
* **kubectl**

---

## 💻 1. Démarrage Local de l'API

1.  **Cloner le dépôt :**
    ```bash
    git clone <URL_DE_VOTRE_DEPOT>
    cd <NOM_DU_DEPOT>
    ```
2.  **Installer les dépendances et exécuter les tests :**
    ```bash
    npm install
    npm test # Vérifie la logique métier
    ```
3.  **Lancer l'API :**
    ```bash
    npm start
    ```
    L'API sera accessible sur `http://localhost:5000`.

### Exemples d'API

| Endpoint | Méthode | Description | Exemple Curl |
| :--- | :--- | :--- | :--- |
| `/health` | `GET` | Vérification de l'état du service. | `curl http://localhost:5000/health` |
| `/api/v1/validate` | `GET` | Validation d'une chaîne (URL). | `curl http://localhost:5000/api/v1/validate?input=https://devops.io` |
| `/metrics` | `GET` | Métriques au format Prometheus. | `curl http://localhost:5000/metrics` |

---

## 🐳 2. Utilisation de Docker

1.  **Construire l'image :**
    ```bash
    docker build -t <VOTRE_USERNAME>/validator-api:latest .
    ```
2.  **Lancer le conteneur :**
    ```bash
    docker run -d -p 8080:5000 --name devops-service <VOTRE_USERNAME>/validator-api:latest
    ```
    L'API sera accessible via `http://localhost:8080`.

---

## 🚢 3. Déploiement Kubernetes (Kind)

### Préparation :

1.  Démarrer le cluster Kind : `kind create cluster --name devops-cluster`
2.  Charger l'image : `kind load docker-image <VOTRE_USERNAME>/validator-api:latest --name devops-cluster`

### Déploiement :

1.  Appliquer les manifestes :
    ```bash
    kubectl apply -f deployment.yaml
    kubectl apply -f service.yaml
    ```
2.  Trouver le Pod (ex: `validator-deployment-xxxxx`) :
    ```bash
    kubectl get pods -l app=string-validator 
    ```
3.  Transférer le port (Port-Forward) :
    ```bash
    kubectl port-forward <NOM_DU_POD> 8080:5000
    ```
    Le service est accessible à `http://localhost:8080`.

---

## 🛡️ 4. CI/CD et Sécurité

Le pipeline CI/CD est géré par **GitHub Actions** (voir `.github/workflows/ci-cd.yml`).

* **Trigger :** Pushed sur `main`.
* **Étapes principales :**
    1.  Installation et **Tests Unitaires** (`npm test`).
    2.  **SAST :** Analyse du `Dockerfile` via Hadolint.
    3.  **Build** de l'image Docker.
    4.  **Publication** sur Docker Hub (`<VOTRE_USERNAME>/devops-validator-api:latest`).

---
