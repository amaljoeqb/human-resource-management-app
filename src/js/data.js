/**
 * Function to sort employees array based on an attribute
 * @param {array} employees - Array of employees
 * @param {string} key - Name of the attribute to sort
 * @param {boolean} asc - Order to sort the column (ascending/descending)
 */
function sortEmployees(employees, key, asc = true) {
    const numericalSort = (a, b) => {
        if (asc) {
            return a[key] - b[key];
        } else {
            return b[key] - a[key];
        }
    }

    const alphaNumericSort = (a, b) => {
        if (asc) {
            return a[key].localeCompare(b[key]);
        } else {
            return b[key].localeCompare(a[key]);
        }
    }

    const dateSort = (a, b) => {
        if (asc) {
            return new Date(a[key]) - new Date(b[key]);
        } else {
            return new Date(b[key]) - new Date(a[key]);
        }
    }

    switch (key) {
        case 'employeeId':
        case 'salary':
            return employees.sort(numericalSort);
        case 'name':
        case 'email':
        case 'designation':
        case 'department':
            return employees.sort(alphaNumericSort);
        case 'dateOfBirth':
        case 'joiningDate':
            return employees.sort(dateSort);
        default:
            return employees;
    }
}

/**
 * Fuction to filter employees array based on a attribute value
 * @param {array} employees - Array of employees
 * @param {string} key - Name of the attribute to filter
 * @param {string} value - Value of the attribute to filter
 */
function filterEmployees(employees, key, value) {
    try {
        const lowerCaseValue = value.toLowerCase();
        return employees.filter(employee => employee[key].toLowerCase().includes(lowerCaseValue));
    } catch (e) {
        return employees;
    }
}

/**
 * Fuction to search employees array based on a search term
 * @param {array} employees - Array of employees
 * @param {string} searchTerm - Term to search for
 */
function searchEmployees(employees, searchTerm) {
    try {
        const lowerCaseValue = searchTerm.toLowerCase();
        return employees.filter(employee => Object.values(employee)
            .some((value) => (typeof value === "string" || typeof value === "number") && value.toString().toLowerCase().includes(lowerCaseValue)));
    } catch (e) {
        return [];
    }
}

/**
 * Get rupees format for a number
 * @param {number} number - Number to format
 */
function getRupeesFormat(number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(number);
}

export { sortEmployees, filterEmployees, searchEmployees, getRupeesFormat };