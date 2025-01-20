// // Для гривні (UAH)
// console.log(formatCurrency(1000, 'UAH')); // 1 000,00 ₴
//
// // Для долара США (USD)
// console.log(formatCurrency(1000, 'USD')); // $1,000.00
//
// // Для євро (EUR)
// console.log(formatCurrency(1000, 'EUR')); // €1,000.00

function formatCurrency(value, currency = 'UAH', locale = 'uk-UA') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0, // Мінімум 0 десяткових знаків
        maximumFractionDigits: 0  // Максимум 0 десяткових знаків
    }).format(value);
}

export default formatCurrency;
