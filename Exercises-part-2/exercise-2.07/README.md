# Exercise 2.07: Stateful applications

## In order to run this exercise locally I made the next configuration:

postgres-stateful.yaml[file](./manifests/postgres-statefulset.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-svc
  namespace: pingpong-log
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
  namespace: pingpong-log
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

Script to create de cluster
```
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

Script to decrypt and run the cluster
```
$ sops --decrypt secret.enc.yaml | kubectl apply -f -

$ kubectl apply -f manifests/
```

The image of the hash pingpong can be found [here](https://hub.docker.com/r/sirpacoder/pingpong)

with that I was able to access the [http://localhost:8081](http://localhost:8081) port from the broswer

I added a [http://localhost:8081/reset-count](http://localhost:8081/reset-count) endpoint to reset the counter

 