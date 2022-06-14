# Exercise 1.13: Project v0.7

## In order to run this exercise locally I made the next configuration:
docker-compose.yaml [file](./docker-compose.yml)
```yaml
version: '3.9'

services:
  
  client:
    image: client:v0.1
    container_name: project-client
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - 3000:3000
  server:
    image: server:v0.1
    container_name: project-server
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      - PORT=3001
    ports:
      - 3001:3001
    volumes:
      - ./files:/usr/src/app/files
  images:
    image: images:v0.1
    container_name: images
    build:
      context: ./images
      dockerfile: Dockerfile
    environment:
      - PORT=3002
    ports:
      - 3002:3002
    volumes:
      - ./files:/usr/src/app/files
```

The full projects implementation can be found [here](./project/)

The project's client client can be found [here](https://hub.docker.com/r/sirpacoder/client)

The project's server image can be found [here](https://hub.docker.com/r/sirpacoder/server)

You can run the app on your port  [3000](http://localhost:3000)

And make sure the backend runs properly by accessing to [3001/api/todos](http://localhost:3001/api/todos) and [3002/image](http://localhost:3002/image) to see hash on the broswer and check you logs, they will let you know if the request have been successful
