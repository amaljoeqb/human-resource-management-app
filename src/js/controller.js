import {
  highlightSearchTerm,
  getRupeesFormat,
  transformSkills,
} from "./helpers.js";
import {
  sortEmployees,
  searchEmployees,
  getAllDepartments,
  getAllEmployees,
  getAllSkills,
} from "./data.js";
import {
  onChangeRowCheck,
  editEmployee,
  onClickDelete,
  onClickActionButton,
  onClickName,
  onClickPageNumber,
  onClickSkillClose,
  onClickFilterOption,
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
  filteredEmployees = filteredEmployees.filter((employee) => {
    return employee.skills.find((skill) => {
      return (
        state.filters.skills.length === 0 ||
        state.filters.skills.includes(parseInt(skill.skillId))
      );
    });
  });
  filteredEmployees = sortEmployees(
    filteredEmployees,
    state.sort.key,
    state.sort.asc
  );
  const pagination = state.pagination;
  const start = (pagination.pageNumber - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  pagination.lastPage =
    Math.ceil(filteredEmployees.length / pagination.pageSize) || 1;
  if (pagination.pageNumber > pagination.lastPage) {
    gotoPage(pagination.lastPage);
    return;
  }
  filteredEmployees = filteredEmployees.slice(start, end);
  tableBody.innerHTML = "";
  if (filteredEmployees.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
     <tr>
     <td colspan="7" class="no-data">No data</td>
      </tr>
    `;
    tableBody.appendChild(row);
  }
  filteredEmployees.forEach((employee) => {
    try {
      const row = document.createElement("tr");
      row.classList.add("emp-row");
      row.innerHTML = `
                  <td class="check-cell"><input type="checkbox" class="row-check"></td>
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
                  <td class="skills-cell">${transformSkills(
                    employee.skills
                  )}</td>
                  <td class="overflow">
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
  if (employee.skills) {
    setSkillsInput(employee.skills);
    const selectedSkills = employee.skills.map((skill) =>
      parseInt(skill.skillId)
    );
    let skills = getAllSkills();
    skills = skills.filter(
      (skillItem) => !selectedSkills.includes(skillItem.skillId)
    );
    setSkillsOptions(skills);
  }
}

/**
 * Function to get employee data from form
 */
function getFormData() {
  const form = document.querySelector("#emp-form");
  const employee = {
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
    skills: getSkillsFromInput(),
  };
  if (validateEmployeeForm(employee)) {
    return employee;
  } else {
    return undefined;
  }
}

/**
 * Function to validate employee form
 * @param {object} employee - Form data
 */
function validateEmployeeForm(employee) {
  let noError = true;

  // name validation
  if (!employee.name) {
    setFormError("name", "Name is required");
    noError = false;
  }

  // email validation
  if (!employee.email) {
    setFormError("email", "Email is required");
    noError = false;
  } else if (!employee.email.includes("@")) {
    setFormError("email", "Email is invalid");
    noError = false;
  }

  // salary validation
  if (!employee.salary) {
    setFormError("salary", "Salary is required");
    noError = false;
  }

  // designation validation
  if (!employee.designation) {
    setFormError("designation", "Designation is required");
    noError = false;
  }

  // department validation
  if (!employee.department || !employee.department.department) {
    setFormError("department", "Department is required");
    noError = false;
  } else {
    const departments = getAllDepartments();
    const department = departments.find(
      (department) =>
        department.departmentId == employee.department.departmentId
    );
    if (
      !department ||
      department.department !== employee.department.department
    ) {
      setFormError("department", "Department is invalid");
      noError = false;
    }
  }

  // dob validation
  if (!employee.dateOfBirth) {
    setFormError("dob", "Date of birth is required");
    noError = false;
  } else if (new Date(employee.dateOfBirth) > new Date()) {
    setFormError("dob", "Date of birth must be in the past");
    noError = false;
  }
  // joining date validation
  if (!employee.joiningDate) {
    setFormError("joining-date", "Joining date is required");
    noError = false;
  } else if (new Date(employee.joiningDate) < new Date(employee.dateOfBirth)) {
    setFormError("joining-date", "Joining date must be after date of birth");
    noError = false;
  }

  // skills validation
  if (!employee.skills || employee.skills.length === 0) {
    setFormError("skills", "Skills are required");
    noError = false;
  }
  return noError;
}

/**
 * Function to get skills from skills input
 */
function getSkillsFromInput() {
  const skillsInput = document.querySelector("#skills");
  const skills = [];
  skillsInput.querySelectorAll(".chip").forEach((chip) => {
    skills.push({
      skillId: chip.dataset.id,
      skill: chip.querySelector("p").innerText,
    });
  });
  return skills;
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
    listItem.addEventListener("click", (e) => {
      setDepartmentInput(departmentItem);
      clearFormError("department");
    });
    departmentOptions.appendChild(listItem);
  });
}

