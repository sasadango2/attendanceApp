// src/services/authService.js
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const logout = () => {
    return signOut(auth);
};

export { register, login, logout };
