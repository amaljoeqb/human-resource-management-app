/**
 * Get data from url
 * @param {string} url url of request
 * @returns
 */
async function getData(url) {
  return fetch(url).then((response) => response.json());
}

/**
 * Function to add span for search term in a string
 */
function highlightSearchTerm(text, searchTerm) {
  try {
    if (typeof text !== "string" && typeof text !== "number") {
      return text;
    }
    const textString = text.toString();
    const lowerCaseText = textString.toString().toLowerCase();
    if (!searchTerm || !lowerCaseText.includes(searchTerm)) {
      return text;
    }
    const startIndex = lowerCaseText.toString().indexOf(searchTerm);
    const endIndex = startIndex + searchTerm.length;
    const highlightedText =
      textString.toString().slice(0, startIndex) +
      '<span class="highlight">' +
      textString.slice(startIndex, endIndex) +
      "</span>" +
      textString.slice(endIndex);
    return highlightedText;
  } catch (e) {
    console.log(e);
    return text;
  }
}

/**
 * Get rupees format for a number
 * @param {number} number - Number to format
 */
function getRupeesFormat(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(number);
}

/**
 * Convert date object to dd/mm/yyyy
 * @param {Date} date - Date object
 */
function convertFromDate(date) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Convert date string to date object
 * @param {string} dateString - Date string in dd/mm/yyyy format
 */
function convertToDate(dateString) {
  const dateParts = dateString.split("/");
  return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
}

/**
 * Transform skills list to span elements
 */
function transformSkills(skills) {
  return skills
    .map((skill) => `<span class="chip">${skill.skill}</span>`)
    .join("");
}

export {
  getData,
  highlightSearchTerm,
  getRupeesFormat,
  convertFromDate,
  convertToDate,
  transformSkills,
};
