import { serverUri } from "./config.js";
import { getData, postData } from "./helpers.js";

let employees = [];
let skills = [];
let departments = [];

/**
 * Function to sort employees array based on an attribute
 * @param {array} employees - Array of employees
 * @param {string} key - Name of the attribute to sort
 * @param {boolean} asc - Order to sort the column (ascending/descending)
 */
function sortEmployees(employees, key, asc = true) {
  const numericalSort = (a, b) => {
    if (asc) {
      return a[key] - b[key];
    } else {
      return b[key] - a[key];
    }
  };

  const alphaNumericSort = (a, b) => {
    if (asc) {
      return a[key].localeCompare(b[key]);
    } else {
      return b[key].localeCompare(a[key]);
    }
  };

  const departmentSort = (a, b) => {
    if (asc) {
      return a[key].department.localeCompare(b[key].department);
    } else {
      return b[key].department.localeCompare(a[key].department);
    }
  };

  const dateSort = (a, b) => {
    if (asc) {
      return new Date(a[key]) - new Date(b[key]);
    } else {
      return new Date(b[key]) - new Date(a[key]);
    }
  };

  switch (key) {
    case "employeeId":
    case "salary":
      return employees.sort(numericalSort);
    case "name":
    case "email":
    case "designation":
      return employees.sort(alphaNumericSort);
    case "department":
      return employees.sort(departmentSort);
    case "dateOfBirth":
    case "joiningDate":
      return employees.sort(dateSort);
    default:
      return employees;
  }
}

/**
 * Fuction to filter employees array based on a attribute value
 * @param {array} employees - Array of employees
 * @param {string} key - Name of the attribute to filter
 * @param {string} value - Value of the attribute to filter
 */
function filterEmployees(employees, key, value) {
  try {
    const lowerCaseValue = value.toLowerCase();
    return employees.filter((employee) =>
      employee[key].toLowerCase().includes(lowerCaseValue)
    );
  } catch (e) {
    return employees;
  }
}

/**
 * Fuction to search employees array based on a search term
 * @param {array} employees - Array of employees
 * @param {string} searchTerm - Term to search for
 */
function searchEmployees(searchTerm) {
  try {
    const lowerCaseValue = searchTerm.toLowerCase();
    return Object.values(employees).filter((employee) =>
      Object.values(employee).some(
        (value) =>
          (typeof value === "string" || typeof value === "number") &&
          value.toString().toLowerCase().includes(lowerCaseValue)
      )
    );
  } catch (e) {
    return [];
  }
}

/**
 * Function to load data from local storage
 */
async function loadData() {
  try {
    employees = await getData(serverUri + "/employees");
    skills = JSON.parse(localStorage.getItem("skills"));
    if (skills === null) {
      skills = (await getData("assets/json/skills.json")).skills;
    }
    departments = (await getData("assets/json/departments.json")).departments;
    return employees;
  } catch {
    employees = [];
    skills = [];
    departments = [];
    throw new Error("Error loading data from local storage");
  }
}

/**
 * Function to get next employee ID
 */
function getNextEmployeeId() {
  const lastEmployeeId = employees
    .map((employee) => employee.employeeId)
    .sort((a, b) => a - b)
    .pop();
  return lastEmployeeId ? parseInt(lastEmployeeId) + 1 : 1;
}

/**
 * Function to get all employees
 */
function getAllEmployees() {
  return employees;
}

/**
 * Function to get employee by id
 * @param {string} id employee id
 */
function getEmployee(id) {
  return employees.find((employee) => employee.employeeId == id);
}

/**
 * Function to delete employee by id
 * @param {string} id employee id
 */
async function deleteEmployee(id) {
  try {
    await deleteData(serverUri + "/employees/" + id);
    employees = await getData(serverUri + "/employees");
  } catch (e) {
    console.log(e);
    throw new Error("Error deleting employee");
  }
}

/**
 * Function to set employee data
 * @returns {string} new/updated/nochange
 */
async function setEmployee(employee) {
  try {
    const {status} = await postData(serverUri + "/employees", employee);
    if (status !== "nochange") {
      employees = await getData(serverUri + "/employees");
    }
    return status;
  } catch (e) {
    console.log(e);
    throw new Error("Error saving employee data");
  }
}

/**
 * Function to get all skills
 */
function getAllSkills() {
  return skills;
}

/**
 * Function to create new skill
 * @param {string} skillName skill name
 */
export function createNewSkill(skillName) {
  if (!skillName) {
    return;
  }
  if (
    skills.find(
      (skill) => skill.skill.toLowerCase() === skillName.toLowerCase()
    )
  ) {
    return skills.find(
      (skill) => skill.skill.toLowerCase() === skillName.toLowerCase()
    ).skillId;
  }
  const lastId = skills
    .map((skill) => skill.skillId)
    .sort((a, b) => a - b)
    .pop();
  const newSkill = {
    skillId: parseInt(lastId) + 1,
    skill: skillName,
  };
  skills.push(newSkill);
  localStorage.setItem("skills", JSON.stringify(skills));
  return newSkill.skillId;
}

/**
 * Function to get all departments
 */
function getAllDepartments() {
  return departments;
}

export {
  sortEmployees,
  filterEmployees,
  searchEmployees,
  loadData,
  setEmployee,
  getNextEmployeeId,
  getAllEmployees,
  getEmployee,
  getAllSkills,
  getAllDepartments,
  deleteEmployee,
};
