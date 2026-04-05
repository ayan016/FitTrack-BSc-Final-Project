import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2c9lMr-knuLL1r8CRW_MvtMM1hqSP6gU",
  authDomain: "fittrack-b0ee8.firebaseapp.com",
  projectId: "fittrack-b0ee8",
  storageBucket: "fittrack-b0ee8.firebasestorage.app",
  messagingSenderId: "968942652478",
  appId: "1:968942652478:web:fe4eb034783068966f956f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to pull user data when the page loads auto
async function loadUserProfile() {
    try {
        const docRef = doc(db, "users", "my_profile");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Cloud Data successfully loaded:", data);

            // NEW: Update the greeting and the avatar letter
            const greeting = document.getElementById('user-greeting');
            const avatar = document.getElementById('user-avatar');
            
            if (greeting && data.first_name) {
                greeting.innerText = "Welcome back, " + data.first_name + "!";
                avatar.innerText = data.first_name.charAt(0).toUpperCase();
            }

            // Populate the Dashboard Inputs
            const dashHeight = document.getElementById('height');
            const dashAllowance = document.getElementById('allowance');

            if (dashHeight) dashHeight.value = data.height_cm;
            if (dashAllowance) dashAllowance.value = data.monthly_allowance_pkr;

            // Populate the Settings Page Inputs
            const setName = document.getElementById('setting-name');
            const setHeight = document.getElementById('setting-height');
            const setStartWeight = document.getElementById('setting-start-weight');
            const setTargetWeight = document.getElementById('setting-target-weight');
            const setAllowance = document.getElementById('setting-allowance');

            if (setName) setName.value = data.first_name;
            if (setHeight) setHeight.value = data.height_cm;
            if (setStartWeight) setStartWeight.value = data.starting_weight;
            if (setTargetWeight) setTargetWeight.value = data.target_weight;
            if (setAllowance) setAllowance.value = data.monthly_allowance_pkr;

        } else {
            console.log("No profile found in the cloud yet.");
        }
    } catch (error) {
        console.error("Error fetching profile: ", error);
    }
}
loadUserProfile();

const bmiBtn = document.getElementById('calc-bmi');
if (bmiBtn) {
    bmiBtn.addEventListener('click', function() {
        console.log("The button is actually awake!");

        let weight = document.getElementById('weight').value;
        let heightCm = document.getElementById('height').value;

        if (weight > 0 && heightCm > 0) {
            let heightM = heightCm / 100;
            let bmi = (weight / (heightM * heightM)).toFixed(1);
            
            let category = "";
            let smartAdvice = "";

            if (bmi < 18.5) {
                category = "Underweight";
                smartAdvice = "Aim for 2000+ calories. Eat calorie-dense, affordable foods like eggs and nuts.";
            } else if (bmi >= 18.5 && bmi <= 24.9) {
                category = "Normal Weight";
                smartAdvice = "Maintain your current diet! Adding a daily 8km brisk walk is perfect for staying healthy without strict calorie cuts.";
            } else {
                category = "Overweight";
                smartAdvice = "Target 1500-1600 calories to safely drop weight. Focus on chicken breast and lentils (daal) to stay full on a student budget.";
            }

            
            localStorage.setItem('currentWeight', weight);
            localStorage.setItem('currentBMI', bmi);
            localStorage.setItem('bmiCategory', category);

            document.getElementById('bmi-result').innerHTML = 
                "<strong>Your BMI:</strong> " + bmi + " (" + category + ")<br><br>" +
                "<strong>💡 Smart Plan:</strong> " + smartAdvice;
                
        } else {
            document.getElementById('bmi-result').innerHTML = "Please enter valid numbers!";
        }
    });
}

const budgetBtn = document.getElementById('calc-budget');
if (budgetBtn) {
    budgetBtn.addEventListener('click', function() {
        let allowance = document.getElementById('allowance').value;
        let expense = document.getElementById('expense').value;

        if (allowance > 0 && expense > 0) {
            let totalMonthlyExpense = expense * 30;
            let remaining = allowance - totalMonthlyExpense;
            
            // Too Save the math to browser storage so the Analytics page can see it
            localStorage.setItem('savedExpense', totalMonthlyExpense);
            localStorage.setItem('savedRemaining', remaining);
            localStorage.setItem('totalAllowance', allowance);

            let message = "";
            if (remaining > 0) {
                message = "Good job! You will save " + remaining + " PKR this month.";
            } else if (remaining < 0) {
                message = "Watch out! You are over budget by " + Math.abs(remaining) + " PKR.";
            } else {
                message = "You are breaking exactly even this month.";
            }

            document.getElementById('budget-result').innerHTML = message;
        } else {
            document.getElementById('budget-result').innerHTML = "Please enter your budget details!";
        }
    });
}
const calsBtn = document.getElementById('calc-cals');
if (calsBtn) {
    calsBtn.addEventListener('click', function() {
        let goal = document.getElementById('goal').value;
        let eaten = document.getElementById('eaten').value;

        if (goal > 0 && eaten > 0) {
            let left = goal - eaten;
            let message = "";
            
            if (left > 0) {
                message = "You have " + left + " calories left for today.";
            } else if (left < 0) {
                message = "You are over by " + Math.abs(left) + " calories.";
            } else {
                message = "You hit your goal exactly!";
            }

            document.getElementById('cal-result').innerHTML = message;
        } else {
            document.getElementById('cal-result').innerHTML = "Enter your calories!";
        }
    });
}

const darkBtn = document.getElementById('toggle-dark');
if (darkBtn) {
    darkBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            this.innerHTML = "☀️ Light Mode";
            this.style.background = "#f1c40f";
            this.style.color = "#2c3e50";
        } else {
            this.innerHTML = "🌙 Dark Mode";
            this.style.background = "#2c3e50";
            this.style.color = "white";
        }
    });
}

const saveButton = document.getElementById('save-settings');
if (saveButton) {
    saveButton.addEventListener('click', async function(e) {
        e.preventDefault();

        let name = document.getElementById('setting-name').value;
        let height = document.getElementById('setting-height').value;
        let startWeight = document.getElementById('setting-start-weight').value;
        let targetWeight = document.getElementById('setting-target-weight').value;
        let allowance = document.getElementById('setting-allowance').value;

        try {
            await setDoc(doc(db, "users", "my_profile"), {
                first_name: name,
                height_cm: Number(height),
                starting_weight: Number(startWeight),
                target_weight: Number(targetWeight),
                monthly_allowance_pkr: Number(allowance)
            });
            
            alert('Cloud sync complete! Your settings are saved.');
        } catch (error) {
            console.error("Firebase Error: ", error);
            alert('Something went wrong. Check the console.');
        }
    });
}