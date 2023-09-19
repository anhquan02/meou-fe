const convertMoney = (money: number) => {
  return money.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
};

const convertDate = (date: string) => {
  const dateConvert = new Date(date);
  return dateConvert.toLocaleDateString("en-GB");
}


export { convertMoney, convertDate };
export default convertMoney;