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
        case 'salary':
            return employees.sort(numericalSort);
        case 'employeeId':
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

export { sortEmployees, filterEmployees };