# Exercise 2.01: Connecting pods

## In order to run this exercise locally I made the next configuration:
docker-compose.yaml [file](./docker-compose.yml)
```yaml
version: '3.9'

services:
  writer:
    image: writer:v0.3
    container_name: writer
    build:
      context: ./log-output
      dockerfile: Dockerfile.writer
    ports:
      - 3002:3002
    environment:
      - WRITER_URL=http://writer
      - PORT=3002

  reader:
    image: reader:v0.3
    container_name: reader
    build:
      context: ./log-output
      dockerfile: Dockerfile.reader
    ports:
      - 3001:3001
    environment:
      - READER_URL=http://reader
      - WRITER_URL=http://writer
      - PORT=3001
  
  pingpong:
    image: pingpong:v0.4
    container_name: pingpong
    build:
      context: ./pingpong
      dockerfile: Dockerfile
    ports:
      - 5000:5000
    environment:
      - PINGPONG_URL=http://pingpong
      - READER_URL=http://reader
      - PORT=5000
```

Script to create de cluster
```
$ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

Manifest [files](./manifests/)
log-output [files](./log-output/)
pingpong [files](./pingpong/)