# Exercise 2.10: Project v1.3

## In order to run this exercise locally I made the next configuration:
We can see in the image above how the logs are present on the Grafana UI.

![logs](./image/Screenshot%202022-07-13%20at%2015.39.06.png)

In order to limit the length of the todo I ahd to refactor and implement limitations at the front and baclkend of the project, at the same timeI had to be able to use special characters when passing string to the postgresql using the funtion ```escapeLiteral(body.task)``` to avoid possible manipulation of data from third parties. That's the reason why this part also includes the projects code.

---
The rest of the manifests and project can be found [here](./project)

The image of the hash writer can be found [here](https://hub.docker.com/r/sirpacoder/client)

The image of the hash reader can be found [here](https://hub.docker.com/r/sirpacoder/server)

We can open the UI on the [http://localhost:8081](http://localhost:8081) port from the broswer

And we can access the backend from [http://localhost:8081/api/todos](http://localhost:8081/api/todos) port in the broswer