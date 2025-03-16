$(document).ready(function () {
  let expression = "";
  let history = "";
  const maxLength = 15;
  let limitReached = false;

  $(".number-btn").click(function () {
    let value = $(this).text();

    if (expression === "0" && value === "0") return;
    if (expression === "0" && /[1-9]/.test(value)) {
      expression = value;
    } else if (expression.length < maxLength) {
      expression += value;
      limitReached = false;
    } else {
      if (!limitReached) {
        updateDisplay("Input limit reached");

        limitReached = true;
      }
      return;
    }
    updateDisplay(expression);
  });

  $("#decimal").click(function () {
    let parts = expression.split(/[-+*/]/);
    let lastPart = parts[parts.length - 1];

    if (!lastPart.includes(".")) {
      expression += ".";
      updateDisplay(expression);
    }
  });

  $(".operator-btn").click(function () {
    let value = $(this).text();

    if (expression === "" && value !== "-") return;

    if (/[*+/]$/.test(expression) && value === "-") {
      expression += value;
    } else if (/[*+/\-]$/.test(expression)) {
      expression = expression.replace(/[*+/\-]+$/, "") + value;
    } else {
      expression += value;
    }
    updateDisplay(expression);
  });

  $("#clear").click(function () {
    expression = "";
    history = "";
    updateDisplay("0");
    updateHistory("");
    limitReached = false;
  });

  $("#delete").click(function () {
    expression = expression.slice(0, -1);
    updateDisplay(expression || "0");
    limitReached = false;
  });

  $("#equals").click(function () {
    try {
      let result = safeEval(expression);
      history = expression + " = " + result;
      updateHistory(history);
      expression = result.toString().slice(0, maxLength);
      updateDisplay(expression);
    } catch {
      updateDisplay("Errore");
      expression = "";
    }
  });

  function updateDisplay(value) {
    $("#display").text(value);
  }

  function updateHistory(value) {
    $("#history").text(value);
  }

  function safeEval(expr) {
    if (!/^[0-9+\-*/(). ]+$/.test(expr)) {
      throw new Error("Invalid input");
    }
    return Function(`'use strict'; return (${expr})`)();
  }
});
