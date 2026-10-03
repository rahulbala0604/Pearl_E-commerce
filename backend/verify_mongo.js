import mongoose from 'mongoose';

async function checkMongo() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pearl_ecommerce';
    console.log(`Connecting to ${uri}...`);
    await mongoose.connect(uri);
    console.log('MongoDB: CONNECTED');
    
    const db = mongoose.connection.db;
    console.log('Database:', db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log('Collections found:');
    collections.forEach(c => console.log(`- ${c.name}`));
    
    process.exit(0);
  } catch (err) {
    console.error('MongoDB: NOT CONNECTED');
    console.error(err);
    process.exit(1);
  }
}

checkMongo();
