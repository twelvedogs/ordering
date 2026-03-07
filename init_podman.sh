podman run --detach --replace \
	--name mongo \
	-p 27017:27017 \
	-v /home/twelvedogs/podman/mongodb/data:/data/db \
	-v /home/twelvedogs/podman/mongodb/config:/data/configdb \
	docker.io/library/mongo:latest
