import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

// Helper function to verify admin access
async function verifyAdminAccess(request: NextRequest) {
  // Get the authorization header
  const authHeader = request.headers.get('authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Try to get token from cookies as fallback
    const cookies = request.headers.get('cookie');
    if (cookies) {
      const tokenMatch = cookies.match(/auth-token=([^;]+)/) || cookies.match(/authToken=([^;]+)/);
      if (tokenMatch) {
        token = tokenMatch[1];
      }
    }
  }

  if (!token) {
    throw new Error('No authentication token provided');
  }

  // Verify the JWT token
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  let decoded;
  
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }

  // Connect to database
  await connectDB();

  // Find the user and check if admin
  const user = await User.findById(decoded.userId).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return user;
}

// GET - List all users (admin only)
export async function GET(request: NextRequest) {
  try {
    await verifyAdminAccess(request);

    await connectDB();

    // Get all users (excluding passwords)
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });

  } catch (error) {
    console.error('Get users error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Admin access required') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
      if (error.message.includes('token')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    await verifyAdminAccess(request);

    const { name, email, password, plan, role } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      plan: plan || 'free',
      role: role || 'user'
    });

    await newUser.save();

    // Return user data (excluding password)
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      plan: newUser.plan,
      role: newUser.role,
      storageUsed: newUser.storageUsed,
      storageLimit: newUser.storageLimit,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Create user error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Admin access required') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
      if (error.message.includes('token')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
