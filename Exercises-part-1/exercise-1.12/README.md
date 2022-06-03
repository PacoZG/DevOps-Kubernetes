# Exercise 1.11: Even more services
___
### And in order to run the exercise in kubernetes I implemeted the manifests files as follow:
project-dep.yaml [file](./manifests/project-dep.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: project-dep
spec:
  selector:
    matchLabels:
      app: project
  template:
    metadata:
      labels:
        app: project
    spec:
      volumes:
        - name: shared-files
          persistentVolumeClaim:
            claimName: files-claim
      containers:
      - name: project
        image: sirpacoder/project:v0.5
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        volumeMounts:
          - mountPath: /usr/src/app/files
            name: shared-files
```
___
project-service.yaml [file](./manifests/project-serv.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: project-svc
spec:
  selector:
    app: project
  ports:
  - port: 30081
    protocol: TCP
    targetPort: 3001
```
___
image-dep.yaml [file](./manifests/images-dep.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: images
spec:
  selector:
    matchLabels:
      app: images
  template:
    metadata:
      labels:
        app: images
    spec:
      volumes:
        - name: shared-files
          persistentVolumeClaim:
            claimName: files-claim
      containers:
      - name: images
        image: sirpacoder/images:v0.1
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        volumeMounts:
          - mountPath: /usr/src/app/files
            name: shared-files
```
___
image-service.yaml [file](./manifests/images-serv.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: images-svc
spec:
  selector:
    app: images
  ports:
  - port: 30081
    protocol: TCP
    targetPort: 3002
```
___
ingress.yaml [file](./manifests/ingress.yaml)
```yaml
aapiVersion: networking.k8s.io/v1
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
            name: project-svc
            port: 
              number: 30081
      - path: /image
        pathType: Prefix
        backend:
          service:
            name: images-svc
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

The image of the image request app can be found [here](https://hub.docker.com/r/sirpacoder/images)

with that I was able to access the [http://localhost:8080/api/todos](http://localhost:8080/api/todos) to see hash on the broswer

with that I was able to access the [http://localhost:8080/image](http://localhost:8080/image) to see hash on the broswer and the amount of requests made
