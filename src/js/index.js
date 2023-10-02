import { getData, highlightSearchTerm, getRupeesFormat } from "./helpers.js";
import { sortEmployees, searchEmployees } from "./data.js";

const table = document.querySelector(".emp-table");
const tableHeader = table.querySelector(".header-row");
const tableBody = table.querySelector("tbody");
const columnTitles = tableHeader.querySelectorAll(".column-title");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.querySelector(".search-input");
const allCheck = document.querySelector(".all-check");
const popup = document.querySelector(".popup");
const closePopupButton = document.querySelector(".close-popup");
const addEmployeeButton = document.querySelector(".add-employee");

// data of the application
let employees = {};

// state of the application
let sort = {
  key: "employeeId",
  asc: true,
};
let searchTerm = "";
let pagination = {
  page: 1,
  limit: 10,
};

addEmployeeButton.addEventListener("click", onClickAddEmployee);

closePopupButton.addEventListener("click", closePopup);
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    closePopup();
  }
});

allCheck.addEventListener("click", onClickAllCheck);

searchInput.addEventListener("input", onChangeSearchInput);

columnTitles.forEach((columnTitle) => {
  columnTitle.addEventListener("click", onClickColumnTitle);
});

filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", onClickFilterButton);
});

/**
 * Function to render rows of the table
 */
function renderTable() {
  let filteredEmployees = searchEmployees(Object.values(employees), searchTerm);
  filteredEmployees = sortEmployees(filteredEmployees, sort.key, sort.asc);
  tableBody.innerHTML = "";
  filteredEmployees.forEach((employee) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><input type="checkbox" class="row-check"></td>
            <td>${highlightSearchTerm(employee.employeeId, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.name, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.email, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.designation, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.department, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.skills.join(", "))}</td>
            <td>${highlightSearchTerm(employee.dateOfBirth, searchTerm)}</td>
            <td>${highlightSearchTerm(employee.joiningDate, searchTerm)}</td>
            <td>${highlightSearchTerm(
              getRupeesFormat(employee.salary),
              searchTerm
            )}</td>
        `;
    row.addEventListener("click", () => {
      editEmployee(employee.employeeId);
    });
    row.querySelector(".row-check").addEventListener("click", onChangeRowCheck);
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
  const isAsc = clickedTitle.classList.contains("asc");
  const isDesc = clickedTitle.classList.contains("desc");
  sort.key = event.currentTarget.dataset.key;
  sort.asc = true;

  // Remove asc and desc classes from all column titles
  columnTitles.forEach((title) => {
    title.classList.remove("asc", "desc");
  });

  // Toggle asc and desc classes on clicked column title
  if (!isAsc && !isDesc) {
    clickedTitle.classList.add("asc");
  } else if (isAsc) {
    clickedTitle.classList.remove("asc");
    clickedTitle.classList.add("desc");
    sort.asc = false;
  } else if (isDesc) {
    clickedTitle.classList.remove("desc");
    // By default, sort employeeId column in ascending order
    sort.key = "employeeId";
  }
  renderTable();
}

/**
 * Function to trigger on click of filter button
 */
function onClickFilterButton(event) {
  const filterForm =
    event.currentTarget.parentElement.querySelector(".filter-form");
  filterForm.classList.toggle("hidden");
}

/**
 * Function to trigger on change of search input
 */
function onChangeSearchInput(event) {
  event.preventDefault();
  const searchInput = event.currentTarget;
  searchTerm = searchInput.value.trim().toLowerCase();
  renderTable();
}

/**
 * Function to trigger on click of all check
 */
function onClickAllCheck(event) {
  const allCheck = event.currentTarget;
  const isChecked = allCheck.checked;
  const rowChecks = tableBody.querySelectorAll(".row-check");
  rowChecks.forEach((rowCheck) => {
    rowCheck.checked = isChecked;
  });
}

/**
 * Function to trigger on change of row check
 * @param {Event} event
 */
function onChangeRowCheck(event) {
  const rowCheck = event.currentTarget;
  const isChecked = rowCheck.checked;
  const allCheck = document.querySelector(".all-check");
  if (!isChecked) {
    allCheck.checked = false;
  } else {
    const rowChecks = tableBody.querySelectorAll(".row-check");
    let allChecked = true;
    rowChecks.forEach((rowCheck) => {
      if (!rowCheck.checked) {
        allChecked = false;
      }
    });
    allCheck.checked = allChecked;
  }
}

/**
 * Function to edit employee with edit popup
 * @param {string} id student id
 */
function editEmployee(id) {
  // get student from students object
  const employee = employees[id];
  console.log(employees);
  const editForm = document.querySelector("#emp-form");
  // set edit form values
  editForm.querySelector("#name").value = employee.name;
  editForm.querySelector("#email").value = employee.email;
  editForm.querySelector("#dob").value = employee.dateOfBirth;
  editForm.querySelector("#joining-date").value = employee.joiningDate;
  editForm.querySelector("#salary").value = employee.salary;
  editForm.querySelector("#designation").value = employee.designation;
  editForm.querySelector("#department").value = employee.department;
  editForm.querySelector("#employee-id").value = employee.employeeId;
  // show edit popup
  document.querySelector(".popup").classList = "popup show-popup edit-popup";
}

/**
 * Function to trigger on click of add employee button
 */
function onClickAddEmployee() {
  // show add popup
  document.querySelector(".popup").classList = "popup show-popup add-popup";
}

/**
 * Function to trigger on click of save button
 */
function onClickSave() {
  const editForm = document.querySelector("#emp-form");
  const employeeId = editForm.querySelector("#employee-id").value;
  // get student from students object
  const employee = employees[employeeId];
  // set student values
  employee.name = editForm.querySelector("#name").value;
  employee.email = editForm.querySelector("#email").value;
  employee.dateOfBirth = editForm.querySelector("#dob").value;
  employee.joiningDate = editForm.querySelector("#joining-date").value;
  employee.salary = editForm.querySelector("#salary").value;
  employee.designation = editForm.querySelector("#designation").value;
  employee.department = editForm.querySelector("#department").value;
  // close popup
  closePopup();
  // render table
  renderTable();
}

/**
 * Function to close popup
 */
function closePopup() {
  document.querySelector(".popup").classList.remove("show-popup");
}

loadEmployees().then(() => {
  renderTable();
});
