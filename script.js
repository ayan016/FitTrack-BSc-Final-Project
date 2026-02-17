document.getElementById('calc-bmi').addEventListener('click', function() {
    let weight = document.getElementById('weight').value;
    let heightCm = document.getElementById('height').value;

    if (weight > 0 && heightCm > 0) {
        // Do do the math
        let heightM = heightCm / 100;
        let bmi = (weight / (heightM * heightM)).toFixed(1);
        
        let category = "";
        let smartAdvice = "";

        // The logic for the Smart Engine 
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

        // Push and output everything to the screen so the user can see it
        document.getElementById('bmi-result').innerHTML = 
            "<strong>Your BMI:</strong> " + bmi + " (" + category + ")<br><br>" +
            "<strong>💡 Smart Plan:</strong> " + smartAdvice;
            
    } else {
        document.getElementById('bmi-result').innerHTML = "Please enter valid numbers!";
    }
});

document.getElementById('calc-budget').addEventListener('click', function() {
    // getting the money numbers that the user typed in
    let allowance = document.getElementById('allowance').value;
    let expense = document.getElementById('expense').value;

    if (allowance > 0 && expense > 0) {
        // calculating total monthly expense of user (assuming 30 days)
        let totalMonthlyExpense = expense * 30;
        
        // figuring out what is left over in the mothly budget
        let remaining = allowance - totalMonthlyExpense;

        let message = "";
        // checking if the user is saving or losing money
        if (remaining > 0) {
            message = "Good job! You will save " + remaining + " PKR this month.";
        } else if (remaining < 0) {
            // Math.abs just removes the negative sign so it reads better
            message = "Watch out! You are over budget by " + Math.abs(remaining) + " PKR.";
        } else {
            message = "You are breaking exactly even this month.";
        }

        // pushing the final message to the screen as output
        document.getElementById('budget-result').innerHTML = message;
    } else {
        document.getElementById('budget-result').innerHTML = "Please enter your budget details!";
    }
});

document.getElementById('calc-cals').addEventListener('click', function() {
    // getting the calories numbers that are given by the user itslef
    let goal = document.getElementById('goal').value;
    let eaten = document.getElementById('eaten').value;

    if (goal > 0 && eaten > 0) {
        // simple basic math to find what is left.
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