import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDeq00uR3ys_Gr3gy8EjjEVHj9aHhbsjPY",
    authDomain: "logly-app.firebaseapp.com",
    projectId: "logly-app",
    storageBucket: "logly-app.firebasestorage.app",
    messagingSenderId: "290448416801",
    appId: "1:290448416801:web:1da16ee95fbb2ab8794360",
    measurementId: "G-8B52568ECT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Enable offline persistence with IndexedDB and multi-tab coordination
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
    }),
});
