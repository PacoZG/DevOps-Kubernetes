# Exercise 3.03: Project v1.4

## In order to run this exercise locally I made the next configuration:

### Command used for ```Kustomize```:
```
$ kustomize edit add resource manifests/*.yaml

$ kubectl apply -k .

$ kubectl kustomize .
```

### Command for workflow configuration
```
$ gcloud iam service-accounts keys create ./private-key.json \
    --iam-account=github-actions@dwk-gke-<id_number>.iam.gserviceaccount.com
```
Output:
```
created key [f4d6c7ed4b6939fcf67b144479e38e4ceeb7c3cf] of type [json] as [./private-key.json] for [github-actions@dwk-gke-<id_number>.iam.gserviceaccount.com]

```
### Cluster deployment to GCloud before running the github workflow
```
$ kubectl apply -f project-space.yaml

$ kubectl config set-context --current --namespace=project

$ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt

$ sops --decrypt secret.enc.yaml | kubectl apply -f -
```

Configuration of the [workflow](./main.yaml)
```yaml
name: Release application

on:
  push:

env:
  PROJECT_ID: ${{ secrets.GKE_PROJECT }}
  GKE_CLUSTER: dwk-cluster
  GKE_ZONE: europe-north1-b
  CLIENT_IMAGE: client
  SERVER_IMAGE: server
  CRONJOB_IMAGE: wiki-url

jobs:
  build-todo-app:
    name: Build ToDo App
    runs-on: ubuntu-20.04

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
        with:
          project_id: ${{ secrets.GKE_PROJECT }}
          service_account_key: ${{ secrets.GKE_SA_KEY }}
          export_default_credentials: true

      - name: Configure docker to use the gcloud command-line tool as a credential helper
        run: gcloud --quiet auth configure-docker

      - name: Set kubectl to the right cluster
        run: gcloud container clusters get-credentials "$GKE_CLUSTER" --zone "$GKE_ZONE"

      - name: Build Client Image
        run: |-
          docker build --tag "gcr.io/$PROJECT_ID/$CLIENT_IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA" ./client
      - name: Build Server Image
        run: |-
          docker build --tag "gcr.io/$PROJECT_ID/$SERVER_IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA" ./server
      - name: Build Cronjob Image
        run: |-
          docker build --tag "gcr.io/$PROJECT_ID/$CRONJOB_IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA" ./cronjob
      - name: Publish Client Image
        run: |-
          docker push "gcr.io/$PROJECT_ID/$CLIENT_IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"
      - name: Publish Server Image
        run: |-
          docker push "gcr.io/$PROJECT_ID/$SERVER_IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"
      - name: Publish Cronjob Image
        run: |-
          docker push "gcr.io/$PROJECT_ID/$CRONJOB_IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"

      - name: Set up Kustomize
        uses: imranismail/setup-kustomize@v1

      - name: Deploy
        run: |-
          kubectl config set-context --current --namespace=project
          kustomize edit set image gcr.io/CLIENT/IMAGE=gcr.io/$PROJECT_ID/$CLIENT_IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA
          kustomize edit set image gcr.io/SERVER/IMAGE=gcr.io/$PROJECT_ID/$SERVER_IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA
          kustomize edit set image gcr.io/CRONJOB/IMAGE=gcr.io/$PROJECT_ID/$CRONJOB_IMAGE:${GITHUB_REF#refs/heads/}-$GITHUB_SHA
          kustomize build . | kubectl apply -f -
          kubectl rollout status deployment $CLIENT_IMAGE-dep
          kubectl rollout status deployment $SERVER_IMAGE-dep
          kubectl get services -o wide
```

---
The manifests can be found [here](./manifests/)

The full Project can be found [here](https://github.com/PacoZG/dwk-project)

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

