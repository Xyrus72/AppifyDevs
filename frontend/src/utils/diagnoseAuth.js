/**
 * Firebase Google Auth Diagnostic
 * Run this in browser console to diagnose the issue
 */

console.log('🔍 Firebase Google Auth Diagnostic\n');

// Check 1: Firebase Config
console.log('1️⃣ Firebase Configuration:');
console.log('   API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
console.log('   Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');

// Check 2: Firebase Auth
console.log('\n2️⃣ Firebase Auth Status:');
import('file:///./src/firebase.js').then(firebase => {
  console.log('   Auth module imported:', '✅');
  console.log('   Current user:', firebase.auth.currentUser ? firebase.auth.currentUser.email : '❌ No user');
}).catch(err => {
  console.log('   ❌ Error importing firebase:', err.message);
});

// Check 3: When you click Google button
console.log('\n3️⃣ When you click "Sign in with Google":');
console.log('   Step 1: Google popup should appear');
console.log('   Step 2: Sign in with your Gmail');
console.log('   Step 3: Check browser console for "Step 2: Got result from popup"');
console.log('   Step 4: Check for "✅ Step 4: Google Sign-In Successful!"');

console.log('\n❓ If popup closes without signing in:');
console.log('   - Check Firebase Console > Authentication > Sign-in method');
console.log('   - Google must be ENABLED (green toggle)');
console.log('   - Check that your OAuth app is properly configured');
