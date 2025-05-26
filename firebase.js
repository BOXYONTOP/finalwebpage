import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNmZn8wltnEuhwR1NY1XWGXHq23AGoDwk",
  authDomain: "webpage-6c8ac.firebaseapp.com",
  projectId: "webpage-6c8ac",
  storageBucket: "webpage-6c8ac.appspot.com",
  messagingSenderId: "1074708001633",
  appId: "1:1074708001633:web:4f1270deb834106fe88b20",
  measurementId: "G-JNVEQ2GRYX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.querySelectorAll(".booking-form").forEach(form => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      type: form.dataset.type,
      price: form.dataset.price,
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      date: form.date.value,
      location: form.location.value,
      timestamp: new Date()
    };
    await addDoc(collection(db, "bookings"), data);
    alert("Booking received. You’ll get a confirmation shortly.");
  });
});