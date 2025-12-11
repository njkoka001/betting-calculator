// ==========================================
// BETTING CALCULATOR - Main Logic
// ==========================================

// Conversion Helper Functions
const OddsConverter = {
    // Convert any odds format to decimal
    toDecimal(odds, format) {
        odds = parseFloat(odds);
        if (isNaN(odds)) return null;

        switch (format) {
            case 'decimal':
                return odds;
            case 'fractional':
                return odds + 1;
            case 'moneyline':
                if (odds > 0) {
                    return (odds / 100) + 1;
                } else {
                    return (100 / Math.abs(odds)) + 1;
                }
            default:
                return null;
        }
    },

    // Convert decimal odds to fractional
    toFractional(decimalOdds) {
        decimalOdds = parseFloat(decimalOdds);
        if (decimalOdds <= 1) return '0/1';

        const fractional = decimalOdds - 1;
        const tolerance = 1.0E-6;
        let h1 = 1, h2 = 0;
        let k1 = 0, k2 = 1;
        let b = fractional;

        do {
            const a = Math.floor(b);
            let aux = h1;
            h1 = a * h1 + h2;
            h2 = aux;
            aux = k1;
            k1 = a * k1 + k2;
            k2 = aux;
            b = 1 / (b - a);
        } while (Math.abs(fractional - h1 / k1) > fractional * tolerance);

        return `${h1}/${k1}`;
    },

    // Convert decimal odds to moneyline
    toMoneyline(decimalOdds) {
        decimalOdds = parseFloat(decimalOdds);
        if (decimalOdds === 1) return '0';

        if (decimalOdds >= 2) {
            return '+' + Math.round((decimalOdds - 1) * 100);
        } else {
            return Math.round(-100 / (decimalOdds - 1));
        }
    },

    // Calculate implied probability from decimal odds
    impliedProbability(decimalOdds) {
        decimalOdds = parseFloat(decimalOdds);
        if (decimalOdds <= 0) return null;
        return (1 / decimalOdds) * 100;
    }
};

// DOM Elements
const elements = {
    // Odds Converter
    oddsInput: document.getElementById('oddsInput'),
    oddsFormat: document.getElementById('oddsFormat'),
    decimalResult: document.getElementById('decimalResult'),
    fractionalResult: document.getElementById('fractionalResult'),
    moneylineResult: document.getElementById('moneylineResult'),
    convertBtn: document.getElementById('convertBtn'),

    // Implied Probability
    probOdds: document.getElementById('probOdds'),
    probFormat: document.getElementById('probFormat'),
    probabilityResult: document.getElementById('probabilityResult'),
    winChanceResult: document.getElementById('winChanceResult'),
    probabilityBar: document.getElementById('probabilityBar'),
    calculateProbBtn: document.getElementById('calculateProbBtn'),

    // Bet Calculator
    stakeInput: document.getElementById('stakeInput'),
    betOdds: document.getElementById('betOdds'),
    payoutResult: document.getElementById('payoutResult'),
    profitResult: document.getElementById('profitResult'),
    calculateBetBtn: document.getElementById('calculateBetBtn'),

    // Clear
    clearAllBtn: document.getElementById('clearAllBtn')
};

// ==========================================
// ODDS CONVERTER FUNCTIONALITY
// ==========================================
elements.convertBtn.addEventListener('click', () => {
    const oddsValue = elements.oddsInput.value.trim();
    const format = elements.oddsFormat.value;

    if (!oddsValue) {
        alert('Please enter an odds value');
        return;
    }

    const decimalOdds = OddsConverter.toDecimal(oddsValue, format);

    if (decimalOdds === null || decimalOdds <= 0) {
        alert('Invalid odds value. Please check your input.');
        return;
    }

    // Update results
    elements.decimalResult.textContent = decimalOdds.toFixed(2);
    elements.fractionalResult.textContent = OddsConverter.toFractional(decimalOdds);
    elements.moneylineResult.textContent = OddsConverter.toMoneyline(decimalOdds);
});

// Real-time conversion on input change
elements.oddsInput.addEventListener('input', () => {
    if (elements.oddsInput.value.trim()) {
        elements.convertBtn.click();
    }
});

// ==========================================
// IMPLIED PROBABILITY CALCULATOR
// ==========================================
elements.calculateProbBtn.addEventListener('click', () => {
    const oddsValue = elements.probOdds.value.trim();
    const format = elements.probFormat.value;

    if (!oddsValue) {
        alert('Please enter an odds value');
        return;
    }

    const decimalOdds = OddsConverter.toDecimal(oddsValue, format);

    if (decimalOdds === null || decimalOdds <= 0) {
        alert('Invalid odds value. Please check your input.');
        return;
    }

    const probability = OddsConverter.impliedProbability(decimalOdds);

    if (probability === null) {
        alert('Cannot calculate probability for these odds.');
        return;
    }

    // Update results
    elements.probabilityResult.textContent = probability.toFixed(2) + '%';
    elements.winChanceResult.textContent = (100 - probability).toFixed(2) + '%';

    // Update probability bar
    elements.probabilityBar.style.width = probability + '%';
    elements.probabilityBar.textContent = probability.toFixed(1) + '%';
});

// Real-time calculation on input change
elements.probOdds.addEventListener('input', () => {
    if (elements.probOdds.value.trim()) {
        elements.calculateProbBtn.click();
    }
});

// ==========================================
// BET CALCULATOR
// ==========================================
elements.calculateBetBtn.addEventListener('click', () => {
    const stake = parseFloat(elements.stakeInput.value);
    const odds = parseFloat(elements.betOdds.value);

    if (isNaN(stake) || isNaN(odds)) {
        alert('Please enter valid stake and odds values');
        return;
    }

    if (stake < 0 || odds <= 0) {
        alert('Please enter positive values');
        return;
    }

    const payout = stake * odds;
    const profit = payout - stake;

    elements.payoutResult.textContent = 'KSH ' + payout.toFixed(2);
    elements.profitResult.textContent = 'KSH ' + profit.toFixed(2);
});

// Real-time calculation on input change
elements.stakeInput.addEventListener('input', () => {
    if (elements.stakeInput.value.trim() && elements.betOdds.value.trim()) {
        elements.calculateBetBtn.click();
    }
});

elements.betOdds.addEventListener('input', () => {
    if (elements.stakeInput.value.trim() && elements.betOdds.value.trim()) {
        elements.calculateBetBtn.click();
    }
});

// ==========================================
// CLEAR ALL FUNCTIONALITY
// ==========================================
elements.clearAllBtn.addEventListener('click', () => {
    // Clear inputs
    elements.oddsInput.value = '';
    elements.probOdds.value = '';
    elements.stakeInput.value = '';
    elements.betOdds.value = '';

    // Clear results
    elements.decimalResult.textContent = '-';
    elements.fractionalResult.textContent = '-';
    elements.moneylineResult.textContent = '-';
    elements.probabilityResult.textContent = '-';
    elements.winChanceResult.textContent = '-';
    elements.payoutResult.textContent = '-';
    elements.profitResult.textContent = '-';

    // Reset probability bar
    elements.probabilityBar.style.width = '0%';
    elements.probabilityBar.textContent = '';
});

// ==========================================
// INITIALIZATION
// ==========================================
console.log('🎯 Betting Calculator loaded successfully!');
