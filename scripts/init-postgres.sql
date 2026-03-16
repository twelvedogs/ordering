-- PostgreSQL Document Store Schema

CREATE DATABASE IF NOT EXISTS ordering;

-- Connect to the ordering database
\c ordering

-- Create the main documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    collection VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id, collection)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_collection ON documents(collection);
CREATE INDEX IF NOT EXISTS idx_documents_collection_created ON documents(collection, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_data_gin ON documents USING GIN (data);

-- Grant permissions (adjust user as needed)
GRANT ALL PRIVILEGES ON DATABASE ordering TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
