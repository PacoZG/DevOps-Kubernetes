# Exercise 3.04: Project v1.4.1

Configuration of the [workflow](./delete.yaml) to delete environments from the branch
```yaml
name: Delete branch environment

on:
  push:

env:
  PROJECT_ID: ${{ secrets.GKE_PROJECT }}
  GKE_CLUSTER: dwk-cluster
  GKE_ZONE: europe-north1-b

jobs:
  build-todo-app:
    name: Delete
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

      - name: Set kubectl to the right cluster
        run: |-
          gcloud container clusters get-credentials "$GKE_CLUSTER" --zone "$GKE_ZONE"

      - name: Delete deployment
        run: |-
          kubectl delete namespace ${{ github.event.ref }}
```

---
The full Project can be found [here](https://github.com/PacoZG/dwk-project)

The manifests can be found [here](https://github.com/PacoZG/dwk-project/tree/main/manifests)

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

