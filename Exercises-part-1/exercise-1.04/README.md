# Exercise 1.04: Project v0.2

### Javascript implementation 

```
$ docker-compose up

$ docker tag project:v0.2 sirpacoder/project:v0.2

$ docker push sirpacoder/project:v0.2
```

The image can be found [here](https://hub.docker.com/r/sirpacoder/project)

### Once I have my new image created and deployed to Docker Hub I could configured my deployment.yml file

```yml
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
      containers:
      - name: project
        image: sirpacoder/project:v0.2
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 3001
```

```
$ kubectl apply -f manifests/deployment.yaml

$ kubectl get pods

$ kubectl get deployments

$ kubectl logs -f project-dep-7584b5f7c9-przhw
```
The result of the command used can be found in the [script file](./exercise-1.04.txt)