# Static Web Deployment

## Files Structure
```
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # Main application logic
├── auth.js            # Authentication functions
├── config.js          # Firebase configuration
└── README.md          # Documentation
```

## Configuration Setup

### 1. Update Firebase Config
Edit `config.js` and replace placeholder values:
```javascript
const firebaseConfig = {
    apiKey: "your_actual_firebase_api_key",
    authDomain: "your_project_id.firebaseapp.com",
    projectId: "your_project_id",
    storageBucket: "your_project_id.firebasestorage.app",
    messagingSenderId: "your_messaging_sender_id",
    appId: "your_firebase_app_id"
};

const ADMIN_EMAIL = "admin@purpose.com";
```

### 2. Deployment Options

#### Option A: Vercel Static
1. Connect GitHub repository to Vercel
2. Set build settings:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: ./
3. Deploy

#### Option B: Netlify
1. Connect GitHub repository to Netlify
2. Build settings:
   - Build command: (leave empty)
   - Publish directory: ./
3. Deploy

#### Option C: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

#### Option D: GitHub Pages
1. Go to repository Settings > Pages
2. Source: Deploy from branch
3. Branch: main
4. Folder: / (root)

## Features
- ✅ Firebase Authentication
- ✅ User Registration/Login
- ✅ Admin Panel Access
- ✅ Responsive Design
- ✅ Role-based Navigation
- ✅ Secure Configuration

## Admin Access
- Email: admin@purpose.com
- Password: (set in Firebase Console)

## Security Notes
- Update `config.js` with real Firebase credentials
- Set up Firebase security rules
- Configure CORS settings if needed