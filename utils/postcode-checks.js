const postcodeRegex = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/;
const postcodePrefixRegex = /^[A-Z]{1,2}$/;

const postcodeCheck = (postcode) => {
  return postcodeRegex.test(postcode);
};

const postcodePrefixCheck = (postcode_prefix) => {
  return postcodePrefixRegex.test(postcode_prefix);
};

module.exports = { postcodeCheck, postcodePrefixCheck };
