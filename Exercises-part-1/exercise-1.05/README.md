# Exercise 1.05: Project v0.3

### Javascript implementation based on app1 from material example

steps after running the deployment

```
$ kubectl get po
NAME                                 READY   STATUS    RESTARTS      AGE
log-output-dep-pnxw9                 1/1     Running   4 (46h ago)   4d21h
hashresponse-dep-869df48685-z8nfl    1/1     Running   2 (46h ago)   3d1h
hashgenerator-dep-548d4d6c8d-kjkk4   1/1     Running   3 (46h ago)   4d18h
project-dep-648c74866b-9bl2r         1/1     Running   0             19s
```

```
$ kubectl port-forward project-dep-648c74866b-9bl2r 3001:3001
```

The image can be found [here](https://hub.docker.com/r/sirpacoder/project)

We can test the projects response doing a GET request to `http://localhost:3001/api/todos` using Postman or use the small client application bellow.
___

We can find the small todo client [here](./project/client/)

The frontend is a React project and can be run as usual with the following:

In the project directory, you can run:

### `npm install`
To install all dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.