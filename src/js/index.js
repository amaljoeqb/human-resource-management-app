import { getData, highlightSearchTerm } from "./helpers.js";
import { sortEmployees, searchEmployees } from "./data.js";

const table = document.querySelector('.emp-table');
const tableHeader = table.querySelector('.header-row');
const tableBody = table.querySelector('tbody');
const columnTitles = tableHeader.querySelectorAll('.column-title');
const filterButtons = document.querySelectorAll('.filter');
const searchInput = document.querySelector('.search-input');

let employees = {};
let searchValue = '';

searchInput.addEventListener('input', onChangeSearchInput);

columnTitles.forEach((columnTitle) => {
    columnTitle.addEventListener('click', onClickColumnTitle);
});

filterButtons.forEach((filterButton) => {
    filterButton.addEventListener('click', onClickFilterButton);
});

/**
 * Function to render rows of the table
 */
function renderTable(data, searchTerm) {
    tableBody.innerHTML = '';
    data.forEach((employee) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${highlightSearchTerm(employee.employeeId, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.name, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.email, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.designation, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.department, searchTerm)}</td>
            <td>${employee.skills.join(", ")}</td>
            <td>${highlightSearchTerm(employee.dateOfBirth, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.joiningDate, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.salary, searchTerm)}</td>
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
    renderTable(sortedEmployees, searchValue);
}

/**
 * Function to trigger on click of filter button
 */
function onClickFilterButton(event) {
    const filterForm = event.currentTarget.parentElement.querySelector('.filter-form');
    filterForm.classList.toggle('hidden');
}

/**
 * Function to trigger on change of search input
 */
function onChangeSearchInput(event) {
    event.preventDefault();
    const searchInput = event.currentTarget;
    searchValue = searchInput.value.toLowerCase();
    const filteredEmployees = searchEmployees(Object.values(employees), searchValue);
    renderTable(filteredEmployees, searchValue);
}

loadEmployees().then((data) => {
    renderTable(Object.values(data));
});