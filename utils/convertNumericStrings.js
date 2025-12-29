const convertNumericStringsToNumbers = obj => {
  const newObj = {};

  Object.entries(obj).forEach(entry => {
    const [key, value] = entry;
    if (Number.isInteger(Number(value))) newObj[key] = Number(value);
    else newObj[key] = value;
  });

  return newObj;
};

export default convertNumericStringsToNumbers;
