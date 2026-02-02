const convertNumericStringsToNumbers = obj => {
  const newObj = {};

  Object.entries(obj).forEach(entry => {
    const [key, value] = entry;
    const convertedToNumber = Number(value);
    if (Number.isFinite(convertedToNumber) && !(value instanceof Date))
      newObj[key] = convertedToNumber;
    else newObj[key] = value;
  });

  return newObj;
};

export default convertNumericStringsToNumbers;
