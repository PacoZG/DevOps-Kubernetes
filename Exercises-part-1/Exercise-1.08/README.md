# Exercise 1.07: External access with Ingress

### In order to make te right configuration I implemeted the manifests files as follow:

deployment.yaml [file](./log-output/manifests/deployment.yml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: project-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: project-server
  template:
    metadata:
      labels:
        app: project-server
    spec:
      containers:
      - name: project-server
        image: sirpacoder/project:v0.5
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
  name: project-server
  labels:
    name: project-server
spec:
  rules:
  - http:
      paths:
      - path: "/"
        pathType: Prefix
        backend:
          service:
            name: project-server-svc
            port: 
              number: 30081
```
___
service.yaml [file](./project/manifests/service.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: project-server-svc
spec:
  selector:
    app: project-server
  ports:
  - port: 30081
    protocol: TCP
    targetPort: 3001
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

**The full project can be found [here](../../project/)**