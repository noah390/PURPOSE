# Security Configuration

## Environment Variables

### Required Environment Variables
Copy `.env.example` to `.env.local` and fill in your actual values:

```bash
cp .env.example .env.local
```

### Firebase Configuration
Get these values from your Firebase Console:
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase Web API Key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase Auth Domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase Project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase Storage Bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase Messaging Sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase App ID

### Admin Configuration
- `NEXT_PUBLIC_ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password (keep secure)

## Deployment Security

### Vercel Environment Variables
In your Vercel dashboard, add all environment variables from `.env.local`

### Important Security Notes
- Never commit `.env.local` or `.env` files
- Use strong passwords for admin accounts
- Regularly rotate API keys
- Enable Firebase security rules
- Use HTTPS in production

## Firebase Security Rules
Ensure proper Firestore security rules are configured in Firebase Console.