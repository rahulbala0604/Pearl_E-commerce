import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function resetPwd() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pearl_ecommerce';
    await mongoose.connect(uri);
    
    const hashed = await bcrypt.hash('password', 10);
    await mongoose.connection.db.collection('users').updateOne(
      { email: 'test_admin@example.com' },
      { $set: { password: hashed } }
    );
    console.log("Admin password reset to 'password'");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetPwd();
