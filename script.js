const navbarToggler = document.querySelector(".navbar-toggler");
const navbarLinks = document.querySelector(".navbar-links");
const leftSelect = document.querySelector("#from-currency");
const rightSelect = document.querySelector("#to-currency");
const convertBtn = document.querySelector("#convert-btn");
const input = document.querySelector("#amount");
const result = document.querySelector("#result");

navbarToggler.addEventListener('click', () => {
  navbarLinks.classList.toggle('active');
});

fetch("https://api.frankfurter.app/currencies")
  .then(response => response.json())
  .then(dataReady => render(dataReady))
  .catch(error => {
    alert(`❌An error occured while fetching data: ${error.message}❌`);
  })

const render = dataReady => {
  const currencies = Object.entries(dataReady);
  for (let i = 0; i < currencies.length; i++) {
    leftSelect.innerHTML += `<option value="${currencies[i][0]}">${currencies[i][1]}</option>`;
    rightSelect.innerHTML += `<option value="${currencies[i][0]}">${currencies[i][1]}</option>`;
  }
}

convertBtn.addEventListener('click', () => {
  let fromCurrency = leftSelect.value;
  let toCurrency = rightSelect.value;
  let amount = input.value;

  if (fromCurrency === toCurrency) {
    result.innerHTML = "Currencies should be different.";
    result.setAttribute("style", "color: red");
  } else {
    convert(fromCurrency, toCurrency, amount);
  }
})

const convert = (fromCurrency, toCurrency, amount) => {
  fetch(`https://api.frankfurter.app/latest?amount=${Number(amount)}&from=${fromCurrency}&to=${toCurrency}`)
    .then(response => response.json())
    .then(dataReady => {
      console.log(dataReady);
      let rates = Object.entries(dataReady.rates);
      if (amount <= 0 || isNaN(amount)) {
        result.innerText = "The value specified should be a number greater than zero.";
        result.setAttribute("style", "color: red");
      } else {
        result.innerHTML = `${amount} ${dataReady.base} = <span style="color: var(--violet)">${rates[0][1].toFixed(2)}</span> ${rates[0][0]}`;
        result.setAttribute("style", "color: black");
      }
    })
}