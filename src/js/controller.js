import { highlightSearchTerm, getRupeesFormat } from "./helpers.js";
import { sortEmployees, searchEmployees, getAllDepartments } from "./data.js";
import { onChangeRowCheck, editEmployee } from "./handlers.js";
import { state } from "./context.js";

const table = document.querySelector(".emp-table");
const tableBody = table.querySelector("tbody");

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
              `;
      row.querySelector(".name").addEventListener("click", () => {
        editEmployee(employee.employeeId);
      });
      row
        .querySelector(".row-check")
        .addEventListener("click", onChangeRowCheck);
      tableBody.appendChild(row);
    } catch (e) {
      console.log(e, employee);
    }
  });
}

/**
 * Function to close popup
 */
function closePopup() {
  document.querySelector(".popup").classList.remove("show-popup");
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
    department: form.querySelector("#department").value,
    employeeId: form.querySelector("#employee-id").value,
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

export {
  renderTable,
  closePopup,
  setFormData,
  getFormData,
  setDepartmentOptions,
  setDepartmentInput,
};
