// 1. THE WEIGHT LINE GRAPH
// 1. THE WEIGHT LINE GRAPH
let latestWeight = Number(localStorage.getItem('currentWeight')) || 79;
let startWeight = 83; // Your starting weight

// Let's calculate a smooth curve so the graph never looks broken
let totalChange = startWeight - latestWeight;
let week2 = startWeight - (totalChange * 0.33);
let week3 = startWeight - (totalChange * 0.66);

const ctxWeight = document.getElementById('weightChart').getContext('2d');
new Chart(ctxWeight, {
    type: 'line',
    data: {
        labels: ['Start', 'Week 2', 'Week 3', 'Current'],
        datasets: [{
            label: 'Weight (kg)',
            data: [startWeight, week2.toFixed(1), week3.toFixed(1), latestWeight],
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            fill: true,
            tension: 0.4, // This gives the line that nice curve
            pointRadius: 5
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                // This gives the chart some breathing room so it doesn't look so zoomed in
                suggestedMin: Math.min(startWeight, latestWeight) - 5,
                suggestedMax: Math.max(startWeight, latestWeight) + 5
            }
        }
    }
});

// 2. THE BUDGET PIE CHART
let spent = Number(localStorage.getItem('savedExpense')) || 0;
let left = Number(localStorage.getItem('savedRemaining')) || 0;

// Cap the remaining budget at 0 so the pie chart doesn't break if they overspend
if (left < 0) left = 0; 

const ctxBudget = document.getElementById('budgetChart').getContext('2d');
new Chart(ctxBudget, {
    type: 'doughnut',
    data: {
        labels: ['Total Spent', 'Remaining Budget'],
        datasets: [{
            data: [spent, left],
            backgroundColor: ['#e74c3c', '#2ecc71'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        cutout: '70%'
    }
});