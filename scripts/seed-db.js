const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zcreens';

// User schema (simplified version)
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'business'],
    default: 'free',
  },
  storageUsed: {
    type: Number,
    default: 0,
  },
  storageLimit: {
    type: Number,
    default: 100, // 100MB for free plan
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update storage limits based on plan
UserSchema.pre('save', function (next) {
  if (this.isModified('plan')) {
    switch (this.plan) {
      case 'free':
        this.storageLimit = 100; // 100MB
        break;
      case 'pro':
        this.storageLimit = 1000; // 1GB
        break;
      case 'business':
        this.storageLimit = 5000; // 5GB
        break;
    }
  }
  next();
});

const User = mongoose.model('User', UserSchema);

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'user@example.com' });
    if (existingUser) {
      console.log('Test user already exists!');
      console.log('Email: user@example.com');
      console.log('Password: user');
      return;
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password', // Changed to meet minimum length requirement
      plan: 'pro', // Give them pro plan for testing
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: user@example.com');
    console.log('🔑 Password: password');
    console.log('📦 Plan: pro (1GB storage)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
