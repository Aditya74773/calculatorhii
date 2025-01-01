class Calculator {
    constructor() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
    }

    updateDisplay(display) {
        display.textContent = this.displayValue;
    }

    inputDigit(digit, display) {
        if (this.waitingForSecondOperand) {
            this.displayValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
        this.updateDisplay(display);
    }

    inputDecimal(display) {
        if (this.waitingForSecondOperand) {
            this.displayValue = '0.';
            this.waitingForSecondOperand = false;
            this.updateDisplay(display);
            return;
        }

        if (!this.displayValue.includes('.')) {
            this.displayValue += '.';
            this.updateDisplay(display);
        }
    }

    handleOperator(nextOperator, display) {
        const inputValue = parseFloat(this.displayValue);

        if (this.operator && this.waitingForSecondOperand) {
            this.operator = nextOperator;
            return;
        }

        if (this.firstOperand === null && !isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            this.displayValue = `${parseFloat(result.toFixed(7))}`;
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
        this.updateDisplay(display);
    }

    calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+': return firstOperand + secondOperand;
            case '-': return firstOperand - secondOperand;
            case '×': return firstOperand * secondOperand;
            case '÷': return firstOperand / secondOperand;
            case '%': return firstOperand % secondOperand;
            default: return secondOperand;
        }
    }

    clear(display) {
        this.displayValue = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.updateDisplay(display);
    }

    toggleSign(display) {
        this.displayValue = (parseFloat(this.displayValue) * -1).toString();
        this.updateDisplay(display);
    }
}

// Initialize calculator and get DOM elements
const calculator = new Calculator();
const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');

// Add event listener for all buttons
buttons.addEventListener('click', event => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.classList.contains('operator')) {
        const operator = target.textContent;
        if (operator === '±') {
            calculator.toggleSign(display);
        } else {
            calculator.handleOperator(operator, display);
        }
        return;
    }

    if (target.classList.contains('equals')) {
        calculator.handleOperator('=', display);
        return;
    }

    if (target.classList.contains('clear')) {
        calculator.clear(display);
        return;
    }

    if (target.textContent === '.') {
        calculator.inputDecimal(display);
        return;
    }

    calculator.inputDigit(target.textContent, display);
});
