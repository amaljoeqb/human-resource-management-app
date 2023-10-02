import { highlightSearchTerm, getRupeesFormat } from "./helpers.js";
import { sortEmployees, searchEmployees } from "./data.js";
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
      row.innerHTML = `
                  <td><input type="checkbox" class="row-check"></td>
                  <td>${highlightSearchTerm(
                    employee.employeeId,
                    state.searchTerm
                  )}</td>
                  <td>${highlightSearchTerm(employee.name, state.searchTerm)}</td>
                  <td>${highlightSearchTerm(employee.email, state.searchTerm)}</td>
                  <td>${highlightSearchTerm(
                    employee.designation,
                    state.searchTerm
                  )}</td>
                  <td>${highlightSearchTerm(
                    employee.department,
                    state.searchTerm
                  )}</td>
                  <td>${highlightSearchTerm(employee.skills)}</td>
                  <td>${highlightSearchTerm(
                    employee.dateOfBirth,
                    state.searchTerm
                  )}</td>
                  <td>${highlightSearchTerm(
                    employee.joiningDate,
                    state.searchTerm
                  )}</td>
                  <td>${highlightSearchTerm(
                    getRupeesFormat(employee.salary),
                    state.searchTerm
                  )}</td>
              `;
      row.addEventListener("click", () => {
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

export { renderTable, closePopup };
