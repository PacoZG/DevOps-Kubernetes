
# Exercise 4.01: Readiness Probe

[log-output.yaml](./manifests/log-output.yaml) file
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: log-output-dep
  namespace: pingpong-log

...

      - name: reader
        imagePullPolicy: Always
        image: sirpacoder/reader:v4.01
        env:
        - name: PINGPONG_URL
          valueFrom:
            configMapKeyRef:
              name: config-env-variables
              key: pingpong_url
        - name: MESSAGE
          valueFrom:
            configMapKeyRef:
              name: config-env-variables
              key: message
        volumeMounts:
          - name: shared-files
            mountPath: /usr/src/app/shared/files
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        readinessProbe:
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 30
          httpGet:
            path: /healthz
            port: 3001
```

[pingpong.yaml](./manifests/pingpong.yaml)
---
declaration of resources needed to run the pods were needed to be reconfigured since I encounter many issues while trying to deploy the pods:
In all the deployment yaml files I did the following configuration:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pingpong-dep
  namespace: pingpong-log

...

        readinessProbe:
          initialDelaySeconds: 10
          periodSeconds: 5
          httpGet:
              path: /healthz
              port: 5000
```
---

After running ```kubectl apply -f manifests``` for all the yaml files except postgres.yaml we have the folloing:

```bash
➜  exercise-4.01 git:(main) ✗ kubectl get po --watch
NAME                              READY   STATUS    RESTARTS   AGE
pingpong-dep-857c6c95d6-6qgd6     0/1     Running   0          5s
log-output-dep-55fcfdf756-94qtf   1/2     Running   0          5s
pingpong-dep-857c6c95d6-6qgd6     0/1     Error     0          27s
pingpong-dep-857c6c95d6-6qgd6     0/1     Running   1 (2s ago)   29s
pingpong-dep-857c6c95d6-6qgd6     0/1     Error     1 (28s ago)   55s
pingpong-dep-857c6c95d6-6qgd6     0/1     CrashLoopBackOff   1 (15s ago)   69s
pingpong-dep-857c6c95d6-6qgd6     0/1     Running            2 (17s ago)   71s
pingpong-dep-857c6c95d6-6qgd6     0/1     Error              2 (41s ago)   95s
pingpong-dep-857c6c95d6-6qgd6     0/1     CrashLoopBackOff   2 (12s ago)   106s
pingpong-dep-857c6c95d6-6qgd6     0/1     Running            3 (26s ago)   2m
postgres-ss-0                     0/1     Pending            0             0s
postgres-ss-0                     0/1     Pending            0             0s
postgres-ss-0                     0/1     ContainerCreating   0             0s
postgres-ss-0                     1/1     Running             0             2s # HERE
pingpong-dep-857c6c95d6-6qgd6     1/1     Running             3 (51s ago)   2m25s
log-output-dep-55fcfdf756-94qtf   2/2     Running             0             2m30s
```

By running ```kubectl describe pod log-output-dep-55fcfdf756-94qtf``` we can see the following: 
```
Name:         pingpong-dep-857c6c95d6-6qgd6
Namespace:    pingpong-log

...

    Ready:          False
    Restart Count:  1
    Limits:
      cpu:     500m
      memory:  516Mi
    Requests:
      cpu:      250m
      memory:   64Mi
    Readiness:  http-get http://:5000/health delay=10s timeout=1s period=5s #success=1 #failure=30
    Environment Variables from:
      postgres-pw  Secret  Optional: false
    Environment:
      PORT:           5000
      POSTGRES_HOST:  postgres-svc

...

QoS Class:                   Burstable
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  57s                default-scheduler  Successfully assigned pingpong-log/pingpong-dep-857c6c95d6-6qgd6 to k3d-k3s-default-agent-1
  Normal   Pulled     56s                kubelet            Successfully pulled image "sirpacoder/pingpong:v4.01" in 1.089367251s
  Normal   Pulling    31s (x2 over 58s)  kubelet            Pulling image "sirpacoder/pingpong:v4.01"
  Normal   Pulled     29s                kubelet            Successfully pulled image "sirpacoder/pingpong:v4.01" in 1.317341292s
  Normal   Created    29s (x2 over 56s)  kubelet            Created container pingpong
  Normal   Started    29s (x2 over 56s)  kubelet            Started container pingpong
  Warning  Unhealthy  8s (x6 over 43s)   kubelet            Readiness probe failed: HTTP probe failed with statuscode: 500
  Warning  BackOff    4s                 kubelet            Back-off restarting failed container
```

We can notice that when I run ```kubectl apply -f postgres-stateful.yaml``` we can see that right after the commented line as "HERE" the pingpong and log-output pods start running properly. So if I run ```kubectl describe pod log-output-dep-55fcfdf756-94qtf``` we can now see the following:

```
...

Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True

...
```

---

With that I was able to access the [http://localhost:8081/log](http://localhost:8081/log) port from the broswer

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/writer)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/reader)

The image of the hash pingpong can be found [here](https://hub.docker.com/r/sirpacoder/pingpong)