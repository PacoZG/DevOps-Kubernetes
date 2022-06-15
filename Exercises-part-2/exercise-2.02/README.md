# Exercise 2.02: Project v1.0

## In order to run this exercise locally I made the next configuration:
docker-compose.yaml [file](./docker-compose.yml)
```yaml
version: '3.9'

services:
  
  client:
    image: client:v0.1
    container_name: project-client
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - 3000:3000

  server:
    image: server:v0.1
    container_name: project-server
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      - PORT=8081
    ports:
      - 8081:8081
```
___
ingress.yaml [file](./manifests/ingress.yaml)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: project
  labels:
    name: project
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: client-svc
            port: 
              number: 6661
      - path: /api/todos
        pathType: Prefix
        backend:
          service:
            name: server-svc
            port:
              number: 6662
```
___
client-dep.yaml [file](./manifests/client-dep.yml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: client
  template:
    metadata:
      labels:
        app: client
    spec:
      containers:
      - name: client
        image: sirpacoder/client:v0.1
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```
___
client-serv.yaml [file](./manifests/client-serv.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: client-svc
spec:
  type: NodePort
  selector:
    app: client
  ports:
  - name: client
    port: 6661
    protocol: TCP
    targetPort: 3000
    nodePort: 30081
```
___
server-dep.yaml [file](./manifests/server-dep.yml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: server-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: server
  template:
    metadata:
      labels:
        app: server
    spec:
      containers:
      - name: server
        image: sirpacoder/server:v0.1
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```
___
server-serv.yaml [file](./manifests/server-serv.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: pingpong-svc
spec:
  type: ClusterIP
  selector:
    app: pingpong
  ports:
  - name: pingpong
    port: 6661
    protocol: TCP
    targetPort: 5000
```

Script to create de cluster
```
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

We can open the UI on the [http://localhost:8081](http://localhost:8081) port from the broswer

And we can access the backend from [http://localhost:8081/api/todos](http://localhost:8081/api/todos) port in the broswer