// JAVASCRIPT FILE: app.js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Random schedule slots
const slots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'];

// Registration
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const teamName = document.getElementById('teamName').value;
    const email = document.getElementById('email').value;
    const randomSlot = slots[Math.floor(Math.random() * slots.length)];

    await db.collection('teams').add({ teamName, email, slot: randomSlot });
    alert(`Team ${teamName} registered with slot ${randomSlot}!`);
    registrationForm.reset();
});

// Leaderboard real-time update
db.collection('leaderboard').onSnapshot(snapshot => {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    snapshot.docs.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = `${doc.data().teamName} - ${doc.data().score} points`;
        leaderboardList.appendChild(li);
    });
});

// Schedule real-time update
db.collection('schedule').onSnapshot(snapshot => {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = '';
    snapshot.docs.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = `${doc.data().event} - ${doc.data().time}`;
        scheduleList.appendChild(li);
    });
});

// Certificate generation
function generateCertificate() {
    const link = document.createElement('a');
    link.href = 'certificate_template.pdf'; // Replace with dynamically generated certificate
    link.download = 'Hackathon_Certificate.pdf';
    link.click();
}

// Login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('Login successful!');
    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
});
