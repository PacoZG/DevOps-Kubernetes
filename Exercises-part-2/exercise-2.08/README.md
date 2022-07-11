# Exercise 2.08: Project v1.2

## In order to run this exercise locally I made the next configuration:
yaml file to create [project space](./project/project-space.yaml)
```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: project
  labels:
    name: project
```
---
configuration of the server dep [file](./project/manifests/server-dep.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: server-dep
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
        image: sirpacoder/server:v2.08
        env:
          - name: POSTGRES_HOST
            value: postgres-svc
        envFrom:
          - secretRef:
              name: postgres-pw
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```
---
postgres stateful [file](./project/manifests/postgres-statefulset.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-svc
  namespace: project
  labels:
    app: postgres
spec:
  ports:
  - port: 5432
    name: web
  clusterIP: None
  selector:
    app: postgres
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-ss
  namespace: project
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:13.0
          ports:
            - name: postgres
              containerPort: 5432
          envFrom:
            - secretRef:
                name: postgres-pw
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: local-path
        resources:
          requests:
            storage: 100Mi
```

Including health check to the backend in kubernetes:
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
      - path: /health
        pathType: Prefix
        backend:
          service:
            name: server-svc
            port:
              number: 6662
```
---
The rest of the manifests and project can be found [here](./project)

Script to create de cluster
```
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

We create the namespace:
```
$ kubectl apply -f project-space.yaml
```
Then we decryt and save the variables:
```
$ sops --decrypt secret.enc.yaml | kubectl apply -f -
```

and lastly we deploy all the manifests with the good old:
```
$ kubectl apply -f manifests
```

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

We can open the UI on the [http://localhost:8081](http://localhost:8081) port from the broswer

And we can access the backend from [http://localhost:8081/api/todos](http://localhost:8081/api/todos) port in the broswer