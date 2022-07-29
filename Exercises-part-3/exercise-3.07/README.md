# Exercise 3.07: Commitment

## I choose to keep using PVC since it is already integrated on my application and because in my circumstances, and the size and structure of the database it makes sense.

Configuration of the [postgres-db](./postgres-statefulset.yaml) to deploy Persistant Volume Claim
```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: postgres-pvc
  namespace: project
spec:
  storageClassName: project-psql
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 128Mi

---
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: project-psql
  namespace: project
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
  replication-type: regional-pd
allowedTopologies:
  - matchLabelExpressions:
      - key: failure-domain.beta.kubernetes.io/zone
        values:
          - europe-north1-b

---
apiVersion: v1
kind: Service
metadata:
  name: postgres-svc
  namespace: project
  labels:
    app: postgres
spec:
  ports:
    - port: 5432
      name: web
  clusterIP: None
  selector:
    app: postgres

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-ss
  namespace: project
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:13.0
          ports:
            - name: postgres
              containerPort: 5432
          envFrom:
            - secretRef:
                name: postgres-pw
          volumeMounts:
            - name: database
              mountPath: /var/lib/postgresql/database
              subPath: postgres
  volumeClaimTemplates:
    - metadata:
        name: database
      spec:
        accessModes: ['ReadWriteOnce']
        resources:
          requests:
            storage: 100Mi

```

---
The full Project can be found [here](https://github.com/PacoZG/dwk-project)

The manifests can be found [here](https://github.com/PacoZG/dwk-project/tree/main/manifests)

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

