podman run --detach --replace --name mongo -p 27017:27017 -v mongo_data:/data/db docker.io/library/mongo:latest
