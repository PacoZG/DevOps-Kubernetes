# Exercise 3.08: Project v1.5

## It made sense to only scale the server since it is the side of the application that can deal with multiple request and also because of the time that takes for the clinet to deploy in the cluster it just stays in a failing loop.
configuration of the client deployment [file](./manifests/horizontalpodautoscaler.yaml)
```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: server-hpa
  namespace: project
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: server-dep
  minReplicas: 1
  maxReplicas: 6
  targetCPUUtilizationPercentage: 50

```
---
configuration of the server deployment [file](./project/manifests/server-dep.yaml)
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
            valueFrom:
              configMapKeyRef:
                name: config-env-variables
                key: postgres-host
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
The rest of the manifests and project can be found [here](./project/manifests/)

Script to create de cluster
```
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

We create the namespace:
```
$ kubectl apply -f project-space.yaml
```
Do:
```
$ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt
```

Then we decryt and save the variables:
```
$ sops --decrypt secret.enc.yaml | kubectl apply -f -
```

and lastly we deploy all the manifests with the good old:
```
$ kubectl apply -f manifests
```

The image of the hash client can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash server can be found [here](https://hub.docker.com/r/sirpacoder/server)

We can open the UI on the [http://localhost:8081](http://localhost:8081) port from the broswer

And we can access the backend from [http://localhost:8081/api/todos](http://localhost:8081/api/todos) port in the broswer