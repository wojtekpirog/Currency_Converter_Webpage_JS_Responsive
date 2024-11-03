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
    })
    .catch((error) => console.error(error));
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
  fetch(`https://api.frankfurter.app/latest?amount=${Number(amount)}&from=${fromCurrency}&to=${toCurrency}`)
    .then((response) => response.json())
    .then((dataReady) => {
      const data = Object.entries(dataReady.rates)[0];

      result.setAttribute("aria-hidden", "false");
      result.innerHTML = `${dataReady.amount + " " + dataReady.base} = ${data[1] + " " + data[0]}`;
    })
    .catch((error) => console.error(error));
}

document.addEventListener("DOMContentLoaded", main);

// const navbarToggler = document.querySelector(".navbar-toggler");
// const navbarLinks = document.querySelector(".navbar-links");
// const leftSelect = document.querySelector("#from-currency");
// const rightSelect = document.querySelector("#to-currency");
// const convertBtn = document.querySelector("#convert-btn");
// const input = document.querySelector("#amount");
// const result = document.querySelector("#result");

// convertBtn.addEventListener('click', () => {
//   let fromCurrency = leftSelect.value;
//   let toCurrency = rightSelect.value;
//   let amount = input.value;

//   if (fromCurrency === toCurrency) {
//     result.innerHTML = "Currencies should be different.";
//     result.setAttribute("style", "color: red");
//   } else {
//     convert(fromCurrency, toCurrency, amount);
//   }
// })

// const convert = (fromCurrency, toCurrency, amount) => {
//   fetch(`https://api.frankfurter.app/latest?amount=${Number(amount)}&from=${fromCurrency}&to=${toCurrency}`)
//     .then(response => response.json())
//     .then(dataReady => {
//       console.log(dataReady);
//       let rates = Object.entries(dataReady.rates);
//       if (amount <= 0 || isNaN(amount)) {
//         result.innerText = "The value specified should be a number greater than zero.";
//         result.setAttribute("style", "color: red");
//       } else {
//         result.innerHTML = `${amount} ${dataReady.base} = <span style="color: var(--violet)">${rates[0][1].toFixed(2)}</span> ${rates[0][0]}`;
//         result.setAttribute("style", "color: black");
//       }
//     })
// }