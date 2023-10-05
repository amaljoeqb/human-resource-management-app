import { highlightSearchTerm, getRupeesFormat } from "./helpers.js";
import {
  sortEmployees,
  searchEmployees,
  getAllDepartments,
  getAllEmployees,
} from "./data.js";
import {
  onChangeRowCheck,
  editEmployee,
  onClickDelete,
  onClickActionButton,
  onClickName,
  onClickPageNumber,
} from "./handlers.js";
import { state } from "./context.js";

const table = document.querySelector(".emp-table");
const tableBody = table.querySelector("tbody");
const pageNumbers = document.querySelector(".page-numbers");

/**
 * Function to render rows of the table
 */
function renderTable() {
  let filteredEmployees = searchEmployees(state.searchTerm);
  filteredEmployees = sortEmployees(
    filteredEmployees,
    state.sort.key,
    state.sort.asc
  );
  const pagination = state.pagination;
  const start = (pagination.pageNumber - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  pagination.lastPage = Math.ceil(filteredEmployees.length / pagination.pageSize);
  console.log(start, end);
  filteredEmployees = filteredEmployees.slice(start, end);
  tableBody.innerHTML = "";
  filteredEmployees.forEach((employee) => {
    try {
      const row = document.createElement("tr");
      row.classList.add("emp-row");
      row.innerHTML = `
                  <td><input type="checkbox" class="row-check"></td>
                  <td>${highlightSearchTerm(
                    employee.employeeId,
                    state.searchTerm
                  )}</td>
                  <td>
                    <div class="name-container">
                    <a class="name">${highlightSearchTerm(
                      employee.name,
                      state.searchTerm
                    )}</a>
                    <p class="email">${highlightSearchTerm(
                      employee.email,
                      state.searchTerm
                    )}</p>
                    </div>
                  </td>
                  <td>${highlightSearchTerm(
                    employee.designation,
                    state.searchTerm
                  )}</td>
                  <td>${highlightSearchTerm(
                    employee.department.department,
                    state.searchTerm
                  )}</td>
                  <td>${highlightSearchTerm(
                    employee.skills.map((skill) => skill.skill)
                  )}</td>
                  <td class="action-cell">
              <div class="action-container">
                <a href="javascript:void(0)" class="action-btn">
                  <span class="material-symbols-outlined"> more_horiz </span>
                </a>
                <div class="action-menu">
                  <ul>
                    <li>
                      <a href="javascript:void(0)" class="edit-btn"> Edit </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" class="delete-btn" ">
                        Delete
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </td>
              `;
      row.querySelector(".name").addEventListener("click", () => {
        onClickName(employee.employeeId);
      });
      row
        .querySelector(".row-check")
        .addEventListener("click", onChangeRowCheck);

      row.querySelector(".edit-btn").addEventListener("click", (e) => {
        editEmployee(employee.employeeId);
      });
      row.querySelector(".delete-btn").addEventListener("click", (e) => {
        onClickDelete(employee.employeeId);
      });
      row
        .querySelector(".action-btn")
        .addEventListener("click", onClickActionButton);
      tableBody.appendChild(row);
    } catch (e) {
      console.log(e, employee);
    }
  });
  renderPagination();
}

/*
<li>
            <a
              id="page-1"
              data-num="1"
              class="page-number hover-btn active"
              href="javascript:void(0)"
              >1</a
            >
          </li>
          */

/**
 * Function to render pagination buttons
 */
function renderPagination() {
  const pagination = state.pagination;
  const totalPages = pagination.lastPage;
  pageNumbers.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageNumber = document.createElement("li");
    if (i === pagination.pageNumber) {
      pageNumber.innerHTML = `<a id="page-${i}" data-num="${i}" class="page-number hover-btn active" href="javascript:void(0)">${i}</a>`;
    } else {
      pageNumber.innerHTML = `<a id="page-${i}" data-num="${i}" class="page-number hover-btn" href="javascript:void(0)">${i}</a>`;
    }
    pageNumber.querySelector("a").addEventListener("click", onClickPageNumber);
    pageNumbers.appendChild(pageNumber);
  }
}

/**
 * Function to close popup
 */
function closePopup() {
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.classList.remove("show-popup");
  });
}

/**
 * Function to toggle edit popup
 */
function toggleEditPopup() {
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.classList.toggle("view-popup");
    popup.classList.toggle("edit-popup");
  });
}

/**
 * Function to set employee data to form
 * @param {object} employee employee object
 */
function setFormData(employee) {
  resetFormOptions();
  const form = document.querySelector("#emp-form");
  form.querySelector("#name").value = employee.name;
  form.querySelector("#email").value = employee.email;
  form.querySelector("#dob").value = employee.dateOfBirth;
  form.querySelector("#joining-date").value = employee.joiningDate;
  form.querySelector("#salary").value = employee.salary;
  form.querySelector("#designation").value = employee.designation;
  form.querySelector("#employee-id").value = employee.employeeId;
  employee.department && setDepartmentInput(employee.department);
}

/**
 * Function to get employee data from form
 */
function getFormData() {
  const form = document.querySelector("#emp-form");
  return {
    name: form.querySelector("#name").value,
    email: form.querySelector("#email").value,
    dateOfBirth: form.querySelector("#dob").value,
    joiningDate: form.querySelector("#joining-date").value,
    salary: form.querySelector("#salary").value,
    designation: form.querySelector("#designation").value,
    department: {
      departmentId: form.querySelector("#department").dataset.id,
      department: form.querySelector("#department").value,
    },
    employeeId: form.querySelector("#employee-id").value,
    skills: [],
  };
}

/**
 * Function to set dropdown options of department
 */
function setDepartmentOptions(departments) {
  const departmentOptions = document.querySelector("#department-options");
  departmentOptions.innerHTML = "";
  departments.forEach((departmentItem) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<a href="javascript:void(0)" data-id="${departmentItem.departmentId}">${departmentItem.department}</a>`;
    listItem.addEventListener("click", (e) =>
      setDepartmentInput(departmentItem)
    );
    departmentOptions.appendChild(listItem);
  });
}

/**
 * Function to set department input
 */
function setDepartmentInput(department) {
  const departmentInput = document.querySelector("#department");
  departmentInput.value = department.department;
  departmentInput.dataset.id = department.departmentId;
  // set department options
  const searchTerm = department.department.trim().toLowerCase();
  let departments = getAllDepartments();
  departments = departments.filter((departmentItem) =>
    departmentItem.department.toLowerCase().includes(searchTerm)
  );
  setDepartmentOptions(departments);
}

/**
 * Function to reset form options
 */
function resetFormOptions() {
  const departmentOptions = document.querySelector("#department-options");
  const departments = getAllDepartments();
  setDepartmentOptions(departments);
}

/**
 * Function to goto a page
 */
function gotoPage(pageNumber) {
  state.pagination.pageNumber = pageNumber;
  const activePageElement = document.querySelector(".page-number.active");
  activePageElement.classList.remove("active");
  const pageElement = document.querySelector(`#page-${pageNumber}`);
  pageElement.classList.add("active");
  renderTable();
}

export {
  renderTable,
  closePopup,
  setFormData,
  getFormData,
  setDepartmentOptions,
  setDepartmentInput,
  toggleEditPopup,
  gotoPage,
};
