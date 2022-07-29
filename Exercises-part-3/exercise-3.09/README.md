
# Exercise 3.09: Resource limits

### As to the resources requierements and limits, I have set them to the following on both the client and server deployments
configuration of the server deployment [file](./project/manifests/server-dep.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:

...

        resources:
          requests:
            memory: '64Mi'
            cpu: '250m'
          limits:
            memory: '516Mi'
            cpu: '500m'
```
I have been using this resouce configuration since the beginning of third part due to the problems I was facing with the deploying to GKE cluster, it has been tested and work properly with local Lens and GKE deployments.
---

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/writer)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/reader)

The image of the hash pingpong can be found [here](https://hub.docker.com/r/sirpacoder/pingpong)