import { FastifyReply, FastifyRequest } from 'fastify';
import { auth, firestore } from '../../config/firebase';
import { ApiError } from '../apiError';
import { ResponseHandler } from '../utils/responseHandler';
import { User } from '../types/request';

// Store active sessions
const activeSessions = new Map<
  string,
  {
    lastActive: number;
    userAgent: string;
    ip: string;
  }
>();

// Session timeout (24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

export const verifyToken = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Get or create user document in Firestore
    const userRef = firestore.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();

    let userData;
    if (!userDoc.exists) {
      // Create new user document if it doesn't exist
      userData = {
        id: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0],
        bio: '',
        avatarUrl: decodedToken.picture || '',
        householdId: '',
        created: new Date().toISOString(),
      };
      await userRef.set(userData);
    } else {
      userData = userDoc.data();
    }

    // Add the user to the request object for use in other handlers
    (req as FastifyRequest & { user: User }).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    return ResponseHandler.success(res, {
      status: 200,
      data: {
        user: userData,
      },
    });
  } catch (error) {
    throw ApiError.unauthorized('Invalid token');
  }
};

// Middleware to protect routes
export const requireAuth = async (req: FastifyRequest, _res: FastifyReply) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Get user's IP and User-Agent
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Check if this is a new session
    const sessionKey = `${decodedToken.uid}-${ip}-${userAgent}`;
    const currentSession = activeSessions.get(sessionKey);

    if (!currentSession) {
      // New session - store it
      activeSessions.set(sessionKey, {
        lastActive: Date.now(),
        userAgent,
        ip,
      });
    } else {
      // Existing session - check if it's expired
      if (Date.now() - currentSession.lastActive > SESSION_TIMEOUT) {
        activeSessions.delete(sessionKey);
        throw ApiError.unauthorized('Session expired');
      }
      // Update last active time
      currentSession.lastActive = Date.now();
    }

    // Verify the user still exists in Firebase Auth
    try {
      await auth.getUser(decodedToken.uid);
    } catch (error) {
      throw ApiError.unauthorized('User no longer exists');
    }

    // Add user info to request
    (req as FastifyRequest & { user: User }).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.unauthorized('Invalid token');
  }
};

// Clean up expired sessions periodically
setInterval(
  () => {
    const now = Date.now();
    for (const [key, session] of activeSessions.entries()) {
      if (now - session.lastActive > SESSION_TIMEOUT) {
        activeSessions.delete(key);
      }
    }
  },
  60 * 60 * 1000,
); // Run every hour
