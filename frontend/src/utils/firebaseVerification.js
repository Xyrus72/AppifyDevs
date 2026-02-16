/**
 * Firebase Configuration Verification Utility
 * Use this to verify that Firebase is properly configured
 */

export const verifyFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  const checks = {
    apiKey: !!config.apiKey,
    authDomain: !!config.authDomain,
    projectId: !!config.projectId,
    storageBucket: !!config.storageBucket,
    messagingSenderId: !!config.messagingSenderId,
    appId: !!config.appId,
    measurementId: !!config.measurementId
  };

  const allConfigured = Object.values(checks).every(val => val === true);

  console.group('🔥 Firebase Configuration Check');
  console.log('📋 Configuration Status:');
  Object.entries(checks).forEach(([key, isSet]) => {
    const status = isSet ? '✅' : '❌';
    console.log(`${status} ${key}: ${isSet ? 'Configured' : 'Missing'}`);
  });
  
  if (allConfigured) {
    console.log('\n✅ All Firebase environment variables are properly configured!');
    console.log('🚀 Google Sign-In is ready to use!');
  } else {
    console.error('\n⚠️ Some Firebase environment variables are missing!');
    console.error('📝 Please check your .env.local file and ensure all variables are set.');
    console.error('\nRequired variables in .env.local:');
    Object.keys(checks).forEach(key => {
      console.error(`VITE_FIREBASE_${key.toUpperCase()}`);
    });
  }
  console.groupEnd();

  return {
    isValid: allConfigured,
    checks,
    config: allConfigured ? config : null
  };
};

// Auto-verify on module load (development only)
if (import.meta.env.MODE === 'development') {
  verifyFirebaseConfig();
}
