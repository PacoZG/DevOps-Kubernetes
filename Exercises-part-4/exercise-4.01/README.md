
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
NAME                              READY   STATUS             RESTARTS      AGE
log-output-dep-695758d5b4-59prq   1/2     Running            0             46s
pingpong-dep-6b6d4bdbf6-d2n57     0/1     CrashLoopBackOff   1 (11s ago)   46s
pingpong-dep-6b6d4bdbf6-d2n57     0/1     Running            2 (18s ago)   53s
pingpong-dep-6b6d4bdbf6-d2n57     1/1     Running            2 (30s ago)   65s
pingpong-dep-6b6d4bdbf6-d2n57     0/1     Error              2 (34s ago)   69s
pingpong-dep-6b6d4bdbf6-d2n57     0/1     CrashLoopBackOff   2 (2s ago)    70s
pingpong-dep-6b6d4bdbf6-d2n57     0/1     Running            3 (28s ago)   96s
pingpong-dep-6b6d4bdbf6-d2n57     1/1     Running            3 (42s ago)   110s
pingpong-dep-6b6d4bdbf6-d2n57     0/1     Error              3 (44s ago)   112s
pingpong-dep-6b6d4bdbf6-d2n57     0/1     CrashLoopBackOff   3 (3s ago)    115s
postgres-ss-0                     0/1     Pending            0             0s
postgres-ss-0                     0/1     Pending            0             0s
postgres-ss-0                     0/1     ContainerCreating   0             0s
postgres-ss-0                     1/1     Running             0             1s # HERE
pingpong-dep-6b6d4bdbf6-d2n57     0/1     Running             4 (42s ago)   2m34s
pingpong-dep-6b6d4bdbf6-d2n57     1/1     Running             4 (53s ago)   2m45s
log-output-dep-695758d5b4-59prq   2/2     Running             0             2m50s
```
We can notice that when I run ```kubectl apply -f postgres-stateful.yaml``` we can see that right after the commented line as "HERE" the pingpong and log-output pods start running properly

---

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/writer)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/reader)

The image of the hash pingpong can be found [here](https://hub.docker.com/r/sirpacoder/pingpong)