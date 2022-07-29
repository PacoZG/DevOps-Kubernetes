# Exercise 3.08: Project v1.5

## It made sense to scale the server and the postgre deployments since we want those pods to be always available.
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

---
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: postgres-hpa
  namespace: project
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: StatefulSet
    name: postgres-ss
  minReplicas: 1
  maxReplicas: 6
  targetCPUUtilizationPercentage: 50
```
---

### As to the resources requierements and limits, I have set them to the following on both the client and server deployments
configuration of the server deployment [file](./project/manifests/server-dep.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:

...

        resources:
          requests:
            memory: '64Mi'
            cpu: '250m'
          limits:
            memory: '516Mi'
            cpu: '500m'
```
I have been using this resouce configuration since the beginning of third part due to the problems I was facing with the deploying to GKE cluster. 

---
The manifests for the local deployment can be found [here](./manifests/)

The manifests for the gcloud deployment can be found [here](https://github.com/PacoZG/dwk-project/tree/main/manifests)

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

The image of the client can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the server can be found [here](https://hub.docker.com/r/sirpacoder/server)

We can open the UI on the [http://localhost:8081](http://localhost:8081) port from the broswer

And we can access the backend from [http://localhost:8081/api/todos](http://localhost:8081/api/todos) port in the broswer