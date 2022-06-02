# Exercise 1.10: Even more services

### In order to make te right configuration I implemeted the manifests files as follow:

deployment.yaml [file](./log-output/manifests/deployment.yml)
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
        - name: files
      containers:
      - name: reader
        image: sirpacoder/reader
        volumeMounts:
          - name: files
            mountPath: /usr/src/app/files
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
      - name: writer
        image: sirpacoder/writer
        volumeMounts:
          - name: files
            mountPath: /usr/src/app/files
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
```
___
service.yaml [file](./log-output/manifests/service.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: log-output-svc
spec:
  selector:
    app: log-output
  ports:
  - name: reader
    port: 30081
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

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/writer)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/reader)

with that I was able to access the [http://localhost:8080/api/strings](http://localhost:8080/api/strings) port from the broswer

**The full log-output app can be found [here](../exercise-1.10/log-output/)**