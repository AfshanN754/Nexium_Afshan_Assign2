import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function saveFullText(url: string, fullText: string) {
  try {
    await client.connect();
    const db = client.db('blog_summarizer');
    const collection = db.collection('full_texts');
    await collection.insertOne({ url, fullText, createdAt: new Date() });
  } catch (error) {
    console.error('MongoDB error:', error);
    throw new Error('Failed to save full text');
  } finally {
    await client.close();
  }
}