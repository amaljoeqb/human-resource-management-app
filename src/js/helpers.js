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
        if (typeof text !== 'string' && typeof text !== 'number') {
            return text;
        }
        const textString = text.toString();
        const lowerCaseText = textString.toString().toLowerCase();
        if (!searchTerm || !lowerCaseText.includes(searchTerm)) {
            return text;
        }
        const startIndex = lowerCaseText.toString().indexOf(searchTerm);
        const endIndex = startIndex + searchTerm.length;
        const highlightedText = textString.toString().slice(0, startIndex) + '<span class="highlight">' + textString.slice(startIndex, endIndex) + '</span>' + textString.slice(endIndex);
        return highlightedText;
    } catch (e) {
        console.log(e)
        return text;
    }
}

export { getData, highlightSearchTerm };
