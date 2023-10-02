import { loadData, loadSampleData } from "./data.js";
import {
  onClickColumnTitle,
  onClickFilterButton,
  onChangeSearchInput,
  onClickAllCheck,
  onClickAddEmployee,
  onClickSave,
} from "./handlers.js";
import { renderTable, closePopup } from "./controller.js";

const table = document.querySelector(".emp-table");
const tableHeader = table.querySelector(".header-row");
const columnTitles = tableHeader.querySelectorAll(".column-title");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.querySelector(".search-input");
const allCheck = document.querySelector(".all-check");
const popup = document.querySelector(".popup");
const closePopupButton = document.querySelector(".close-popup");
const addEmployeeButton = document.querySelector(".add-employee");
const saveButton = document.querySelector("#save-button");

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

saveButton.addEventListener("click", onClickSave);

/**
 * Function to load employees from local storage or API
 */
async function loadEmployees() {
  const employees = loadData();
  if (employees === undefined || employees === null) {
    await loadSampleData();
  }
  renderTable();
}

loadEmployees();
