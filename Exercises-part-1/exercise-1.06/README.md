# Exercise 1.06: Project v0.4

### This exercise has the same content in the root folder as in previous exercise, the only difference is the implementarion of the service.yaml file and the commands used to be able to access to the deployment port via the browser.

I implemented the service.yaml [file](./project//manifests/service.yaml) with the following configuration:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: project-dep
spec:
  type: NodePort
  selector:
    app: project
  ports:
  - name: project-server
    nodePort: 30081
    protocol: TCP
    port: 3004
    targetPort: 3001

```

and then created a new cluster using the following script

```
$ k3d cluster create --port 3001:30081@agent:0 -p 3000:80@loadbalancer --agents 2
```

with that I was able to access the [http://localhost:3001api/todos](http://localhost:3001/api/todos) port from the broswer