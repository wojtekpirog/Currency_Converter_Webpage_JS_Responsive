let amountInput;
let leftSelect;
let swapButton;
let rightSelect;
let convertButton;
let errorMessage;
let result;

let amount;
let fromCurrency;
let toCurrency;

const API_URL = "https://api.frankfurter.app";

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
  swapButton.addEventListener("click", swapCurrencies);
};

const fetchData = async (url) => {
  const response = await fetch(url);
  // If the response status is not 200, throw an error
  if (!response.ok) {
    throw new Error(`HTTP request failed. Status: ${response.status}`);
  }
  // Return parsed data
  return await response.json();
}

const renderLists = async () => {
  try {
    const dataReady = await fetchData(`${API_URL}/currencies`);
    // Fill the left and right select lists
    Object.entries(dataReady).forEach((currency) => {
      leftSelect.innerHTML += `<option class="app__body-select-option" value="${currency[0]}">${currency[1]} (${currency[0]})</option>`;
      rightSelect.innerHTML += `<option class="app__body-select-option" value="${currency[0]}">${currency[1]} (${currency[0]})</option>`;
    });
    // Set "USD" and "EUR" as the default currencies
    leftSelect.value = "USD";
    rightSelect.value = "EUR";
  } catch (error) {
    handleError(error);
  }
}

const getCurrencies = () => {
  amount = parseFloat(amountInput.value);
  fromCurrency = leftSelect.value;
  toCurrency = rightSelect.value;

  if (fromCurrency === toCurrency) {
    errorMessage.setAttribute("aria-hidden", "false");
    errorMessage.textContent = "Currencies should be different.";
  } else if (amount <= 0) {
    errorMessage.setAttribute("aria-hidden", "false");
    errorMessage.textContent = "The value specified should be greater than zero.";
  } else {
    errorMessage.setAttribute("aria-hidden", "true");
    errorMessage.textContent = "";
    // Convert between currencies
    convert(amount);
  }
}

const swapCurrencies = () => {
  // Get the value of the currency selected in the left dropdown list:
  const leftCurrency = leftSelect.value;
  // Set the value of the currency selected in the left dropdown list to the right one:
  leftSelect.value = rightSelect.value;
  // Set the value of the currency selected in the right dropdown list to the left one:
  rightSelect.value = leftCurrency;
  // Convert between currencies
  getCurrencies();
}

const convert = async (amount) => {
  amount = formatCurrency(amount); // Ensure that the amount is formatted correctly

  try {
    const dataReady = await fetchData(`${API_URL}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
    const data = Object.entries(dataReady.rates)[0];

    result.setAttribute("aria-hidden", "false");
    result.innerHTML = `${amount} ${dataReady.base} = ${formatCurrency(data[1])} ${data[0]}`;
  } catch (error) {
    handleError(error);
  }
}

const formatCurrency = (amount) => {
  return (Math.round(amount * 100) / 100).toFixed(2);
}

const handleError = (error) => {
  errorMessage.setAttribute("aria-hidden", "false");
  errorMessage.textContent = "We're sorry, an error has occured while fetching the data. Please try again later.";
  console.error(`An error has occured while fetching the data: ${error.message}.`);
}

document.addEventListener("DOMContentLoaded", main);