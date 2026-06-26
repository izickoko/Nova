// =============================================
//  NOVATRADE — auth.js
//  Firebase Auth: login, signup, state watcher
// =============================================

import { initializeApp }              from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut, onAuthStateChanged,
         updateProfile }              from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// Your Firebase config 
const firebaseConfig = {
  apiKey: "AIzaSyBrHnNbF6lzrMRDohKFUb5sfShV3KqC1FY",
  authDomain: "novatrade-3aa4a.firebaseapp.com",
  projectId: "novatrade-3aa4a",
  storageBucket: "novatrade-3aa4a.firebasestorage.app",
  messagingSenderId: "905250640747",
  appId: "1:905250640747:web:acd9c414bd7b3cb41db22e",
  measurementId: "G-9WSQSW8WGD"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Modal controls (called from HTML onclick)
window.openModal = function(form) {
  document.getElementById('auth-overlay').style.display = 'flex';
  switchForm(form);
}

window.closeModal = function() {
  document.getElementById('auth-overlay').style.display = 'none';
}

window.switchForm = function(form) {
  document.getElementById('form-login').style.display  = form === 'login'  ? 'block' : 'none';
  document.getElementById('form-signup').style.display = form === 'signup' ? 'block' : 'none';
}

// Close modal if clicking the dark overlay
document.getElementById('auth-overlay').addEventListener('click', function(e) {
  if (e.target === this) window.closeModal();
});

// Sign Up 
document.getElementById('signup-btn').addEventListener('click', async () => {
  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const errEl    = document.getElementById('signup-error');

  errEl.textContent = '';

  if (!name || !email || !password) {
    errEl.textContent = 'Please fill in all fields.'; return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    window.closeModal();
    window.location.href = 'dashboard.html';
  } catch (err) {
    errEl.textContent = friendlyError(err.code);
  }
});

// Login 
document.getElementById('login-btn').addEventListener('click', async () => {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('login-error');

  errEl.textContent = '';

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.closeModal();
    window.location.href = 'dashboard.html';
  } catch (err) {
    errEl.textContent = friendlyError(err.code);
  }
});

// Auth State — update navbar
onAuthStateChanged(auth, (user) => {
  const actions = document.querySelector('.navbar-actions');
  if (!actions) return;

  if (user) {
    // Logged in → show name + logout button
    actions.innerHTML = `
      <span style="font-size:0.8rem;color:var(--text-secondary);font-family:var(--font-mono)">
        👋 ${user.displayName || user.email}
      </span>
      <a href="dashboard.html" class="btn btn-primary btn-sm">Dashboard</a>
      <button class="btn btn-ghost btn-sm" id="logout-btn">Log Out</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
  } else {
    // Logged out → restore default buttons
    actions.innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="openModal('login')">Log In</button>
      <button class="btn btn-primary btn-sm" onclick="openModal('signup')">Get Started</button>
    `;
  }
});

// Human-friendly error messages 
function friendlyError(code) {
  const map = {
    'auth/email-already-in-use':    'That email is already registered.',
    'auth/invalid-email':           'Please enter a valid email.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with that email.',
    'auth/wrong-password':          'Incorrect password. Try again.',
    'auth/invalid-credential':      'Email or password is incorrect.',
    'auth/too-many-requests':       'Too many attempts. Try again later.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}