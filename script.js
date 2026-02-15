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