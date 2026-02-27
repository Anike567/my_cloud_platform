const validateKey = (requiredKeys, body) => {
  return requiredKeys.every(key => key in body);
};

module.exports = validateKey;