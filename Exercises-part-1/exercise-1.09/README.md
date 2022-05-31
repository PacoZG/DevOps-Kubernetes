# Exercise 1.09: More services

### In order to make te right configuration I implemeted the manifests files as follow:

I configured the ingress.yaml file so that log-output and pingpong apps share the same file

ingress.yaml [file](./manifests/ingress.yaml)
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
      - path: /
        pathType: Prefix
        backend:
          service:
            name: log-output-svc
            port: 
              number: 30081
      - path: /pingpong
        pathType: Prefix
        backend:
          service:
            name: pingpong-svc
            port: 
              number: 30081
```
___
log-output-dep.yaml [file](./manifests/log-output-dep.yml)
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
log-output-service.yaml [file](./manifests/log-output-service.yaml)

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
    targetPort: 3001
```

pingpong-dep.yaml [file](./manifests/pingpong-dep.yml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pingpong
spec:
  replicas: 1
  selector:
    matchLabels:
      app: pingpong
  template:
    metadata:
      labels:
        app: pingpong
    spec:
      containers:
      - name: pingpong
        image: sirpacoder/pingpong:v0.1
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```
pingpong-service.yaml [file](./manifests/pingpong-service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: pingpong-svc
spec:
  selector:
    app: pingpong
  ports:
  - port: 30081
    protocol: TCP
    targetPort: 5000
```

Then created a new cluster using the following script

```
$ k3d cluster create --port 3000:30081@agent:0 -p 8080:80@loadbalancer --agents 2
```
since all the files are located inside the same folder I simply ran the usual script
```
$ kubectl apply -f manifests/
```

with that I was able to access the [http://localhost:8080/api/todos](http://localhost:8080/api/todos) port from the broswer

**The log-out app can be found [here](./log-output/) and the pingpong app can be found [here](./pingpong/)**