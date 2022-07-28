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

---
The manifests and project can be found [here](./manifests/)

The full Project can be found [here](https://github.com/PacoZG/dwk-project)

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

