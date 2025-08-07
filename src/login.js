import { auth } from './firebase.js';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const app = getApp();
const db = getFirestore(app);

function getFriendlyErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
            return 'No account found with this email or username.';
        case 'auth/invalid-credential':
            return 'One of your details are incorrect.';
        default:
            return 'Something went wrong. Please try again.';
    }
}

async function resolveToEmail(inputValue) {
    if (inputValue.includes('@')) {
        return inputValue;
    }

    const docRef = doc(db, 'usernames', inputValue);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
        return snap.data().email;
    } else {
        throw new Error('Username not found');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginInput = document.querySelector('#login-email');
    const passwordInput = document.querySelector('#login-password');
    const loginButton = document.querySelector('#login-button');
    const errorBox = document.querySelector('#login-error');

    loginButton.addEventListener('click', async () => {
        const inputVal = loginInput.value.trim();
        const password = passwordInput.value;

        if (!inputVal || !password) {
            errorBox.textContent = 'Please enter both fields.';
            return;
        }

        try {
            const email = await resolveToEmail(inputVal);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                await signOut(auth);
                throw new Error('auth/email-not-verified');
            }

            console.log('Logged in as:', userCredential.user);
            errorBox.textContent = '';

            window.location.href = './home.html';
        } catch (err) {
            console.error('Login error:', err);
            const friendly = err.code === 'auth/email-not-verified'
                ? 'Please verify your email before logging in.'
                : getFriendlyErrorMessage(err.code);
            errorBox.textContent = friendly;
        }
    });
});
