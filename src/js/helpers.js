/**
 * Get data from url
 * @param {string} url url of request
 * @returns
 */
async function getData(url) {
    return fetch(url).then((response) => response.json());
}

export { getData };
