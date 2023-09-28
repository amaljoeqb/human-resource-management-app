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
        if (typeof text !== 'string') {
            return text;
        }
        const lowerCaseText = text.toLowerCase();
        if (!searchTerm || !lowerCaseText.includes(searchTerm)) {
            return text;
        }
        const startIndex = lowerCaseText.indexOf(searchTerm);
        const endIndex = startIndex + searchTerm.length;
        const highlightedText = text.slice(0, startIndex) + '<span class="highlight">' + text.slice(startIndex, endIndex) + '</span>' + text.slice(endIndex);
        return highlightedText;
    } catch (e) {
        console.log(e)
        return text;
    }
}

export { getData, highlightSearchTerm };
