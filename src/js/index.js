import { getData } from "./helpers.js";
import { sortEmployees } from "./data.js";

const table = document.querySelector('.emp-table');
const tableHeader = table.querySelector('.header-row');
const tableBody = table.querySelector('tbody');
const columnTitles = tableHeader.querySelectorAll('.column-title');
const filterButtons = document.querySelectorAll('.filter');

let employees = {}

columnTitles.forEach((columnTitle) => {
    columnTitle.addEventListener('click', onClickColumnTitle);
});

filterButtons.forEach((filterButton) => {
    filterButton.addEventListener('click', onClickFilterButton);
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
    const clickedTitle = event.currentTarget;
    const isAsc = clickedTitle.classList.contains('asc');
    const isDesc = clickedTitle.classList.contains('desc');
    let key = event.currentTarget.dataset.key;
    let asc = true;

    // Remove asc and desc classes from all column titles
    columnTitles.forEach(title => {
        title.classList.remove('asc', 'desc');
    });

    // Toggle asc and desc classes on clicked column title
    if (!isAsc && !isDesc) {
        clickedTitle.classList.add('asc');
    } else if (isAsc) {
        clickedTitle.classList.remove('asc');
        clickedTitle.classList.add('desc');
        asc = false;
    } else if (isDesc) {
        clickedTitle.classList.remove('desc');
        // By default, sort employeeId column in ascending order
        key = 'employeeId';
    }
    const sortedEmployees = sortEmployees(Object.values(employees), key, asc);
    renderTable(sortedEmployees);
}

/**
 * Function to trigger on click of filter button
 */
function onClickFilterButton(event) {
    const filterForm = event.currentTarget.parentElement.querySelector('.filter-form');
    filterForm.classList.toggle('hidden');
}


loadEmployees().then((data) => {
    renderTable(Object.values(data));
});