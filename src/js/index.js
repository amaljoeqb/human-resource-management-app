import { getAllDepartments, loadData, loadSampleData } from "./data.js";
import {
  onClickColumnTitle,
  onClickFilterButton,
  onChangeSearchInput,
  onClickAllCheck,
  onClickAddEmployee,
  onClickSave,
  onChangeDepartmentInput,
  onClickDocument,
  onClickYes,
  onClickNo,
  onClickPageNext,
  onClickPagePrevious,
  onClickPageFirst,
  onClickPageLast,
  onClickPageNumber,
  onChangeSkillsInput,
  onClickSkillsContainer,
} from "./handlers.js";
import { renderTable, closePopup, setDepartmentOptions } from "./controller.js";

const table = document.querySelector(".emp-table");
const tableHeader = table.querySelector(".header-row");
const columnTitles = tableHeader.querySelectorAll(".column-title");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.querySelector(".search-input");
const allCheck = document.querySelector(".all-check");
const popups = document.querySelectorAll(".popup");
const closePopupButtons = document.querySelectorAll(".close-popup");
const addEmployeeButton = document.querySelector(".add-btn");
const saveButton = document.querySelector("#save-button");
const departmentInput = document.querySelector("#department");
const confirmButton = document.querySelector(".confirm");
const cancelButton = document.querySelector(".cancel");
const pageNumbers = document.querySelectorAll(".page-number");
const pageNext = document.querySelector(".page-next");
const pagePrevious = document.querySelector(".page-previous");
const pageFirst = document.querySelector(".page-first");
const pageLast = document.querySelector(".page-last");
const skillsInputContainer = document.querySelector(".skills-input-container");
const skillInput = document.querySelector(".skill-input");

addEmployeeButton.addEventListener("click", onClickAddEmployee);

closePopupButtons.forEach((closePopupButton) => {
  closePopupButton.addEventListener("click", closePopup);
});

popups.forEach((popup) => {
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });
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

departmentInput.addEventListener("input", onChangeDepartmentInput);
skillInput.addEventListener("input", onChangeSkillsInput);

confirmButton.addEventListener("click", onClickYes);
cancelButton.addEventListener("click", onClickNo);

pageNumbers.forEach((pageNumber) => {
  pageNumber.addEventListener("click", onClickPageNumber);
});

pageNext.addEventListener("click", onClickPageNext);
pagePrevious.addEventListener("click", onClickPagePrevious);
pageFirst.addEventListener("click", onClickPageFirst);
pageLast.addEventListener("click", onClickPageLast);

document.addEventListener("click", onClickDocument);

/**
 * Function to load employees from local storage or API
 */
async function loadEmployees() {
  try {
    const employees = await loadData();
    if (employees === undefined || employees === null) {
      await loadSampleData();
    }
    renderTable();
  } catch (e) {
    // TODO: alert error
    console.error(e);
  }
}

skillsInputContainer.addEventListener("click", onClickSkillsContainer);

loadEmployees();
