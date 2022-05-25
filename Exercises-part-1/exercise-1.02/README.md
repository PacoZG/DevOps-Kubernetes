# Exercise 1.02: Project v0.1

### Javascript implementation based on app1 from material example

Implementation of the web server can be found [here](./project)

The steps were pretty much the same as in the exercise 1.01 and are as we can see on the scripts bellow
Below we can find the commands used in the terminal to build the image, push it to Docker Hub and create en run the Kubernetes cluster

```
$ k3d cluster create -a 2

$ kubectl cluster-info

$ k3d kubeconfig get k3s-default

$ kubectl config use-context k3d-k3s-default
```
```
$ docker-compose up

$ docker tag project:v0.1 sirpacoder/project:v0.1

$ docker push sirpacoder/project:v0.1
```

The image can be found [here](https://hub.docker.com/r/sirpacoder/project)

```
$ kubectl create deployment project-dep --image=sirpacoder/project:v0.1

$ kubectl get pods

$ kubectl get deployments

$ kubectl logs -f project-dep-57bc8f8d95-5ldsm
```
The result of the command used can be found in the [script file](./exercise-1.02.txt)