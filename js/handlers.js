import {
  setEmployee,
  getNextEmployeeId,
  getEmployee,
  getAllSkills,
  getAllDepartments,
  getAllEmployees,
  deleteEmployee,
  createNewSkill,
} from "./data.js";
import { state } from "./context.js";
import {
  renderTable,
  closePopup,
  setFormData,
  setDepartmentOptions,
  setDepartmentInput,
  getFormData,
  gotoPage,
  setSkillsOptions,
  setSkillsFilterOptions,
  removeSkillFilter,
  addSkillFilter,
  setSkillsFilterSelected,
  clearFormError,
  getSkillsFromInput,
  clearSkillInput,
  selectSkill,
  showToast,
} from "./controller.js";

const table = document.querySelector(".emp-table");
const tableBody = table.querySelector("tbody");
const columnTitles = table.querySelectorAll(".column-title");

/**
 * Function to trigger on click of column title
 */
function onClickColumnTitle(event) {
  const clickedTitle = event.currentTarget;
  const key = clickedTitle.dataset.key;
  if (key === "skills") {
    return;
  }

  const isAsc = clickedTitle.classList.contains("asc");
  const isDesc = clickedTitle.classList.contains("desc");
  state.sort.key = key;
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
  gotoPage(1);
}

/**
 * Function to trigger on change of search input
 */
