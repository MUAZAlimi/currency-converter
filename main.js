const getCurrencyOptions = async () => {
    const apiUrl = 'https://api.exchangerate.host/symbols';
    const res = await fetch(apiUrl);
    const json = await res.json();
    return json.symbols;
    // return fetch(apiUrl)
    // .then((res) => res.json())
    // .then((data) => data.symbols);
};


// const getCurrencyRate = async (fromCurrency, toCurrency) => {
//     const apiUrl = 'https://api.exchangerate.host/convert';
//     const currencyConvertUrl = new URL(apiUrl);
//     currencyConvertUrl.searchParams.append("from", fromCurrency)
//     currencyConvertUrl.searchParams.append("to", toCurrency)

//     // console.log(currencyConvertUrl);
//     const res = await fetch(currencyConvertUrl);
//     const json = await res.json()
//     // console.log(json);
//     // console.log(json.result);
//     return json.result
// };

const getCurrencyRate = async (fromCurrency, toCurrency) => {
    const apiUrl = 'https://api.exchangerate.host/convert';
    const currencyConvertUrl = new URL(apiUrl);
    currencyConvertUrl.searchParams.append("from", fromCurrency)
    currencyConvertUrl.searchParams.append("to", toCurrency)
    return fetch(currencyConvertUrl)
        .then((res) => res.json())
        .then((data) => data.result)
}
const appendOptionsElToSelectEl = (optionItems, selectEl) => {
    const optionEl = document.createElement("option");
    optionEl.value = optionItems.code;
    optionEl.textContent = optionItems.description
    selectEl.appendChild(optionEl);
};
const populateSelectEL = (selectEl, optionItems) => {
    optionItems.forEach(optionItem => appendOptionsElToSelectEl(optionItem, selectEl));
};

const setUpCurrencies = async () => {
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");

    const currencyOptions = await getCurrencyOptions();
    const currencies = Object.keys(currencyOptions).map(currencyKeys =>
        currencyOptions[currencyKeys]);
    // console.log(currencies);
    populateSelectEL(fromCurrency, currencies);
    populateSelectEL(toCurrency, currencies);
};
setUpCurrencies()

const setEventListener = () => {
    const formEl = document.querySelector("#convert")
    formEl.addEventListener("submit", async (event) => {
        event.preventDefault();
        const fromCurrency = document.getElementById("fromCurrency");
        const toCurrency = document.getElementById("toCurrency");
        const amount = document.querySelector('#amount');
        console.log(amount);
        const convertResultEL = document.querySelector('#result');        
        try {
            const rates = await getCurrencyRate(fromCurrency.value, toCurrency.value);
            const amountValue = Number(amount.value);
            const conversionRate = Number(amountValue * rates).toFixed(2);
            convertResultEL.textContent = `${amountValue}${fromCurrency.value} = ${conversionRate} ${toCurrency.value}`
        } catch (err) {
            convertResultEL.textContent = `There is an error ${err.message}`;
            convertResultEL.classList.add("error");
        }
    })
}
setEventListener()