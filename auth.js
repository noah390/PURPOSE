// Authentication functions
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userData = null;
    }

    async signUp(email, password, displayName) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Create user document in Firestore
            await db.collection('users').doc(user.uid).set({
                email: email,
                displayName: displayName,
                role: email === ADMIN_EMAIL ? 'admin' : 'user',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    async signIn(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async signOut() {
        try {
            await auth.signOut();
            this.currentUser = null;
            this.userData = null;
        } catch (error) {
            throw error;
        }
    }

    async getUserData(uid) {
        try {
            const doc = await db.collection('users').doc(uid).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(async (user) => {
            this.currentUser = user;
            if (user) {
                this.userData = await this.getUserData(user.uid);
            } else {
                this.userData = null;
            }
            callback(user, this.userData);
        });
    }
}

// Create global auth manager instance
const authManager = new AuthManager();