
# Exercise 3.01: Pingpong GKE
## the following command, pingpong app and changes to the yaml files were implemented.
### Implementation of the endpoint ``` /pingpong ``` full implementation [here](./pingpong/index.js):
```js
const updateCounter = async () => {
  const rows = await query('SELECT val from pongs WHERE id=1')
  await query(`UPDATE pongs SET val=${rows[0].val + 1}`)
  return `${rows[0].val}`
}

app.get('/pingpong', async (_, res) => {
  console.log('Request to root path /pingpong received')
  const result = await updateCounter()
  res.status(200).send(result)
})
```
---
[ingress.yaml](./manifests/ingress.yaml) file
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
              number: 80
      - path: /pingpong
        pathType: Prefix
        backend:
          service:
            name: pingpong-svc
            port: 
              number: 80
      - path: /reset-count
        pathType: Prefix
        backend:
          service:
            name: pingpong-svc
            port: 
              number: 80
```
---
declaration of resources needed to run the pods were needed to be reconfigured since I encounter many issues while trying to deploy the pods:
In all the deployment yaml files I did the following configuration:
```yaml
...

resources:
  requests:
    memory: "64Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"

...

```
---

In the service yaml files for [pingpong](./manifests/pingpong-service.yaml) and [log-output](./manifests/log-output-service.yaml) I did the following:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: pingpong-svc
  namespace: pingpong-log
spec:
  type: NodePort
  selector:
    app: pingpong
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 5000
```
```yaml
apiVersion: v1
kind: Service
metadata:
  name: log-output-svc
  namespace: pingpong-log
spec:
  type: NodePort
  selector:
    app: log-output
  ports:
    - port: 80
      protocol: TCP
      targetPort: 3001
```
I decided to move the [config-map.yaml](./config-map.yaml) so that the variables won't have to be also deleted every time I run the ```$ kubectl delete -f manifests``` command.

---
### Since the namespace was already created from previous exercise we only needed to make the necessary changes in the following commands:
```
$ kubectl apply -f manifests
$ kubectl get pods
$ kubectl get svc --watch
```

with the following commands we can also check logs, state or errors on our deployments
```
$ kubectl get pods
$ kubectl describe pod <pod-id>
$ kubectl logs <pod-id> --since 1h
```
---

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/writer)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/reader)

The image of the hash pingpong can be found [here](https://hub.docker.com/r/sirpacoder/pingpong)