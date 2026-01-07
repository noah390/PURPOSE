// Main application logic
class App {
    constructor() {
        this.currentPage = 'loading';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAuthListener();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Signup form
        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Navigation
        document.getElementById('show-signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('signup-page');
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('login-page');
        });

        // Logout buttons
        document.getElementById('logout').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        document.getElementById('admin-logout').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Navigation links
        document.getElementById('nav-dashboard').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('dashboard-page');
        });

        document.getElementById('nav-admin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPage('admin-page');
        });
    }

    setupAuthListener() {
        authManager.onAuthStateChanged((user, userData) => {
            if (user && userData) {
                if (userData.role === 'admin') {
                    this.showAdminNav();
                    this.showPage('admin-page');
                } else {
                    this.hideAdminNav();
                    this.showPage('dashboard-page');
                }
            } else {
                this.hideAdminNav();
                this.showPage('login-page');
            }
        });
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            this.showLoading();
            await authManager.signIn(email, password);
        } catch (error) {
            this.hideLoading();
            alert('Login failed: ' + error.message);
        }
    }

    async handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            this.showLoading();
            await authManager.signUp(email, password, name);
        } catch (error) {
            this.hideLoading();
            alert('Signup failed: ' + error.message);
        }
    }

    async handleLogout() {
        try {
            await authManager.signOut();
        } catch (error) {
            alert('Logout failed: ' + error.message);
        }
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });

        // Show requested page
        document.getElementById(pageId).classList.remove('hidden');
        this.currentPage = pageId;
        this.hideLoading();
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showAdminNav() {
        document.getElementById('nav-admin').classList.remove('hidden');
    }

    hideAdminNav() {
        document.getElementById('nav-admin').classList.add('hidden');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});