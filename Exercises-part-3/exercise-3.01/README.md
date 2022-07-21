# Exercise 3.01: Pingpong GKE

## After running all the commands necessary to login, create a project and create a cluster in google cloud...
```
$ gcloud auth login
$ gcloud config set project dwk-gke-356913
$ gcloud services enable container.googleapis.com
$ gcloud container clusters create dwk-cluster --zone=europe-north1-b --cluster-version=1.22

$ kubectl apply -f pingpong-space.yaml
$ kubectl config set-context --current --namespace=pingpong-log
$ sops --decrypt secret.enc.yaml | kubectl apply -f -
```
## ...the following changes to the [pingpong-service.yaml](./manifests/pingpong-service.yaml) file were implemented.
```yaml
apiVersion: v1
kind: Service
metadata:
  name: pingpong-svc
  namespace: pingpong-log
spec:
  type: LoadBalancer # This should be the only unfamiliar part
  selector:
    app: pingpong
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 5000
```
### similar to the example on course material
---
### The following command were neccesary to deploy the resources
```
$ kubectl apply -f manifests
$ kubectl get pods
$ kubectl get svc --watch
```

with the following commands we can also check logs, state or errors on our deployments
```
$ kubectl get pods
$ kubectl describe pod <pod-id>
$ kubectl logs <pod-id> --since 1h
```
---

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/writer)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/reader)