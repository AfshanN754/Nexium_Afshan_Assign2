import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local", debug: true }); // Enable debug

console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = "blogSummarizer";

let client: MongoClient;

export async function connectToMongo() {
  if (!client) {
    try {
      client = new MongoClient(uri);
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  }
  return client.db(dbName);
}

export async function disconnectMongo() {
  if (client) {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

export async function saveFullText(url: string, fullText: string) {
  const db = await connectToMongo();
  const collection = db.collection("fullTexts");
  await collection.insertOne({ url, fullText, createdAt: new Date() });
  console.log(`Saved full text for ${url}`);
}