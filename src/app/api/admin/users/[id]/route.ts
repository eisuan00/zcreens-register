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

// DELETE - Delete user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await verifyAdminAccess(request);

    await connectDB();

    const userId = params.id;

    // Prevent admin from deleting themselves
    if (adminUser._id.toString() === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      );
    }

    // Find and delete the user
    const userToDelete = await User.findById(userId);
    
    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    
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

// PUT - Update user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await verifyAdminAccess(request);

    const { name, email, plan, role } = await request.json();
    const userId = params.id;

    await connectDB();

    // Find the user to update
    const userToUpdate = await User.findById(userId);
    
    if (!userToUpdate) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from changing their own role
    if (adminUser._id.toString() === userId && role && role !== 'admin') {
      return NextResponse.json(
        { error: 'Cannot change your own admin role' },
        { status: 400 }
      );
    }

    // Update user fields
    if (name) userToUpdate.name = name;
    if (email) userToUpdate.email = email.toLowerCase();
    if (plan) userToUpdate.plan = plan;
    if (role) userToUpdate.role = role;

    await userToUpdate.save();

    // Return updated user data (excluding password)
    const userResponse = {
      id: userToUpdate._id,
      name: userToUpdate.name,
      email: userToUpdate.email,
      plan: userToUpdate.plan,
      role: userToUpdate.role,
      storageUsed: userToUpdate.storageUsed,
      storageLimit: userToUpdate.storageLimit,
      createdAt: userToUpdate.createdAt,
      updatedAt: userToUpdate.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Update user error:', error);
    
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