function onChangeSearchInput(event) {
  event.preventDefault();
  const searchInput = event.currentTarget;
  state.searchTerm = searchInput.value.trim().toLowerCase();
  gotoPage(1);
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

function onClickName(id) {
  const employee = getEmployee(id);
  setFormData(employee);
  // show view popup
  document.querySelector(".popup").classList = "popup show-popup view-popup";
}

/**
 * Function to trigger on click delete employee
 * @param {string} id employee id
 */
function onClickDelete(id) {
  const employee = getEmployee(id);
  // show delete confirmation popup
  const confirmationPopup = document.querySelector(".confirmation-popup");
  confirmationPopup.classList = "confirmation-popup popup show-popup delete";
  const confirmationMessage = confirmationPopup.querySelector(
    ".confirmation-message"
  );
  confirmationMessage.innerHTML = `Are you sure you want to delete <strong>${employee.name}</strong>?`;
  confirmationPopup.dataset.id = id;
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
  let employee = getFormData();
  if (!employee) {
    return;
  }
  const status = setEmployee(employee);
  const popup = document.querySelector(".popup");
  if (popup.classList.contains("from-view-popup")) {
    popup.classList = "popup show-popup view-popup";
  } else {
    closePopup();
  }
  renderTable();
  if (status === "new") {
    showToast("Employee created successfully", false, 1800);
  } else if (status === "updated") {
    showToast("Employee updated successfully", false, 1800);
  }
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

/**
 * Function to trigger on change of skills input
 */
function onChangeSkillsInput(event) {
  const skillsInput = event.currentTarget;
  skillsInput.size = skillsInput.value.length + 1;
  const searchTerm = skillsInput.value.trim().toLowerCase();
  let skills = getAllSkills();
  const selectedSkills = getSkillsFromInput().map((skill) =>
    parseInt(skill.skillId)
  );
  skills = skills.filter(
    (skillItem) =>
      skillItem.skill.toLowerCase().includes(searchTerm) &&
      !selectedSkills.includes(skillItem.skillId)
  );
  skills.sort(
    (a, b) =>
      a.skill.toLowerCase().indexOf(searchTerm) -
        b.skill.toLowerCase().indexOf(searchTerm) ||
      a.skill.length - b.skill.length
  );
  setSkillsOptions(skills);
}

/**
 * Function to handle keydown event on skills input
 * @param {Event} e keydown event
 */
export function onKeyDownSkillsInput(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const skillInput = document.querySelector("#skill-input");
    const skillsInput = e.currentTarget;
    const skillName = skillsInput.value.trim();
    if (skillName) {
      const skillId = createNewSkill(skillName);
      selectSkill(skillId);
    }
  }
}

/**
 * Function to trigger on click action button
 */
function onClickActionButton(event) {
  const actionButton = event.currentTarget;
  const actionMenu = actionButton.parentElement;
  const isActive = actionMenu.classList.contains("active");
  if (isActive) {
    actionMenu.classList.remove("active");
    state.activeMenu = undefined;
  } else {
    if (state.activeMenu) {
      state.activeMenu.classList.remove("active");
    }
    actionMenu.classList.add("active");
    state.activeMenu = actionMenu;
  }
}

/**
 * Function to trigger on click of document
 */
function onClickDocument(event) {
  if (state.activeMenu === undefined) {
    return;
  }
  const clickedElement = event.target;
  const isActive = state.activeMenu.contains(clickedElement);
  if (isActive) {
    return;
  }
  state.activeMenu.classList.remove("active");
  state.activeMenu = undefined;
}

/**
 * On click yes of confirmation popup
 */
function onClickYes(e) {
  const confirmationPopup = document.querySelector(".confirmation-popup");
  const employeeId = confirmationPopup.dataset.id;
  deleteEmployee(employeeId);
  showToast("Employee deleted successfully", false, 1800);
  closePopup();
  renderTable();
}

/**
 * On click no of confirmation popup
 */
function onClickNo(e) {
  closePopup();
}

/**
 * on click of page next
 */
function onClickPageNext(e) {
  const currentPageNumber = state.pagination.pageNumber;
  const lastPageNumber = state.pagination.lastPage;
  if (currentPageNumber === lastPageNumber) {
    return;
  }
  const nextPageNumber = currentPageNumber + 1;
  gotoPage(nextPageNumber);
}

/**
 * on click of page previous
 */
function onClickPagePrevious(e) {
  const currentPageNumber = state.pagination.pageNumber;
  if (currentPageNumber === 1) {
    return;
  }
  const previousPageNumber = currentPageNumber - 1;
  gotoPage(previousPageNumber);
}

/**
 * on click of page first
 */
function onClickPageFirst(e) {
  const currentPageNumber = state.pagination.pageNumber;
  if (currentPageNumber === 1) {
    return;
  }
  gotoPage(1);
}

/**
 * on click of page last
 */
function onClickPageLast(e) {
  const currentPageNumber = state.pagination.pageNumber;
  const lastPageNumber = state.pagination.lastPage;
  if (currentPageNumber === lastPageNumber) {
    return;
  }
  gotoPage(lastPageNumber);
}

/**
 * on click of page number
 */
function onClickPageNumber(e) {
  const clickedPageElement = e.currentTarget;
  const clickedPageNumber = parseInt(clickedPageElement.dataset.num);
  gotoPage(clickedPageNumber);
}

/**
 * Function to trigger on click of skill close button
 */
function onClickSkillClose(e) {
  e.stopPropagation();
  const skillsInput = document.querySelector("#skills");
  const chipElement = e.target.parentNode;
  skillsInput.removeChild(chipElement);
}

/**
 * Function to trigger on click of skills container
 */
function onClickSkillsContainer(e) {
  const skillInput = document.querySelector("#skill-input");
  skillInput.focus();
}

/**
 * Function to trigger on click of filter button
 */
function onClickFilterButton(e) {
  const filterButton = e.currentTarget;
  const filterMenu = filterButton.parentElement;
  const isActive = filterMenu.classList.contains("active");
  if (isActive) {
    filterMenu.classList.remove("active");
    state.activeMenu = undefined;
  } else {
    if (state.activeMenu) {
      state.activeMenu.classList.remove("active");
    }
    filterMenu.classList.add("active");
    state.activeMenu = filterMenu;
    setSkillsFilterOptions();
  }
}

/**
 * Function to trigger on change of filter search
 */
function onChangeFilterSearch(e) {
  state.filterSearchTerms.skills = e.currentTarget.value.trim().toLowerCase();
  setSkillsFilterOptions();
}

/**
 * Function to trigger on click of filter option
 */
function onClickFilterOption(e) {
  e.stopPropagation();
  const skillId = parseInt(e.currentTarget.dataset.id);
  const isActive = state.filters.skills.includes(skillId);
  if (isActive) {
    removeSkillFilter(skillId);
  } else {
    addSkillFilter(skillId);
  }
}

/**
 * Function to trigger on click of clear filters
 */
function onClickClearFilters(e) {
  state.filters.skills = [];
  setSkillsFilterOptions();
  setSkillsFilterSelected();
  gotoPage(1);
}

/**
 * Function to trigger on change form input
 */
function onChangeFormInput(e) {
  const name = e.currentTarget.name;
  clearFormError(name);
}

/**
 * Function to trigger on click of edit button
 */
function onClickEditButton(e) {
  document.querySelector(".popup").classList =
    "popup show-popup edit-popup from-view-popup";
}

/**
 * Function to trigger on click of cancel button
 */
function onClickCancelButton(e) {
  document.querySelector(".popup").classList = "popup show-popup view-popup";
}

/**
 * Function to trigger on click of close toast
 */
function onClickCloseToast(e) {
  const toastContainer = document.querySelector(".toast-container");
  const toast = e.currentTarget.parentElement;
  toast.classList.remove("show");
  setTimeout(() => {
    toastContainer.removeChild(toast);
  }, 300);
}

export {
  onClickCloseToast,
  onClickColumnTitle,
  onChangeSearchInput,
  onClickAllCheck,
  onChangeRowCheck,
  editEmployee,
  onClickAddEmployee,
  onClickSave,
  onChangeDepartmentInput,
  onChangeSkillsInput,
  onClickDelete,
  onClickActionButton,
  onClickDocument,
  onClickYes,
  onClickNo,
  onClickName,
  onClickPageNext,
  onClickPagePrevious,
  onClickPageFirst,
  onClickPageLast,
  onClickPageNumber,
  onClickSkillClose,
  onClickSkillsContainer,
  onClickFilterButton,
  onChangeFilterSearch,
  onClickFilterOption,
  onClickClearFilters,
  onChangeFormInput,
  onClickEditButton,
  onClickCancelButton,
};
