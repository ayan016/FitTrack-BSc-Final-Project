//  Restore dark mode on this page 
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

//  Weight Line Chart (real logged data) 
const weightHistory = JSON.parse(localStorage.getItem('weightHistory') || '[]');
const startWeight   = Number(localStorage.getItem('startingWeight')) || null;
const latestWeight  = Number(localStorage.getItem('currentWeight'))  || null;

let chartLabels, chartData;

if (weightHistory.length >= 2) {
    // Use actual logged entries, this is real data the user entered
    chartLabels = weightHistory.map(e => {
        const d = new Date(e.date);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    });
    chartData = weightHistory.map(e => e.weight);

    document.getElementById('chart-data-note').innerText =
        `Showing ${weightHistory.length} logged entries.`;

} else if (weightHistory.length === 1) {
    // Only one entry,show it with a note
    chartLabels = [new Date(weightHistory[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })];
    chartData   = [weightHistory[0].weight];
    document.getElementById('chart-data-note').innerText =
        'Only 1 entry logged. Use the BMI Calculator daily to build your chart.';

} else {
    // No data yet, show a placeholder
    chartLabels = ['No data yet'];
    chartData   = [startWeight || 0];
    document.getElementById('chart-data-note').innerText =
        'No entries yet. Calculate your BMI on the Dashboard to start tracking.';
}

const allWeights    = chartData.filter(w => w > 0);
const chartMin      = allWeights.length ? Math.min(...allWeights) - 3 : 60;
const chartMax      = allWeights.length ? Math.max(...allWeights) + 3 : 100;

const ctxWeight = document.getElementById('weightChart').getContext('2d');
new Chart(ctxWeight, {
    type: 'line',
    data: {
        labels: chartLabels,
        datasets: [{
            label: 'Weight (kg)',
            data: chartData,
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#2ecc71'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.parsed.y} kg`
                }
            }
        },
        scales: {
            y: {
                suggestedMin: chartMin,
                suggestedMax: chartMax,
                ticks: {
                    callback: val => val + ' kg'
                }
            }
        }
    }
});

//  Budget Doughnut Chart 
let spent = Number(localStorage.getItem('savedExpense'))   || 0;
let left  = Number(localStorage.getItem('savedRemaining')) || 0;
if (left < 0) left = 0;

const ctxBudget = document.getElementById('budgetChart').getContext('2d');

if (spent === 0 && left === 0) {
    // No budget data yet — show an empty state
    new Chart(ctxBudget, {
        type: 'doughnut',
        data: {
            labels: ['No data — enter budget on Dashboard'],
            datasets: [{ data: [1], backgroundColor: ['#e0e0e0'], borderWidth: 0 }]
        },
        options: { responsive: true, cutout: '70%', plugins: { legend: { display: true } } }
    });
} else {
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
            cutout: '70%',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => ` PKR ${ctx.parsed.toLocaleString()}`
                    }
                }
            }
        }
    });
}

// to Update Summary Cards 

// BMI Card
const currentBMI  = localStorage.getItem('currentBMI');
const bmiCategory = localStorage.getItem('bmiCategory');
if (currentBMI) {
    document.getElementById('card-bmi').innerText        = currentBMI;
    document.getElementById('card-bmi-status').innerText = '● ' + bmiCategory;
}

// Weight Progress Card
if (latestWeight && startWeight) {
    const weightDiff = (latestWeight - startWeight).toFixed(1);
    const sign       = weightDiff > 0 ? "+" : "";
    document.getElementById('card-weight-diff').innerText = sign + weightDiff + " kg";
} else if (latestWeight) {
    document.getElementById('card-weight-diff').innerText = latestWeight + " kg";
}

const targetWeight = localStorage.getItem('targetWeight');
if (targetWeight) {
    document.getElementById('card-weight-goal').innerText = `Goal: ${targetWeight} kg`;
}

// Budget Card
const allowance = Number(localStorage.getItem('totalAllowance'));
if (allowance && allowance > 0) {
    let budgetPercent = Math.round((left / allowance) * 100);
    if (budgetPercent < 0) budgetPercent = 0;
    document.getElementById('card-budget-pct').innerText  = budgetPercent + "%";
    document.getElementById('card-budget-left').innerText = "PKR " + left.toLocaleString() + " Left";
}