/**
 * Function to set skills options
 */
function setSkillsOptions(skills) {
  const skillInput = document.querySelector("#skill-input");
  const skillsOptions = document.querySelector("#skills-options");
  skillsOptions.innerHTML = "";
  skills.forEach((skill) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<a href="javascript:void(0)" data-id="${skill.skillId}">${skill.skill}</a>`;
    listItem.addEventListener("click", (e) => {
      selectSkill(skill.skillId);
    });
    skillsOptions.appendChild(listItem);
  });
}

function selectSkill(skillId) {
  const skillInput = document.querySelector("#skill-input");
  let skills = getAllSkills();
  const skill = skills.find((skill) => skill.skillId == skillId);
  if (!skill) {
    return;
  }
  addSkill(skill);
  clearSkillInput();
  skillInput.focus();
  const selectedSkills = getSkillsFromInput().map((skill) =>
    parseInt(skill.skillId)
  );
  skills = skills.filter(
    (skillItem) => !selectedSkills.includes(skillItem.skillId)
  );
  setSkillsOptions(skills);
  clearFormError("skills");
}

/**
 * Function to clear skill input
 */
function clearSkillInput() {
  const skillInput = document.querySelector("#skill-input");
  skillInput.value = "";
  skillInput.size = skillInput.value.length + 1;
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
 * Function to set skills input
 */
function setSkillsInput(skills) {
  const skillsInput = document.querySelector("#skills");
  skillsInput.innerHTML = "";
  skills.forEach((skill) => {
    addSkill(skill);
  });
}

/**
 * Function to add a skill to skills input
 */
function addSkill(skill) {
  const skillsInput = document.querySelector("#skills");
  if (skillsInput.querySelector(`.chip[data-id="${skill.skillId}"]`)) {
    return;
  }
  const chipElement = document.createElement("span");
  chipElement.classList.add("chip");
  chipElement.dataset.id = skill.skillId;
  chipElement.innerHTML = `
  <p>${skill.skill}</p>
  <span class="material-symbols-outlined close-chip">
    close
  </span>`;
  chipElement
    .querySelector(".close-chip")
    .addEventListener("click", onClickSkillClose);
  skillsInput.appendChild(chipElement);
}

/**
 * Function to reset form options and errors
 */
function resetFormOptions() {
  const departments = getAllDepartments();
  setDepartmentOptions(departments);
  const skills = getAllSkills();
  setSkillsOptions(skills);
  clearSkillInput();
  Object.keys(state.formErrors).forEach((name) => {
    if (state.formErrors[name]) {
      clearFormError(name);
    }
  });
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
/**
 * Function to set skills filter options
 */
function setSkillsFilterOptions() {
  const skills = getAllSkills();
  const skillsFilterOptions = document.querySelector(
    "#skills-filter .filtered-items"
  );
  const searchTerm = state.filterSearchTerms.skills;
  const options = skills
    .filter((skill) => {
      return skill.skill.toLowerCase().includes(searchTerm);
    })
    .map((skill) => {
      return {
        id: skill.skillId,
        name: skill.skill,
        count: getAllEmployees().filter((employee) => {
          return employee.skills.find((skillItem) => {
            return skillItem.skillId == skill.skillId;
          });
        }).length,
        checked: state.filters.skills.includes(skill.skillId),
      };
    })
    .sort((a, b) => b.count - a.count);
  setFilterOptions(skillsFilterOptions, options);
}

/**
 * Function to set skills filter selected
 */
function setSkillsFilterSelected() {
  const skills = getAllSkills();
  const skillsFilterSelected = document.querySelector(
    "#skills-filter .selected-items"
  );
  const selections = skills
    .filter((skill) => {
      return state.filters.skills.includes(skill.skillId);
    })
    .map((skill) => {
      return {
        id: skill.skillId,
        name: skill.skill,
      };
    });
  setFilterSelected(skillsFilterSelected, selections);
}

function setFilterSelected(itemsContainer, selections) {
  itemsContainer.innerHTML = "";
  selections.forEach((selection) => {
    const listItem = document.createElement("li");
    listItem.classList.add("selected-item");
    listItem.dataset.id = selection.id;
    listItem.innerHTML = `
      <p>${selection.name}</p>
      <span class="material-symbols-outlined">
        close
      </span>
    `;
    listItem.addEventListener("click", (e) => {
      removeSkillFilter(selection.id);
    });
    itemsContainer.appendChild(listItem);
  });
}

/**
 * Function to add skill filter
 * @param {string} skillId skill id
 */
function addSkillFilter(skillId) {
  state.filters.skills.push(skillId);
  setSkillsFilterSelected();
  setSkillsFilterOptions();
  gotoPage(1);
}

/**
 * Function to remove skill filter
 * @param {string} skillId skill id
 */
function removeSkillFilter(skillId) {
  state.filters.skills = state.filters.skills.filter(
    (skill) => skill !== skillId
  );
  setSkillsFilterSelected();
  setSkillsFilterOptions();
  gotoPage(1);
}

/**
 * Function to set filter options
 * @param {object} itemsContainer container of filter options
 * @param {array} options array of options containing id, name, count and checked status
 */
function setFilterOptions(itemsContainer, options) {
  itemsContainer.innerHTML = "";
  options.forEach((option) => {
    const listItem = document.createElement("li");
    listItem.classList.add("filtered-item");
    listItem.dataset.id = option.id;
    listItem.innerHTML = `
      <input class="check" type="checkbox" ${option.checked ? "checked" : ""} />
      <p class="name">${option.name}</p>
      <p class="count">${option.count}</p>
    `;
    listItem.addEventListener("click", onClickFilterOption);
    itemsContainer.appendChild(listItem);
  });
}

/**
 * Function to set error message of a form field
 * @param {string} name name of the form field
 * @param {*} error error message
 */
function setFormError(name, error) {
  const form = document.querySelector("#emp-form");
  const formField = form.querySelector(`#${name}-field`);
  const errorMsg = formField.querySelector(".error-msg");
  formField.classList.add("error");
  errorMsg.innerText = error;
  state.formErrors[name] = error;
}

/**
 * Function to clear error message of a form field
 * @param {string} name name of the form field
 */
function clearFormError(name) {
  if (!state.formErrors[name]) {
    return;
  }
  const form = document.querySelector("#emp-form");
  const formField = form.querySelector(`#${name}-field`);
  formField.classList.remove("error");
  state.formErrors[name] = undefined;
}

/**
 * Function to show a toast
 * @param {string} message message to show
 * @param {boolean} isError  error toast
 */
function showToast(message, isError) {
  const toast = document.querySelector(".toast");
  toast.querySelector("p").innerText = message;
  toast.classList.add("show");
  if (isError) {
    toast.classList.add("error");
  } else {
    toast.classList.remove("error");
  }
}

export {
  showToast,
  renderTable,
  closePopup,
  setFormData,
  getFormData,
  setDepartmentOptions,
  setDepartmentInput,
  toggleEditPopup,
  gotoPage,
  setSkillsOptions,
  setSkillsFilterOptions,
  getSkillsFromInput,
  setSkillsFilterSelected,
  addSkillFilter,
  removeSkillFilter,
  setFormError,
  clearFormError,
  clearSkillInput,
  selectSkill,
};
