const formatToFixed = (money:any, decimals = 2) => {
    return (
      Math.round(
        (parseFloat(money) + Number.EPSILON) * Math.pow(10, decimals)
      ) / Math.pow(10, decimals)
    ).toFixed(decimals);
  }
const Format = {
  formatMoney: (money:any, symbol = "", decimals = 2) =>
    formatToFixed(money, decimals)
      .replace(/\B(?=(\d{3})+\b)/g, ",")
      .replace(/^/, `${symbol}`),
};

export default Format;