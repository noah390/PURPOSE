// Firebase configuration
const firebaseConfig = {
    apiKey: "your_firebase_api_key_here",
    authDomain: "your_project_id.firebaseapp.com",
    projectId: "your_project_id",
    storageBucket: "your_project_id.firebasestorage.app",
    messagingSenderId: "your_messaging_sender_id",
    appId: "your_firebase_app_id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Admin configuration
const ADMIN_EMAIL = "admin@yourdomain.com";