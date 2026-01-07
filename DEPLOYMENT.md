# Deployment & Setup Guide

## Firebase Setup

### 1. Create Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init
```

### 2. Configure Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: "faith-purpose-platform"
3. Enable Authentication → Email/Password
4. Create Firestore database (start in test mode)
5. Get project configuration from Project Settings

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in your Firebase config:
```bash
cp .env.example .env.local
```

### 4. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy to Vercel
```bash
# Build the project
npm run build

# Deploy
vercel --prod
```

### 3. Environment Variables in Vercel
Add all environment variables from `.env.local` to Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add each NEXT_PUBLIC_* variable

## Initial Data Setup

### 1. Create Admin User
1. Sign up with your admin email (set in NEXT_PUBLIC_ADMIN_EMAIL)
2. User will automatically get admin role

### 2. Create Sample Content
```javascript
// Run in Firebase Console
// Create sample groups
db.collection('groups').add({
  name: 'Faith & Purpose Discussion',
  description: 'General discussion about faith and life purpose',
  isPremium: false,
  isActive: true,
  memberCount: 1,
  createdBy: 'admin-uid',
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

db.collection('groups').add({
  name: 'Premium Spiritual Growth',
  description: 'Exclusive content for spiritual development',
  isPremium: true,
  isActive: true,
  memberCount: 1,
  createdBy: 'admin-uid',
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

// Create sample posts
db.collection('posts').add({
  title: 'Welcome to Our Community',
  content: 'This is a place where faith meets purpose. Share your journey!',
  authorId: 'admin-uid',
  authorName: 'Admin',
  isPremium: false,
  isPublished: true,
  likes: 0,
  commentCount: 0,
  tags: ['welcome', 'community'],
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
});
```

## Production Checklist

### Security
- [ ] Firestore security rules deployed
- [ ] Environment variables secured
- [ ] Admin email configured
- [ ] HTTPS enabled (automatic with Vercel)

### Performance
- [ ] Firestore indexes created
- [ ] Images optimized
- [ ] Caching configured
- [ ] Bundle size optimized

### Monitoring
- [ ] Firebase Analytics enabled
- [ ] Error tracking set up
- [ ] Performance monitoring active
- [ ] User feedback system ready

### Content
- [ ] Initial posts created
- [ ] Groups set up
- [ ] Admin account configured
- [ ] Terms of service added
- [ ] Privacy policy added

## Maintenance

### Daily
- Monitor user activity
- Respond to user feedback
- Moderate content if needed

### Weekly
- Review analytics
- Update content
- Check system performance
- Backup important data

### Monthly
- Security audit
- Performance optimization
- Feature planning
- User feedback analysis

## Scaling Considerations

### Firebase Limits (Free Tier)
- Firestore: 50K reads, 20K writes, 20K deletes per day
- Authentication: Unlimited
- Hosting: 10GB storage, 360MB/day transfer

### When to Upgrade
- Approaching daily limits
- Need advanced features
- Require SLA guarantees
- Need priority support

### Cost Optimization
- Implement efficient queries
- Use Firestore offline persistence
- Optimize image sizes
- Cache frequently accessed data

## Troubleshooting

### Common Issues
1. **Authentication not working**: Check Firebase config
2. **Firestore permission denied**: Verify security rules
3. **Real-time updates not working**: Check network connection
4. **Admin panel not accessible**: Verify admin email in env vars

### Debug Mode
```bash
# Enable Firebase debug mode
export FIRESTORE_EMULATOR_HOST=localhost:8080
firebase emulators:start --only firestore
```

### Support Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)