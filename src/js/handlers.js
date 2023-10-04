import {
  setEmployee,
  getNextEmployeeId,
  getEmployee,
  getAllSkills,
  getAllDepartments,
  getAllEmployees,
} from "./data.js";
import { state } from "./context.js";
import {
  renderTable,
  closePopup,
  setFormData,
  setDepartmentOptions,
  setDepartmentInput,
  getFormData,
} from "./controller.js";

const table = document.querySelector(".emp-table");
const tableBody = table.querySelector("tbody");
const columnTitles = table.querySelectorAll(".column-title");

/**
 * Function to trigger on click of column title
 */
function onClickColumnTitle(event) {
  const clickedTitle = event.currentTarget;
  const isAsc = clickedTitle.classList.contains("asc");
  const isDesc = clickedTitle.classList.contains("desc");
  state.sort.key = event.currentTarget.dataset.key;
  state.sort.asc = true;

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
    state.sort.asc = false;
  } else if (isDesc) {
    clickedTitle.classList.remove("desc");
    // By default, sort employeeId column in ascending order
    state.sort.key = "employeeId";
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
  state.searchTerm = searchInput.value.trim().toLowerCase();
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
 * @param {string} id employee id
 */
function editEmployee(id) {
  const employee = getEmployee(id);
  setFormData(employee);
  // show edit popup
  document.querySelector(".popup").classList = "popup show-popup edit-popup";
}

/**
 * Function to trigger on click of add employee button
 */
function onClickAddEmployee() {
  const nextId = getNextEmployeeId();
  const employee = {
    name: "",
    email: "",
    dateOfBirth: "",
    joiningDate: "",
    salary: "",
    designation: "",
    department: undefined,
    skills: [],
    employeeId: nextId,
  };
  setFormData(employee);
  // show add popup
  document.querySelector(".popup").classList = "popup show-popup add-popup";
}

/**
 * Function to trigger on click of save button
 */
function onClickSave(event) {
  event.preventDefault();
  const editForm = document.querySelector("#emp-form");
  const employeeId = editForm.querySelector("#employee-id").value;
  let existingEmployee = getEmployee(employeeId);
  let modifiedEmployee = getFormData();
  // TODO: remove this once skills is implemented
  if (existingEmployee) {
    modifiedEmployee.skills = existingEmployee.skills;
  }
  console.log(modifiedEmployee, existingEmployee);
  setEmployee(modifiedEmployee);
  closePopup();
  renderTable();
}

/**
 * Function to trigger on change of dropdown input
 */
function onChangeDepartmentInput(event) {
  const dropdownInput = event.currentTarget;
  const searchTerm = dropdownInput.value.trim().toLowerCase();
  let departments = getAllDepartments();
  departments = departments.filter((departmentItem) =>
    departmentItem.department.toLowerCase().includes(searchTerm)
  );
  setDepartmentOptions(departments);
}

export {
  onClickColumnTitle,
  onClickFilterButton,
  onChangeSearchInput,
  onClickAllCheck,
  onChangeRowCheck,
  editEmployee,
  onClickAddEmployee,
  onClickSave,
  onChangeDepartmentInput,
};