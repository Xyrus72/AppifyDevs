import axios from 'axios';
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

// Backend API URL - Change this to your deployed backend URL in production
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Store token so we can use it for cart, orders, etc.
const TOKEN_KEY = 'backend_token';

export { BACKEND_URL };
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

/**
 * Get headers with auth token for API calls. Use this when calling cart/orders/products (admin).
 */
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * Save user login information to MongoDB backend and store the JWT token.
 */
export const saveLoginToDatabase = async (userData, role = 'customer') => {
  try {
    console.log('💾 Saving login to database...');

    const response = await axios.post(
      `${BACKEND_URL}/api/auth/login`,
      {
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
        photoURL: userData.photoURL,
        role
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log('✅ Login saved to database:', response.data);
    if (response.data.token) {
      setToken(response.data.token);
    }
    
    // NOTE: response.data.user.role contains the ACTUAL role from the database
    // Frontend should ALWAYS use response.data.user.role, NOT the role parameter sent
    // This prevents privilege escalation if frontend tries to impersonate different role
    return response.data;
  } catch (error) {
    console.warn('⚠️ Failed to save login to database:', error.message);
    console.warn('User logged in to Firebase but not saved to MongoDB');
    setToken(null);
    return null;
  }
};

// Google Sign In
export const googleSignIn = async () => {
  try {
    console.log('🔵 Step 1: Starting Google Sign-In...');
    console.log('Auth instance:', auth);
    console.log('Google Provider:', googleProvider);
    
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Check firebase.js');
    }
    if (!googleProvider) {
      throw new Error('Google Provider is not initialized. Check firebase.js');
    }
    
    console.log('🔵 Step 2: Opening Google Sign-In popup...');
    const result = await signInWithPopup(auth, googleProvider);
    
    console.log('🔵 Step 3: Got result from popup:', result);
    const user = result.user;
    
    console.log('✅ Step 4: Google Sign-In Successful!');
    console.log('User email:', user.email);
    console.log('User name:', user.displayName);
    console.log('User ID:', user.uid);
    
    return {
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      uid: user.uid,
      photoURL: user.photoURL
    };
  } catch (error) {
    console.error("❌ Google Sign In Error:", error.code, error.message);
    console.error("Full error:", error);
    
    // Handle specific error codes
    if (error.code === 'auth/popup-blocked') {
      throw new Error('❌ Pop-up was blocked. Please allow pop-ups for localhost.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('❌ You closed the sign-in popup.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('❌ Sign-in request was cancelled.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('❌ Google sign-in is NOT enabled in Firebase Console. Please enable it in Authentication > Sign-in method.');
    } else if (error.code === 'auth/invalid-api-key') {
      throw new Error('❌ Invalid Firebase API key. Check .env.local file.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('❌ This domain is not authorized. Add localhost to Firebase Console > Authorized domains.');
    } else {
      throw new Error(`❌ ${error.message || 'Failed to sign in with Google'}`);
    }
  }
};

// Sign Out
export const logoutUser = async () => {
  try {
    console.log('🚪 Signing out...');
    await signOut(auth);
    console.log('✅ Successfully signed out');
  } catch (error) {
    console.error("❌ Sign Out Error:", error);
    throw error;
  }
};

// Get Current User
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        console.log('✅ User found in Firebase Auth:', {
          email: user.email,
          name: user.displayName,
          uid: user.uid
        });
        resolve({
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          uid: user.uid,
          photoURL: user.photoURL
        });
      } else {
        console.log('❌ No user logged in - Firebase Auth is empty');
        resolve(null);
      }
    }, (error) => {
      console.error('❌ Auth state change error:', error);
      reject(error);
    });
  });
};

// Check if user is authenticated
export const isUserAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};

/**
 * Get an existing backend user by Firebase UID.
 * Returns the user object on success, or null if not found.
 * Throws for other server errors.
 */
export const getBackendUserByUid = async (uid) => {
  if (!uid) return null;
  try {
    const response = await axios.get(`${BACKEND_URL}/api/auth/user/${uid}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data?.user || null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // User not found in backend
      return null;
    }
    console.error('❌ Error fetching backend user by UID:', error.message);
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const emailSignUp = async (firstName, lastName, email, password) => {
  try {
    console.log('📝 Starting email sign-up...');
    
    // Create user account
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update profile with display name
    const displayName = `${firstName} ${lastName}`.trim();
    await updateProfile(user, {
      displayName: displayName
    });
    
    console.log('✅ Sign-up successful!');
    console.log('User email:', user.email);
    console.log('User name:', displayName);
    console.log('User ID:', user.uid);
    
    return {
      email: user.email,
      name: displayName || email.split('@')[0],
      uid: user.uid,
      photoURL: user.photoURL || null
    };
  } catch (error) {
    console.error('❌ Sign-up error:', error.code, error.message);
    
    // Handle specific error codes
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('❌ This email is already registered. Please sign in instead.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('❌ Password is too weak. Use at least 6 characters.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('❌ Invalid email address.');
    } else {
      throw new Error(`❌ ${error.message || 'Failed to sign up'}`);
    }
  }
};

/**
 * Sign in with email and password
 */
export const emailSignIn = async (email, password) => {
  try {
    console.log('🔑 Starting email sign-in...');
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    console.log('✅ Sign-in successful!');
    console.log('User email:', user.email);
    console.log('User name:', user.displayName);
    console.log('User ID:', user.uid);
    
    return {
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      uid: user.uid,
      photoURL: user.photoURL || null
    };
  } catch (error) {
    console.error('❌ Sign-in error:', error.code, error.message);
    
    // Handle specific error codes
    if (error.code === 'auth/user-not-found') {
      throw new Error('❌ No account found with this email. Please sign up first.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('❌ Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('❌ Invalid email address.');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('❌ This account has been disabled.');
    } else {
      throw new Error(`❌ ${error.message || 'Failed to sign in'}`);
    }
  }
};

