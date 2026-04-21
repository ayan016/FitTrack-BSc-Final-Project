// Restore dark mode on this page
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Weight & BMI Line Chart (real logged data)
const weightHistory = JSON.parse(localStorage.getItem('weightHistory') || '[]');
const startWeight   = Number(localStorage.getItem('startingWeight')) || null;
const latestWeight  = Number(localStorage.getItem('currentWeight'))  || null;
const heightCm      = Number(localStorage.getItem('heightCm'))       || null;

let chartLabels, weightData, bmiData;

if (weightHistory.length >= 2) {
    chartLabels = weightHistory.map(e => {
        const d = new Date(e.date);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    });
    weightData = weightHistory.map(e => e.weight);

    // Calculate BMI for each entry if height is stored
    if (heightCm && heightCm > 0) {
        const heightM = heightCm / 100;
        bmiData = weightHistory.map(e => parseFloat((e.weight / (heightM * heightM)).toFixed(1)));
    }

    document.getElementById('chart-data-note').innerText =
        `Showing ${weightHistory.length} logged entries.`;

} else if (weightHistory.length === 1) {
    chartLabels = [new Date(weightHistory[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })];
    weightData  = [weightHistory[0].weight];

    if (heightCm && heightCm > 0) {
        const heightM = heightCm / 100;
        bmiData = [parseFloat((weightHistory[0].weight / (heightM * heightM)).toFixed(1))];
    }

    document.getElementById('chart-data-note').innerText =
        'Only 1 entry logged. Use the BMI Calculator daily to build your chart.';

} else {
    chartLabels = ['No data yet'];
    weightData  = [startWeight || 0];
    document.getElementById('chart-data-note').innerText =
        'No entries yet. Calculate your BMI on the Dashboard to start tracking.';
}

const allWeights = weightData.filter(w => w > 0);
const chartMin   = allWeights.length ? Math.min(...allWeights) - 3 : 60;
const chartMax   = allWeights.length ? Math.max(...allWeights) + 3 : 100;

// Build datasets — always include weight, add BMI line if height is available
const datasets = [
    {
        label: 'Weight (kg)',
        data: weightData,
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#2ecc71',
        yAxisID: 'yWeight'
    }
];

if (bmiData && bmiData.length > 0) {
    datasets.push({
        label: 'BMI',
        data: bmiData,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.05)',
        fill: false,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#3498db',
        borderDash: [5, 4],
        yAxisID: 'yBMI'
    });
}

const ctxWeight = document.getElementById('weightChart').getContext('2d');
new Chart(ctxWeight, {
    type: 'line',
    data: { labels: chartLabels, datasets },
    options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                display: bmiData && bmiData.length > 0,
                labels: {
                    usePointStyle: true,
                    font: { family: 'Poppins', size: 12 }
                }
            },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        if (ctx.dataset.label === 'BMI') return ` BMI: ${ctx.parsed.y}`;
                        return ` Weight: ${ctx.parsed.y} kg`;
                    }
                }
            }
        },
        scales: {
            yWeight: {
                type: 'linear',
                position: 'left',
                suggestedMin: chartMin,
                suggestedMax: chartMax,
                ticks: { callback: val => val + ' kg', font: { family: 'Poppins', size: 11 } },
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            yBMI: bmiData && bmiData.length > 0 ? {
                type: 'linear',
                position: 'right',
                suggestedMin: 10,
                suggestedMax: 40,
                ticks: { callback: val => val + ' BMI', font: { family: 'Poppins', size: 11 } },
                grid: { drawOnChartArea: false }
            } : { display: false }
        }
    }
});

// Budget Doughnut Chart
let spent = Number(localStorage.getItem('savedExpense'))   || 0;
let left  = Number(localStorage.getItem('savedRemaining')) || 0;
if (left < 0) left = 0;

const ctxBudget = document.getElementById('budgetChart').getContext('2d');

if (spent === 0 && left === 0) {
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

// Update Summary Cards

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
    const sign       = weightDiff > 0 ? '+' : '';
    document.getElementById('card-weight-diff').innerText = sign + weightDiff + ' kg';
} else if (latestWeight) {
    document.getElementById('card-weight-diff').innerText = latestWeight + ' kg';
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
    document.getElementById('card-budget-pct').innerText  = budgetPercent + '%';
    document.getElementById('card-budget-left').innerText = 'PKR ' + left.toLocaleString() + ' Left';
}

