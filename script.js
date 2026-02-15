document.getElementById('calc-bmi').addEventListener('click', function() {
    // getting the weight and height the user typed into the form
    let weight = document.getElementById('weight').value;
    let height = document.getElementById('height').value;

    // making sure the user actually entered numbers so the math doesn't break
    if (weight > 0 && height > 0) {
        // the formula needs height in meters, not cm
        let heightInMeters = height / 100;
        
        // standard bmi calculation formulaa: weight divided by height squared
        let bmi = weight / (heightInMeters * heightInMeters);

        // show the final number on the page and round the answer to 2 decimal places
        document.getElementById('bmi-result').innerHTML = "Your BMI is: " + bmi.toFixed(2);
    } else {
        // show a quick error if they left the boxes blank
        document.getElementById('bmi-result').innerHTML = "Please enter your details!";
    }
});