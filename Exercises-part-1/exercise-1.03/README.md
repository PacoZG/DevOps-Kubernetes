# Exercise 1.01: Getting started

### Javascript implementation based on app1 from material example
```javascript
const stringGenerator = () => {
  const randomHash1 = Math.random().toString(36).substring(2,10)
  const randomHash2 = Math.random().toString(36).substring(2,6)
  const randomHash3 = Math.random().toString(36).substring(2,6)
  const randomHash4 = Math.random().toString(36).substring(2,6)
  const randomHash5 = Math.random().toString(36).substring(2,10)

  const newString = [randomHash1, randomHash2, randomHash3, randomHash4, randomHash5].join('-')
  
  const newDate = new Date()

  const result = [newDate.toISOString() , newString].join(': ')

  console.log(result)

  setTimeout(stringGenerator, 5000)
}

stringGenerator()
```
I used the same Dockerfile to build the image but I implemented a basic docker-compose file to run it
```yml
version: '3.9'

services:
  log-output:
    image: log-output
    build:
      context: .
      dockerfile: Dockerfile
    container_name: log-output
```
Below we can find the commands used in the terminal to build the image, push it to Docker Hub and create en run the Kubernetes cluster

```
$ k3d cluster create -a 2

$ kubectl cluster-info

$ k3d kubeconfig get k3s-default

$ kubectl config use-context k3d-k3s-default
```
```
$ docker-compose up

$ docker tag log-output sirpacoder/log-output

$ docker push sirpacoder/log-output
```
```
$ kubectl create deployment log-output-dep --image=sirpacoder/log-output

$ kubectl get pods

$ kubectl get deployments

$ kubectl logs -f log-output-dep-57bc8f8d95-5ldsm
```
The result of the command used can be found in the [script file](./exercise-1.01.txt)