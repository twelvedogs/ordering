podman run --detach --replace \
	--name postgres \
	-p 5432:5432 \
	-e POSTGRES_USER=postgres \
	-e POSTGRES_PASSWORD=postgres \
	-e POSTGRES_DB=ordering \
	-v /home/twelvedogs/podman/postgres/data:/var/lib/postgresql/data \
	docker.io/library/postgres:16-alpine

# Initialize database schema or whatevs
sleep 2
podman exec postgres psql -U postgres -d ordering -c "
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    collection VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id, collection)
);
CREATE INDEX IF NOT EXISTS idx_documents_collection ON documents(collection);
CREATE INDEX IF NOT EXISTS idx_documents_collection_created ON documents(collection, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_data_gin ON documents USING GIN (data);
"
