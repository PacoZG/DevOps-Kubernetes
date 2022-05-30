# Exercise 1.07: External access with Ingress

### In order to make te right configuration I implemeted the manifests files as follow:

deployment.yaml [file](./log-output/manifests/deployment.yml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: log-output
spec:
  replicas: 1
  selector:
    matchLabels:
      app: log-output
  template:
    metadata:
      labels:
        app: log-output
    spec:
      containers:
      - name: log-output
        image: sirpacoder/log-output:v0.3
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```
___
ingress.yaml [file](./log-output/manifests/ingress.yaml)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: log-output
  labels:
    name: log-output
spec:
  rules:
  - http:
      paths:
      - path: "/"
        pathType: Prefix
        backend:
          service:
            name: log-output-svc
            port: 
              number: 30081
```
___
service.yaml [file](./project/manifests/service.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: log-output-svc
spec:
  selector:
    app: log-output
  ports:
  - port: 30081
    protocol: TCP
    targetPort: 5000
```
then created a new cluster using the following script

```
$ k3d cluster create --port 3000:30081@agent:0 -p 8080:80@loadbalancer --agents 2
```
followed by
```
$ kubectl apply -f manifests/
```

with that I was able to access the [http://localhost:8080/api/todos](http://localhost:8080/api/todos) port from the broswer