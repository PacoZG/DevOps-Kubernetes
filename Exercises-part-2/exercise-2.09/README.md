# Exercise 2.09: Daily todos

## In order to run this exercise locally I made the next configuration:
Shell [file](./project/cronjob/postgres-post.sh) use to create a curl post request
```shell
#!/bin/sh
set -e

if [ $SERVER_URL ]; then
  echo Server URL: $SERVER_URL
  WIKI_PAGE=$(curl -v https://en.wikipedia.org/wiki/Special:Random 2>&1 >/dev/null | grep '< location: ' | cut -c13-153 | tr -d "\r\n")
  echo Page to save: $WIKI_PAGE

  curl -X POST $SERVER_URL -H 'Content-Type: application/json' \
    -d '{"task": "'${WIKI_PAGE}'"}'
fi
```
---
Docker [file](./project/cronjob/Dockerfile) use to create the image
```Dockerfile
FROM alpine/curl:3.14

WORKDIR /usr/src/app

COPY postgres-post.sh ./

CMD [ "./postgres-post.sh" ]
```

yaml file to create [cronjob](./project/manifests/cronjob-curl.yaml)
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: wiki-url
  namespace: project
spec:
  schedule: "* * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: wiki-url
            image: sirpacoder/wiki_url:v2.09
            env:
              - name: SERVER_URL
                value: http://server-svc:6662/api/todos
            imagePullPolicy: Always
          restartPolicy: OnFailure
```
---
configuration of the client deployment [file](./project/manifests/client-dep.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-dep
  namespace: project
spec:
  replicas: 1
  selector:
    matchLabels:
      app: client
  template:
    metadata:
      labels:
        app: client
    spec:
      containers:
      - name: client
        image: sirpacoder/client:v2.08
        env:
          - name: REACT_APP_SERVER_URL
            valueFrom:
              configMapKeyRef:
                name: config-env-variables
                key: server-url
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```
---
configuration of the docker compose deployment [file](./project/docker-compose.yml)
```yaml
version: '3.9'

services:
  
  client:
    image: client:v2.08
    container_name: client
    build:
      context: ./client
      dockerfile: Dockerfile
    environment:
      - REACT_APP_SERVER_URL=http://localhost:3001
    ports:
      - 3000:3000

  server:
    image: server:v2.08
    container_name: server
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - 3001:3001
    environment:
      - PORT=3001
      - POSTGRES_HOST=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres
      - POSTGRES_PORT=5432
    depends_on:
      - postgres
  
  postgres:
    image: postgres:alpine
    container_name: postgres
    restart: unless-stopped
    ports:
      - 5432:5432
    environment:
      - POSTGRES_HOST=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - ./database:/var/lib/postgresql/data
  
  wiki_url:
    image: wiki_url:v2.09
    container_name: wiki_url
    build:
      context: ./cronjob
      dockerfile: Dockerfile
    environment:
      - SERVER_URL=http://server:3001/api/todos


volumes:
    database:
        driver: local
```
---
Configuration of kubernetes cronjob deployment [file](./project/manifests/cronjob-curl.yaml)
```yaml
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
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: local-path
        resources:
          requests:
            storage: 100Mi
```

Including health check to the backend in kubernetes:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: wiki-url
  namespace: project
spec:
  schedule: "* 10 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: wiki-url
            image: sirpacoder/wiki_url:v2.09
            env:
              - name: SERVER_URL
                value: http://server-svc:6662/api/todos
            imagePullPolicy: Always
          restartPolicy: OnFailure
```
---
The rest of the manifests and project can be found [here](./project)

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

The image of the writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

The image of the cronjob can be found [here](https://hub.docker.com/r/sirpacoder/wiki_url)

We can open the UI on the [http://localhost:8081](http://localhost:8081) port from the broswer

And we can access the backend from [http://localhost:8081/api/todos](http://localhost:8081/api/todos) port in the broswer