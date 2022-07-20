```
gcloud auth login

?
gcloud config get project

gcloud config set project dwk-gke-355822
gcloud services enable container.googleapis.com
gcloud container clusters create dwk-cluster --zone=europe-north1-b --cluster-version=1.22

kubectl apply -f namespace.yaml
kubectl config set-context --current --namespace=pingpong-log
sops --decrypt secret.enc.yaml | kubectl apply -f -
kubectl apply -f ./manifests/
kubectl apply -f ./service.yaml
kubectl get pods

!
kubectl get svc --watch
```