# Exercise 1.11: Even more services

## In order to run this exercise locally I made the next configuration:
docker-compose.yaml [file](./docker-compose.yml)
```yaml
version: '3.9'

services:
  writer:
    image: writer:v0.1
    container_name: writer
    build:
      context: ./log-output
      dockerfile: Dockerfile.writer
    environment:
      - PORT=3002
    ports:
      - 3002:3002
    volumes:
      - ./files:/usr/src/app/files
  reader:
    image: reader:v0.1
    container_name: reader
    build:
      context: ./log-output
      dockerfile: Dockerfile.reader
    environment:
      - PORT=3001
    ports:
      - 3001:3001
    volumes:
      - ./files:/usr/src/app/files
  log-output:
    image: pingpong:v0.2
    container_name: pingpong
    build:
      context: ./pingpong
      dockerfile: Dockerfile
    environment:
      - PORT=5000
    ports:
      - 5000:5000
    volumes:
      - ./files:/usr/src/app/files
```
___
### And in order to run the exercise in kubernetes I implemeted the manifests files as follow:
log-output-dep.yaml [file](./manifests/log-output-dep.yml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: log-output-dep
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
          persistentVolumeClaim:
            claimName: files-claim
      containers:
      - name: reader
        image: sirpacoder/reader
        volumeMounts:
          - name: shared-files
            mountPath: /usr/src/app/files
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
      - name: writer
        image: sirpacoder/writer
        volumeMounts:
          - name: shared-files
            mountPath: /usr/src/app/files
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
      volumes:
        - name: shared-files
          persistentVolumeClaim:
            claimName: files-claim
      containers:
      - name: pingpong
        image: sirpacoder/pingpong:v0.2
        volumeMounts:
          - name: shared-files
            mountPath: /usr/src/app/files
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
spec:
  selector:
    app: pingpong
  ports:
  - port: 30081
    protocol: TCP
    targetPort: 5000
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
persistantvolumeclaim [file](./manifests/persistentvolumeclaim.yaml)
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: files-claim
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```
___
persistentvolume.yaml
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  storageClassName: manual
  capacity:
    storage: 1Gi # Could be e.q. 500Gi. Small amount is to preserve space when testing locally
  volumeMode: Filesystem # This declares that it will be mounted into pods as a directory
  accessModes:
  - ReadWriteOnce
  local:
    path: /tmp/kube
  nodeAffinity: ## This is only required for local, it defines which nodes can access it
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - k3d-k3s-default-agent-0
```

then created a new cluster using the following script

Before running the script to build the pods it was neccesary to run:
```
$ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
```

```
$ k3d cluster create --port 3000:30081@agent:0 -p 8080:80@loadbalancer --agents 2
```
followed by
```
$ kubectl apply -f manifests/
```

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/writer)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/reader)

The image of the pingpong can be found [here](https://hub.docker.com/r/sirpacoder/pingpong)

with that I was able to access the [http://localhost:8080/api/strings](http://localhost:8080/api/strings) to see hash on the broswer

with that I was able to access the [http://localhost:8080/pingpong](http://localhost:8080/pingpong) to see hash on the broswer and the amount of requests made
