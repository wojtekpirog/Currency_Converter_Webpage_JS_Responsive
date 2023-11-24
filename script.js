// id inputa: amount
// id resulta: result
// id selecta: from-currency
const defineSelect = () => {
  fetch('https://api.nbp.pl/api/exchangerates/tables/c/')
    .then(response => response.json())
    .then(dataReady => console.log(dataReady))
    .catch(error => {
      console.log(`An error occured while fetching data. More information: ${error.message}`);
      alert("An error occured while fetching data from the server.");
    })
}

const convertToPLN = dataReady => {
  const input = document.querySelector("#amount");
  const result = document.querySelector("#result");
  const fromCurrency = document.querySelector("#from-currency");
  const selectedOption = fromCurrency.options[fromCurrency.selectedIndex].value;
  const exchangeRates = [];

  for (currency of dataReady[0].rates) {
    if (currency.code === selectedOption) {
      exchangeRates.push(currency.ask);
    }
  }

}