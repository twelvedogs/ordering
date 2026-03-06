import { MongoClient, Db } from "mongodb";

// Connection pool manager class
export class ConnectionPool {
    private static instance: ConnectionPool;
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private connectionString: string;
    private poolSize: number;

    private constructor(connectionString: string, poolSize: number = 10) {
        this.connectionString = connectionString;
        this.poolSize = poolSize;
    }

    // Get singleton instance
    public static getInstance(): ConnectionPool {
        if (!ConnectionPool.instance) {
            const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/crud";
            ConnectionPool.instance = new ConnectionPool(uri);
        }
        return ConnectionPool.instance;
    }

    // Initialize connection pool
    public async initialize(): Promise<void> {
        console.log('initialize has client? ' + this.client !==null)
        if (!this.client) {
            this.client = new MongoClient(this.connectionString, {
                maxPoolSize: this.poolSize,
                minPoolSize: 5,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            await this.client.connect();
            this.db = this.client.db("ordering");
        }
    }

    // Get database instance
    public getDatabase(): Db {
        if (!this.db) {
            throw new Error("Database not initialized. Call initialize() first.");
        }
        return this.db;
    }

    // Get MongoDB client
    public getClient(): MongoClient {
        if (!this.client) {
            throw new Error("Client not initialized. Call initialize() first.");
        }
        return this.client;
    }

    // Close all connections
    public async close(): Promise<void> {
        if (this.client) {
            console.log('Closing DB connection!');
            await this.client.close();
            this.client = null;
            this.db = null;
        }
    }

    // Check connection status
    public async isHealthy(): Promise<boolean> {
        if (!this.client) return false;
        try {
            await this.client.db("admin").command({ ping: 1 });
            return true;
        } catch (error) {
            return false;
        }
    }
}
