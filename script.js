    const display = document.getElementById('display');
    const historyPanel = document.getElementById('history-panel');
    const historyContent = document.getElementById('history-content');
    let displayString = '';
    let internalExpression = '';
    let lastResult = null;
    let isFraction = false;

    function appendValue(displayVal, internalVal) {
      displayString += displayVal;
      internalExpression += internalVal;
      display.value = displayString;
    }

    function clearDisplay() {
      displayString = '';
      internalExpression = '';
      display.value = '';
    }

    function deleteChar() {
      displayString = displayString.slice(0, -1);
      internalExpression = internalExpression.slice(0, -1);
      display.value = displayString;
    }

    function factorial(n) {
      if (n < 0) return NaN;
      return n <= 1 ? 1 : n * factorial(n - 1);
    }

    function replaceFactorials(expr) {
      return expr.replace(/(\d+(\.\d+)?|\([^()]*\))!/g, (match, p1) => {
        return `factorial(${p1})`;
      });
    }

    function calculate() {
      try {
        let expr = replaceFactorials(internalExpression);
        let result = Function('factorial', `return ${expr}`)(factorial);
        lastResult = result;
        isFraction = false;
        // Save the display string before it is replaced
        const displayForHistory = displayString;
        display.value = result;
        displayString = result.toString();
        internalExpression = result.toString();
        updateHistory(displayForHistory, result); // Use display string!
      } catch {
        display.value = 'Error';
        displayString = '';
        internalExpression = '';
      }
    }

    function updateHistory(displayExpr, result) {
      const entry = document.createElement('div');
      entry.innerText = `${displayExpr} = ${result}`;
      historyContent.prepend(entry);
    }

    function toggleHistory() {
      historyPanel.style.display =
        historyPanel.style.display === 'none' ? 'block' : 'none';
    }

    function toggleFraction() {
      if (lastResult === null) return;
      if (isFraction) {
        display.value = lastResult;
        isFraction = false;
      } else {
        display.value = toFraction(lastResult);
        isFraction = true;
      }
    }

    function toFraction(decimal) {
      if (Number.isInteger(decimal)) return `${decimal}/1`;
      let tolerance = 1.0E-6;
      let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = decimal;
      do {
        let a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
      } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
      return `${h1}/${k1}`;
    }
  