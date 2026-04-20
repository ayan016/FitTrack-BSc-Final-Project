import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut }
    from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA2c9lMr-knuLL1r8CRW_MvtMM1hqSP6gU",
    authDomain: "fittrack-b0ee8.firebaseapp.com",
    projectId: "fittrack-b0ee8",
    storageBucket: "fittrack-b0ee8.firebasestorage.app",
    messagingSenderId: "968942652478",
    appId: "1:968942652478:web:fe4eb034783068966f956f"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// Dark Mode
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

//  Auth guard — redirect to login if not signed in 
let currentUserId = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
        loadUserProfile(user.uid);
    } else {
        // Not logged in — send to login page
        window.location.href = 'login.html';
    }
});

//  Load user profile from Firestore 
async function loadUserProfile(uid) {
    try {
        const docRef  = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Dashboard: greeting and avatar
            const greeting = document.getElementById('user-greeting');
            const avatar   = document.getElementById('user-avatar');
            if (greeting && data.first_name) {
                greeting.innerText = 'Welcome back, ' + data.first_name + '!';
                avatar.innerText   = data.first_name.charAt(0).toUpperCase();
            }

            // Dashboard: pre-fill height and allowance
            const dashHeight    = document.getElementById('height');
            const dashAllowance = document.getElementById('allowance');
            if (dashHeight)    dashHeight.value    = data.height_cm || '';
            if (dashAllowance) dashAllowance.value = data.monthly_allowance_pkr || '';

            // Settings: populate all fields
            const setName         = document.getElementById('setting-name');
            const setHeight       = document.getElementById('setting-height');
            const setStartWeight  = document.getElementById('setting-start-weight');
            const setTargetWeight = document.getElementById('setting-target-weight');
            const setAllowance    = document.getElementById('setting-allowance');

            if (setName)         setName.value         = data.first_name || '';
            if (setHeight)       setHeight.value       = data.height_cm || '';
            if (setStartWeight)  setStartWeight.value  = data.starting_weight || '';
            if (setTargetWeight) setTargetWeight.value = data.target_weight || '';
            if (setAllowance)    setAllowance.value    = data.monthly_allowance_pkr || '';

            // Cache in localStorage so analytics.js can read without extra Firestore call
            if (data.starting_weight) localStorage.setItem('startingWeight', data.starting_weight);
            if (data.target_weight)   localStorage.setItem('targetWeight',   data.target_weight);
            if (data.weight_history)  localStorage.setItem('weightHistory',  JSON.stringify(data.weight_history));
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

//  Streak counter 
function calculateStreak() {
    const history = JSON.parse(localStorage.getItem('weightHistory') || '[]');
    if (history.length === 0) return 0;

    const loggedDates = new Set(history.map(e => e.date));
    let streak = 0;
    const checkDate = new Date();

    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (loggedDates.has(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

function updateStreakDisplay() {
    const streakEl = document.getElementById('streak-display');
    if (streakEl) streakEl.innerText = `🔥 ${calculateStreak()} Day Streak`;
}
updateStreakDisplay();

//  BMI Calculator 
const bmiBtn = document.getElementById('calc-bmi');
if (bmiBtn) {
    bmiBtn.addEventListener('click', function () {
        const weight   = parseFloat(document.getElementById('weight').value);
        const heightCm = parseFloat(document.getElementById('height').value);
        const resultEl = document.getElementById('bmi-result');

        if (!weight || !heightCm || weight <= 0 || weight > 300 || heightCm <= 50 || heightCm > 300) {
            resultEl.innerHTML = '<span style="color:#e74c3c;">⚠️ Please enter a valid weight (1–300 kg) and height (50–300 cm).</span>';
            return;
        }

        const heightM = heightCm / 100;
        const bmi     = (weight / (heightM * heightM)).toFixed(1);
        let category, smartAdvice, color;

        if (bmi < 18.5) {
            category    = 'Underweight';
            color       = '#3498db';
            smartAdvice = 'Aim for 2000+ calories. Eat calorie-dense, affordable foods like eggs, daal, and nuts.';
        } else if (bmi <= 24.9) {
            category    = 'Normal Weight';
            color       = '#2ecc71';
            smartAdvice = 'Maintain your current diet! A daily brisk walk is perfect for staying healthy without strict calorie cuts.';
        } else if (bmi <= 29.9) {
            category    = 'Overweight';
            color       = '#f39c12';
            smartAdvice = 'Target 1500–1600 calories to safely drop weight. Focus on chicken breast and lentils (daal) to stay full on a student budget.';
        } else {
            category    = 'Obese';
            color       = '#e74c3c';
            smartAdvice = 'Consider consulting a doctor for a personalised plan. Start with low-impact exercise like daily walking.';
        }

        // Save weight entry to localStorage
        const history  = JSON.parse(localStorage.getItem('weightHistory') || '[]');
        const today    = new Date().toISOString().split('T')[0];
        const todayIdx = history.findIndex(e => e.date === today);

        if (todayIdx >= 0) {
            history[todayIdx].weight = weight;
        } else {
            history.push({ date: today, weight });
        }

        if (history.length > 30) history.shift();
        localStorage.setItem('weightHistory', JSON.stringify(history));

        // Sync to Firestore
        if (currentUserId) {
            setDoc(doc(db, 'users', currentUserId), {
                weight_history: history
            }, { merge: true }).catch(err => console.error('Cloud sync failed:', err));
        }

        localStorage.setItem('currentWeight', weight);
        localStorage.setItem('currentBMI',    bmi);
        localStorage.setItem('bmiCategory',   category);

        resultEl.innerHTML =
            `<strong>Your BMI:</strong> <span style="color:${color}; font-size:20px;">${bmi}</span> ` +
            `<span style="color:${color};">(${category})</span><br><br>` +
            `<strong>💡 Smart Plan:</strong> ${smartAdvice}`;

        updateStreakDisplay();
    });
}

//  Budget Calculator 
const budgetBtn = document.getElementById('calc-budget');
if (budgetBtn) {
    budgetBtn.addEventListener('click', function () {
        const allowance = parseFloat(document.getElementById('allowance').value);
        const expense   = parseFloat(document.getElementById('expense').value);
        const resultEl  = document.getElementById('budget-result');

        if (!allowance || !expense || allowance <= 0 || expense <= 0) {
            resultEl.innerHTML = '<span style="color:#e74c3c;">⚠️ Please enter valid budget amounts.</span>';
            return;
        }

        const totalMonthlyExpense = expense * 30;
        const remaining           = allowance - totalMonthlyExpense;

        localStorage.setItem('savedExpense',   totalMonthlyExpense);
        localStorage.setItem('savedRemaining', remaining);
        localStorage.setItem('totalAllowance', allowance);

        let message;
        if (remaining > 0) {
            message = `✅ Good job! You will save <strong>PKR ${remaining.toLocaleString()}</strong> this month.`;
        } else if (remaining < 0) {
            message = `⚠️ Watch out! You are over budget by <strong>PKR ${Math.abs(remaining).toLocaleString()}</strong>.`;
        } else {
            message = 'You are breaking exactly even this month.';
        }

        resultEl.innerHTML = message;
    });
}

//  Calorie Tracker 
const calsBtn = document.getElementById('calc-cals');
if (calsBtn) {
    calsBtn.addEventListener('click', function () {
        const goal     = parseFloat(document.getElementById('goal').value);
        const eaten    = parseFloat(document.getElementById('eaten').value);
        const resultEl = document.getElementById('cal-result');

        if (!goal || goal <= 0 || isNaN(eaten) || eaten < 0) {
            resultEl.innerHTML = '<span style="color:#e74c3c;">⚠️ Please enter valid calorie values.</span>';
            return;
        }

        const left = goal - eaten;
        let message;

        if (left > 0) {
            message = `✅ You have <strong>${left}</strong> calories left for today.`;
        } else if (left < 0) {
            message = `⚠️ You are over your goal by <strong>${Math.abs(left)}</strong> calories.`;
        } else {
            message = '🎯 You hit your goal exactly!';
        }

        resultEl.innerHTML = message;
    });
}

//  Dark Mode On and Off
const darkBtn = document.getElementById('toggle-dark');
if (darkBtn) {
    if (document.body.classList.contains('dark-mode')) {
        darkBtn.innerHTML         = '☀️ Light Mode';
        darkBtn.style.background  = '#f1c40f';
        darkBtn.style.color       = '#2c3e50';
    }

    darkBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);

        if (isDark) {
            this.innerHTML        = '☀️ Light Mode';
            this.style.background = '#f1c40f';
            this.style.color      = '#2c3e50';
        } else {
            this.innerHTML        = '🌙 Dark Mode';
            this.style.background = '#2c3e50';
            this.style.color      = 'white';
        }
    });
}

// For Sign Out 
const signOutBtn = document.getElementById('sign-out');
if (signOutBtn) {
    signOutBtn.addEventListener('click', async function () {
        // Clear local data on sign out so next user starts fresh
        const keysToRemove = [
            'weightHistory', 'currentWeight', 'currentBMI', 'bmiCategory',
            'savedExpense', 'savedRemaining', 'totalAllowance',
            'startingWeight', 'targetWeight', 'darkMode'
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));
        await signOut(auth);
        window.location.href = 'login.html';
    });
}

// to Save Settings to Firestore 
const saveButton = document.getElementById('save-settings');
if (saveButton) {
    saveButton.addEventListener('click', async function (e) {
        e.preventDefault();

        const name         = document.getElementById('setting-name').value.trim();
        const height       = parseFloat(document.getElementById('setting-height').value);
        const startWeight  = parseFloat(document.getElementById('setting-start-weight').value);
        const targetWeight = parseFloat(document.getElementById('setting-target-weight').value);
        const allowance    = parseFloat(document.getElementById('setting-allowance').value);

        if (!name || !height || !startWeight || !targetWeight || !allowance) {
            alert('Please fill in all fields before saving.');
            return;
        }

        if (!currentUserId) {
            alert('Still connecting to the cloud. Please wait a moment and try again.');
            return;
        }

        try {
            await setDoc(doc(db, 'users', currentUserId), {
                first_name:            name,
                height_cm:             height,
                starting_weight:       startWeight,
                target_weight:         targetWeight,
                monthly_allowance_pkr: allowance
            }, { merge: true });

            localStorage.setItem('startingWeight', startWeight);
            localStorage.setItem('targetWeight',   targetWeight);

            const statusEl = document.getElementById('sync-status');
            if (statusEl) {
                statusEl.style.display = 'block';
                setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
            } else {
                alert('Settings saved and synced to cloud!');
            }
        } catch (error) {
            console.error('Firebase save error:', error);
            alert('Something went wrong. Please check your connection and try again.');
        }
    });
}

//  Clear All Local Data 
const clearBtn = document.getElementById('clear-data');
if (clearBtn) {
    clearBtn.addEventListener('click', function () {
        if (confirm('Are you sure? This will delete all your locally stored weight history, BMI, and budget data. Your cloud profile will remain.')) {
            const keysToRemove = [
                'weightHistory', 'currentWeight', 'currentBMI', 'bmiCategory',
                'savedExpense', 'savedRemaining', 'totalAllowance',
                'startingWeight', 'targetWeight', 'darkMode'
            ];
            keysToRemove.forEach(k => localStorage.removeItem(k));
            alert('Local data cleared. Reload the page to see changes.');
        }
    });
}
