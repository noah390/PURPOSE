// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMocms2Zp1CdMBgW4XhvcHzaLwI_hSWQg",
    authDomain: "purpose-aec15.firebaseapp.com",
    projectId: "purpose-aec15",
    storageBucket: "purpose-aec15.firebasestorage.app",
    messagingSenderId: "971703720450",
    appId: "1:971703720450:web:eaddf23a15d6bbf4cf651b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Admin configuration
const ADMIN_EMAIL = "admin@purpose.com";