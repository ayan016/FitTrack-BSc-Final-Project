document.getElementById('calc-bmi').addEventListener('click', function() {
    // getting the weight and height the user typed into the form
    let weight = document.getElementById('weight').value;
    let height = document.getElementById('height').value;

    if (weight > 0 && height > 0) {
        let heightInMeters = height / 100;
        let bmi = weight / (heightInMeters * heightInMeters);
        
        // figure out the health category based on the final number which is user BMI
        let category = "";
        if (bmi < 18.5) {
            category = " (Underweight)";
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = " (Healthy Weight)";
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = " (Overweight)";
        } else {
            category = " (Obese)";
        }

        // show the final number and the category text all together
        document.getElementById('bmi-result').innerHTML = "Your BMI is: " + bmi.toFixed(2) + category;
    } else {
        document.getElementById('bmi-result').innerHTML = "Please enter your details!";
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