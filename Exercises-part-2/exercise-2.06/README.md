# Exercise 2.03: Keep them separated

## In order to run this exercise locally I made the next configuration:

pingpong-log.yaml[file](./manifests/pingpong-log.yaml)
```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: pingpong-log
  labels:
    name: pingpong-log
```
___
config-map.yaml [file](./manifests/config-map.yaml)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: config-env-variables
  namespace: pingpong-log
data:
  pingpong_url: http://pingpong-svc:6661
  message: Hello
```
___
ingress.yaml [file](./manifests/ingress.yaml)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: log-output
  namespace: pingpong-log
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
              number: 6662
      - path: /pingpong
        pathType: Prefix
        backend:
          service:
            name: pingpong-svc
            port: 
              number: 6661
```
___
log-output-dep.yaml [file](./manifests/log-output-dep.yml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: log-output-dep
  namespace: pingpong-log
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
      volumes:
        - name: shared-files
          emptyDir: {}
      containers:
      - name: writer
        image: sirpacoder/writer:v0.1
        volumeMounts:
          - name: shared-files
            mountPath: /usr/src/app/shared/files
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
      - name: reader
        image: sirpacoder/reader:v0.1
        env:
          - name: PINGPONG_URL
            value: http://pingpong-svc:6661
        volumeMounts: # Mount volume
          - name: shared-files
            mountPath: /usr/src/app/shared/files
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m""
            cpu: "500m"
```
___
log-output-service.yaml [file](./manifests/log-output-service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: log-output-svc
  namespace: pingpong-log
spec:
  type: ClusterIP
  selector:
    app: log-output
  ports:
    - name: reader
      port: 6662
      protocol: TCP
      targetPort: 3001
```
___
pingpong-dep.yaml [file](./manifests/pingpong-dep.yml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pingpong-dep
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
        image: sirpacoder/pingpong:v0.3
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"

```
___
pingpong-service.yaml [file](./manifests/pingpong-service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: pingpong-svc
  namespace: pingpong-log
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

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/writer)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/reader)

The image of the hash pingpong can be found [here](https://hub.docker.com/r/sirpacoder/pingpong)

with that I was able to access the [http://localhost:8081](http://localhost:8081) port from the broswer

* I managed to finished this exercise with the help of [Jami Kousa](https://github.com/Jakousa) by patiently reviewing the code and do the prope fix and refactoring, Thank you!