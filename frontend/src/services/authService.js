import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

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

