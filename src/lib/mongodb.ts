/* eslint-disable @typescript-eslint/no-explicit-any */
let cachedClient: any = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Import MongoDB dynamically to avoid build issues
    const { MongoClient } = await import('mongodb');
    
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hyperconstructor_core';
    
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }
    
    cachedDb = cachedClient.db('hyperconstructor_core');
    
    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}
