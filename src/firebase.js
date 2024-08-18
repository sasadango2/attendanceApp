import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyAj6si87sZSqn8GH2ZGFs_B1Ys8qpizDJw",
    authDomain: "attendancemanagement2-95d85.firebaseapp.com",
    projectId: "attendancemanagement2-95d85",
    storageBucket: "attendancemanagement2-95d85.appspot.com",
    messagingSenderId: "509194039754",
    appId: "1:509194039754:web:ff475644508318da5e1f33"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 必要な関数をエクスポート
export { auth, db, collection, addDoc, serverTimestamp, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
