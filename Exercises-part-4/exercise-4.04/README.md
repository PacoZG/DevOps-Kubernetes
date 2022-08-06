
# Exercise 4.02: Project v1.7

After doing the following changes to the [server.yaml](./manifests/server.yaml) file
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: server-dep
  namespace: project

...

          readinessProbe:
            initialDelaySeconds: 10
            periodSeconds: 5
            failureThreshold: 10
            httpGet:
              path: /healthz
              port: 3001
          livenessProbe:
            initialDelaySeconds: 20
            periodSeconds: 5
            httpGet:
              path: /healthz
              port: 3001
          resources:
            requests:
              memory: '64Mi'
              cpu: '250m'
            limits:
              memory: '516Mi'
              cpu: '500m'
```
### The rest of the `manifests` can be found [here](./manifests/)

And running the manifests with a wrong `POSTGRES_USER` we can see the following on the terminal by running kubectl describe pod server-dep-...

```
Name:         server-dep-554df65bfd-vqftg
Namespace:    project
Priority:     0
Node:         k3d-k3s-default-agent-1/172.18.0.3
Start Time:   Thu, 04 Aug 2022 15:38:49 +0300
Labels:       app=server
              pod-template-hash=554df65bfd

...

    Liveness:   http-get http://:3001/healthz delay=20s timeout=1s period=5s #success=1 #failure=3
    Readiness:  http-get http://:3001/healthz delay=10s timeout=1s period=5s #success=1 #failure=10
    Environment Variables from:
      postgres-pw  Secret  Optional: false
    Environment:
      POSTGRES_HOST:  <set to the key 'postgres-host' of config map 'config-env-variables'>  Optional: false
      POSTGRES_USER:  <set to the key 'postgres_user' of config map 'config-env-variables'>  Optional: false
      POSTGRES_DB:    <set to the key 'postgres_db' of config map 'config-env-variables'>    Optional: false
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-qkg2m (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             False 
  ContainersReady   False 
  PodScheduled      True 
Volumes:
  kube-api-access-qkg2m:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Burstable
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason     Age              From               Message
  ----     ------     ----             ----               -------
  Normal   Scheduled  20s              default-scheduler  Successfully assigned project/server-dep-554df65bfd-vqftg to k3d-k3s-default-agent-1
  Normal   Pulling    20s              kubelet            Pulling image "sirpacoder/server:v4.02"
  Normal   Pulled     19s              kubelet            Successfully pulled image "sirpacoder/server:v4.02" in 1.034900918s
  Normal   Created    19s              kubelet            Created container server
  Normal   Started    19s              kubelet            Started container server
  Warning  Unhealthy  1s (x2 over 6s)  kubelet            Readiness probe failed: HTTP probe failed with statuscode: 500
```
And the following on the when running kubectl logs server-dep-...

```
Method:  GET
Server URL:  http://10.42.1.54:3001/healthz
Path:  /healthz
Received a request to healthz and responding with status 500
=================================================================================================
Method:  GET
Server URL:  http://10.42.1.54:3001/healthz
Path:  /healthz
=================================================================================================
Method:  GET
Server URL:  http://10.42.1.54:3001/healthz
Path:  /healthz
Received a request to healthz and responding with status 500
Received a request to healthz and responding with status 500
```

And the following when we deploy with the right `POSTGRES_USER`
===


```
Name:         server-dep-554df65bfd-z9jbr
Namespace:    project
Priority:     0
Node:         k3d-k3s-default-agent-1/172.18.0.3
Start Time:   Thu, 04 Aug 2022 15:56:02 +0300

...

    Liveness:   http-get http://:3001/healthz delay=20s timeout=1s period=5s #success=1 #failure=3
    Readiness:  http-get http://:3001/healthz delay=10s timeout=1s period=5s #success=1 #failure=10
    Environment Variables from:
      postgres-pw  Secret  Optional: false
    Environment:
      POSTGRES_HOST:  <set to the key 'postgres-host' of config map 'config-env-variables'>  Optional: false
      POSTGRES_USER:  <set to the key 'postgres_user' of config map 'config-env-variables'>  Optional: false
      POSTGRES_DB:    <set to the key 'postgres_db' of config map 'config-env-variables'>    Optional: false
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-kx7zd (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  kube-api-access-kx7zd:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Burstable
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  43s   default-scheduler  Successfully assigned project/server-dep-554df65bfd-z9jbr to k3d-k3s-default-agent-1
  Normal  Pulling    43s   kubelet            Pulling image "sirpacoder/server:v4.02"
  Normal  Pulled     42s   kubelet            Successfully pulled image "sirpacoder/server:v4.02" in 1.211432001s
  Normal  Created    42s   kubelet            Created container server
  Normal  Started    42s   kubelet            Started container server
```

```
=================================================================================================
Method:  GET
Server URL:  http://10.42.1.54:3001/healthz
Path:  /healthz
=================================================================================================
Method:  GET
Server URL:  http://10.42.1.54:3001/healthz
Path:  /healthz
Received a request to healthz and responding with status 200
Received a request to healthz and responding with status 200
```
---

The image of the client can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the server can be found [here](https://hub.docker.com/r/sirpacoder/server)

We can open the UI on the [http://localhost:8081](http://localhost:8081) port from the broswer

And we can access the backend from [http://localhost:8081/api/todos](http://localhost:8081/api/todos) port in the broswer