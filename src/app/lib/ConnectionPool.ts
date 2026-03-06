import { MongoClient, Db } from "mongodb";

export class ConnectionPool {
    private static instance: ConnectionPool;
    private client: MongoClient | null = null;
    private db: Db | null = null;
    private initPromise: Promise<void> | null = null;
    private connectionString: string;
    private poolSize: number;

    private constructor(connectionString: string, poolSize: number = 10) {
        this.connectionString = connectionString;
        this.poolSize = poolSize;
    }

    public static getInstance(): ConnectionPool {
        if (!ConnectionPool.instance) {
            const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/crud";
            ConnectionPool.instance = new ConnectionPool(uri);
        }
        return ConnectionPool.instance;
    }

    public async initialize(): Promise<void> {
        // Use double-checked locking pattern to avoid concurrent initialization
        if (this.client) {
            return; // Already initialized
        }

        // If initialization is in progress, wait for it
        if (this.initPromise) {
            return this.initPromise;
        }

        // Start initialization
        this.initPromise = this._connect();
        await this.initPromise;
    }

    private async _connect(): Promise<void> {
        try {
            this.client = new MongoClient(this.connectionString, {
                maxPoolSize: this.poolSize,
                minPoolSize: 5,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            await this.client.connect();
            this.db = this.client.db("ordering");
            console.log("✓ MongoDB connection pool initialized");
        } catch (error) {
            this.client = null;
            this.db = null;
            this.initPromise = null;
            throw error;
        }
    }

    public getDatabase(): Db {
        if (!this.db) {
            throw new Error("Database not initialized. Call initialize() first.");
        }
        return this.db;
    }

    public getClient(): MongoClient {
        if (!this.client) {
            throw new Error("Client not initialized. Call initialize() first.");
        }
        return this.client;
    }

    public async close(): Promise<void> {
        if (this.client) {
            console.log("✓ Closing MongoDB connection pool");
            await this.client.close();
            this.client = null;
            this.db = null;
            this.initPromise = null;
        }
    }

    public async isHealthy(): Promise<boolean> {
        try {
            if (!this.client) {
                return false;
            }
            await this.client.db("admin").command({ ping: 1 });
            return true;
        } catch (error) {
            return false;
        }
    }
}
