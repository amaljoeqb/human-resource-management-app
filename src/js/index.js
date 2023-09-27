import { getData } from "./helpers.js";
import { sortEmployees } from "./data.js";

const table = document.querySelector('.emp-table');
const tableHeader = table.querySelector('.header-row');
const tableBody = table.querySelector('tbody');
const columnTitles = tableHeader.querySelectorAll('.column-title');

let employees = {}

columnTitles.forEach((columnTitle) => {
    columnTitle.addEventListener('click', onClickColumnTitle);
});

/**
 * Function to render rows of the table
 */
function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach((employee) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.employeeId}</td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.designation}</td>
            <td>${employee.department}</td>
            <td>${employee.skills.join(", ")}</td>
            <td>${employee.dateOfBirth}</td>
            <td>${employee.joiningDate}</td>
            <td>${employee.salary}</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Function to load employees from local storage or API
 */
async function loadEmployees() {
    const employeesData = await getData("assets/json/employees.json");
    employees = employeesData.employees;
    return employees;
}

/**
 * Function to trigger on click of column title
 */
function onClickColumnTitle(event) {
    const key = event.target.dataset.key;
    const asc = event.target.classList.contains('asc');
    const sortedEmployees = sortEmployees(Object.values(employees), key, asc);
    renderTable(sortedEmployees);
}


loadEmployees().then((data) => {
    renderTable(Object.values(data));
});