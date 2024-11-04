let amountInput;
let leftSelect;
let swapButton;
let rightSelect;
let convertButton;
let errorMessage;
let result;

const URL = "https://api.frankfurter.app/currencies";

function main() {
  getElements();
  addListeners();
  renderLists();
};

function getElements() {
  amountInput = document.querySelector(".app__body-input");
  leftSelect = document.querySelector(".app__body-select--from");
  swapButton = document.querySelector(".app__body-swap-button");
  rightSelect = document.querySelector(".app__body-select--to");
  convertButton = document.querySelector(".app__body-convert-button");
  errorMessage = document.querySelector(".app__body-error");
  result = document.querySelector(".app__body-result");
};

function addListeners() {
  convertButton.addEventListener("click", getCurrencies);
};

function renderLists() {
  fetch(URL)
    .then((response) => response.json())
    .then((dataReady) => {
      Object.entries(dataReady).forEach((currency) => {
        leftSelect.innerHTML += `<option value="${currency[0]}">${currency[1]} (${currency[0]})</option>`;
        rightSelect.innerHTML += `<option value="${currency[0]}">${currency[1]} (${currency[0]})</option>`;
      });

      leftSelect.value = "USD";
      rightSelect.value = "EUR";
    })
    .catch((error) => handleError(error));
}

const getCurrencies = () => {
  let amount = amountInput.value;
  let fromCurrency = leftSelect.value;
  let toCurrency = rightSelect.value;

  if (fromCurrency === toCurrency) {
    errorMessage.setAttribute("aria-hidden", "false");
    errorMessage.textContent = "Currencies should be different.";
  } else {
    errorMessage.setAttribute("aria-hidden", "true");
    errorMessage.textContent = "";
    convert(amount, fromCurrency, toCurrency);
  }
}

const convert = (amount, fromCurrency, toCurrency) => {
  amount = parseFloat(amount) * 100; // Get the amount in cents
  amount = (Math.round(amount) / 100).toFixed(2);

  fetch(`https://api.frankfurter.app/latest?amount=${Number(amount)}&from=${fromCurrency}&to=${toCurrency}`)
    .then((response) => response.json())
    .then((dataReady) => {
      const data = Object.entries(dataReady.rates)[0];

      result.setAttribute("aria-hidden", "false");
      result.innerHTML = `${amount + " " + dataReady.base} = ${(Math.round(data[1] * 100) / 100).toFixed(2) + " " + data[0]}`;
    })
    .catch((error) => handleError(error));
}

// const formatCurrency = (amountCents) => {
//   return (Math.round(amountCents) / 100).toFixed(2);
// }

const handleError = (error) => {
  errorMessage.setAttribute("aria-hidden", "false");
  errorMessage.textContent = "We're sorry, an error has occured while fetching the data. Please try again later.";
  console.error(`An error has occured while fetching the data: ${error.message}.`);
}

document.addEventListener("DOMContentLoaded", main);