// In this part I am coding the Weight Chart Logic 
const ctxWeight = document.getElementById('weightChart').getContext('2d');
new Chart(ctxWeight, {
    type: 'line',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Actual Weight',
            data: [83, 81.5, 80.2, 79], // Your real weight journey
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5
        }]
    },
    options: { 
        responsive: true,
        plugins: {
            legend: { display: false }
        }
    }
});

// In this part I am coding the Budget Chart Logic
const ctxBudget = document.getElementById('budgetChart').getContext('2d');
new Chart(ctxBudget, {
    type: 'doughnut',
    data: {
        labels: ['Food', 'Transport', 'Savings', 'Entertainment'],
        datasets: [{
            data: [45, 15, 25, 15],
            backgroundColor: ['#3498db', '#9b59b6', '#f1c40f', '#e67e22'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        cutout: '70%'
    }
});