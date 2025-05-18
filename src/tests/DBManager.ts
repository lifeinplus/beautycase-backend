import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

class DBManager {
    private mongo: MongoMemoryServer | null = null;

    async start() {
        this.mongo = await MongoMemoryServer.create();
        const uri = this.mongo.getUri();
        await mongoose.connect(uri);
    }

    async cleanup() {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }

    async stop() {
        await mongoose.disconnect();
        if (this.mongo) await this.mongo.stop();
    }
}

export default DBManager;
