/**
 * Service for user related business logic
 */
import User, { IUser } from '../models/user';

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

interface UserAuthResponse {
  token: string;
  user: {
    id: string | unknown;
    name: string;
    email: string;
  };
}

export const userService = {
  /**
   * Register a new user
   */
  registerUser: async (userData: RegisterUserData): Promise<UserAuthResponse> => {
    const { name, email, password } = userData;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User with this email already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = user.getSignedJwtToken();

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };
  },

  /**
   * Login a user
   */
  loginUser: async (email: string, password: string): Promise<UserAuthResponse> => {
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Email not found');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error('Password does not match');
    }

    // Generate token
    const token = user.getSignedJwtToken();

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
  }
};