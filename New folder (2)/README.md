# Betting Calculator 🎯

A modern, interactive web-based betting calculator for converting odds formats and calculating implied probabilities. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

### 1. **Odds Converter**
- Convert between three major odds formats:
  - **Decimal Odds** (e.g., 2.5)
  - **Fractional Odds** (e.g., 3/2)
  - **Moneyline** (e.g., +150 or -200)
- Real-time conversion as you type
- View all three formats simultaneously

### 2. **Implied Probability Calculator**
- Calculate the implied probability from any odds format
- View winning vs. losing probability
- Visual probability bar showing the likelihood percentage
- Instant calculations on input

### 3. **Bet Calculator**
- Calculate potential payouts and profits
- Input your stake amount and odds
- Get total payout and net profit instantly
- Perfect for planning your bets

### 4. **User-Friendly Interface**
- Modern, responsive design
- Works on desktop, tablet, and mobile devices
- Clean, intuitive layout with color-coded sections
- Real-time updates as you type

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)

### Installation

1. Clone or download this project
2. Open `index.html` in your web browser
3. Start using the calculator!

No installation or build process required - it's pure HTML, CSS, and JavaScript.

## Project Structure

```
betting-calculator/
├── index.html          # Main HTML file with UI structure
├── css/
│   └── style.css       # Styling and responsive design
├── js/
│   └── script.js       # All calculator logic and functionality
└── README.md           # This file
```

## How to Use

### Odds Converter
1. Enter an odds value (e.g., 2.5, 3/2, or +150)
2. Select the format of your input odds
3. Click "Convert Odds" or let it auto-convert as you type
4. View the conversion in all three formats

### Implied Probability Calculator
1. Enter an odds value in any format
2. Select the odds format
3. Click "Calculate Probability" or let it calculate automatically
4. View the implied probability percentage and visual bar

### Bet Calculator
1. Enter your stake amount (initial bet)
2. Enter the odds
3. Click "Calculate Returns" or let it calculate automatically
4. See your total payout and potential profit

## Odds Formats Explained

### Decimal Odds
- Common in Europe, Australia, and Canada
- Example: 2.5 means you win KSH 2.50 for every KSH 1 wagered
- Formula: Profit = Stake × (Odds - 1)

### Fractional Odds
- Common in the UK and Ireland
- Example: 3/2 means you win KSH 3 for every KSH 2 wagered
- Formula: Profit = Stake × (Numerator / Denominator)

### Moneyline (American Odds)
- Common in the United States
- Positive odds (+150): profit per KSH 100 wagered
- Negative odds (-200): amount needed to win KSH 100
- Example: +150 means win KSH 150 on a KSH 100 bet

## Implied Probability

Implied probability represents the likelihood of an outcome based on the odds:
- Formula: Implied Probability = (1 / Decimal Odds) × 100
- Higher probability = Lower odds = Smaller payouts
- Lower probability = Higher odds = Larger payouts

## Tips for Betting

⚠️ **Disclaimer:** This calculator is for educational purposes only. Always:
- Bet responsibly
- Never bet more than you can afford to lose
- Research before placing bets
- Use multiple sources for odds comparison
- Understand the risks involved

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential features to add:
- Parlay calculator for multiple bets
- Hedge betting calculator
- Bet history tracking (using localStorage)
- Odds comparison from multiple bookmakers
- Dark mode toggle
- Export results to PDF

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to fork, modify, and improve this project!

---

**Last Updated:** December 2025
**Version:** 1.0
