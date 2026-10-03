import mongoose from 'mongoose';

async function checkData() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pearl_ecommerce';
    await mongoose.connect(uri);
    
    const db = mongoose.connection.db;
    const usersCount = await db.collection('users').countDocuments();
    const adminUser = await db.collection('users').findOne({ role: 'admin' });
    const productsCount = await db.collection('products').countDocuments();
    
    console.log(`Users: ${usersCount}`);
    if (adminUser) console.log(`Admin found: ${adminUser.email}`);
    else console.log(`No admin found`);
    
    console.log(`Products: ${productsCount}`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
