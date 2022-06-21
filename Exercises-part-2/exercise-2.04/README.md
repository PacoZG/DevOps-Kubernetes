# Exercise 2.02: Project v1.0

## In order to run this exercise locally I made the next configuration:
project.yaml [file](./manifests//project.yaml)
```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: project
  labels:
    name: project
```
___
ingress.yaml [file](./manifests/ingress.yaml)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: project
  namespace: project
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
  namespace: project
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
        env:
          - name: REACT_APP_SERVER_URL
            value: http://localhost:8081
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
  namespace: project
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
  namespace: project
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
  name: server-svc
  namespace: project
spec:
  type: ClusterIP
  selector:
    app: server
  ports:
  - name: server
    port: 6662
    protocol: TCP
    targetPort: 3001
```
___
Verification of result on the terminal:

```
➜  exercise-2.04 git:(main) ✗ kubectl apply -f manifests/
deployment.apps/client-deployment created
service/client-svc created
ingress.networking.k8s.io/project created
namespace/project unchanged
deployment.apps/server-deployment unchanged
service/server-svc unchanged
➜  exercise-2.04 git:(main) ✗ kubectl get namespaces
NAME              STATUS   AGE
default           Active   6d15h
kube-system       Active   6d15h
kube-public       Active   6d15h
kube-node-lease   Active   6d15h
pingpong-log      Active   14m
project           Active   30s
➜  exercise-2.04 git:(main) ✗ kubens project
Context "k3d-k3s-default" modified.
Active namespace is "project".
➜  exercise-2.04 git:(main) ✗ kubectl get pods
NAME                                 READY   STATUS    RESTARTS   AGE
client-deployment-6bbf4cc7b6-4jbqz   1/1     Running   0          45s
server-deployment-6c9b89997c-x4m4b   1/1     Running   0          53s
```

Script to create de cluster
```
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

We can open the UI on the [http://localhost:8081](http://localhost:8081) port from the broswer

And we can access the backend from [http://localhost:8081/api/todos](http://localhost:8081/api/todos) port in the broswer