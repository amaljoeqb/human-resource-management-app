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
    }

    const alphaNumericSort = (a, b) => {
        if (asc) {
            return a[key].localeCompare(b[key]);
        } else {
            return b[key].localeCompare(a[key]);
        }
    }

    const dateSort = (a, b) => {
        if (asc) {
            return new Date(a[key]) - new Date(b[key]);
        } else {
            return new Date(b[key]) - new Date(a[key]);
        }
    }

    switch (key) {
        case 'employeeId':
        case 'salary':
            return employees.sort(numericalSort);
        case 'name':
        case 'email':
        case 'designation':
        case 'department':
            return employees.sort(alphaNumericSort);
        case 'dateOfBirth':
        case 'joiningDate':
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
        return employees.filter(employee => employee[key].toLowerCase().includes(lowerCaseValue));
    } catch (e) {
        return employees;
    }
}

/**
 * Fuction to search employees array based on a search term
 * @param {array} employees - Array of employees
 * @param {string} searchTerm - Term to search for
 */
function searchEmployees(employees, searchTerm) {
    try {
        const lowerCaseValue = searchTerm.toLowerCase();
        return employees.filter(employee => Object.values(employee)
            .some((value) => typeof value === "string" && value.toLowerCase().includes(lowerCaseValue)));
    } catch (e) {
        return [];
    }
}

const empData = {
    "employees": {
        "employee1": {
            "employeeId": 1,
            "name": "John Smith",
            "email": "john.smith@mycompany.com",
            "designation": "Software Engineer",
            "department": "Development",
            "skills": [
                "HTML",
                "CSS",
                "JavaScript",
                "ReactJS",
                "Node",
                "Express",
                "MongoDB"
            ],
            "dateOfBirth": "01/01/1990",
            "joiningDate": "01/01/2020",
            "salary": 60000
        },
        "employee2": {
            "employeeId": 2,
            "name": "Jane Doe",
            "email": "jane.doe@mycompany.com",
            "designation": "UI/UX Designer",
            "department": "Design",
            "skills": [
                "Sketch",
                "Figma",
                "Adobe Photoshop",
                "Adobe Illustrator",
                "HTML",
                "CSS",
                "JavaScript"
            ],
            "dateOfBirth": "02/02/1991",
            "joiningDate": "02/02/2021",
            "salary": 55000
        },
        "employee3": {
            "employeeId": 3,
            "name": "David Lee",
            "email": "david.lee@mycompany.com",
            "designation": "Data Analyst",
            "department": "Analytics",
            "skills": [
                "Python",
                "R",
                "SQL",
                "Tableau",
                "Excel"
            ],
            "dateOfBirth": "03/03/1992",
            "joiningDate": "03/03/2022",
            "salary": 65000
        },
        "employee4": {
            "employeeId": 4,
            "name": "Emily Chen",
            "email": "emily.chen@mycompany.com",
            "designation": "Product Manager",
            "department": "Product",
            "skills": [
                "Agile",
                "Scrum",
                "Jira",
                "Confluence",
                "Market Research"
            ],
            "dateOfBirth": "04/04/1993",
            "joiningDate": "04/04/2023",
            "salary": 70000
        },
        "employee5": {
            "employeeId": 5,
            "name": "Michael Kim",
            "email": "michael.kim@mycompany.com",
            "designation": "DevOps Engineer",
            "department": "Operations",
            "skills": [
                "AWS",
                "Docker",
                "Kubernetes",
                "Jenkins",
                "Linux"
            ],
            "dateOfBirth": "05/05/1994",
            "joiningDate": "05/05/2024",
            "salary": 75000
        },
        "employee6": {
            "employeeId": 6,
            "name": "Samantha Lee",
            "email": "samantha.lee@mycompany.com",
            "designation": "Full Stack Developer",
            "department": "Development",
            "skills": [
                "HTML",
                "CSS",
                "JavaScript",
                "ReactJS",
                "Node",
                "Express",
                "MongoDB",
                "Python",
                "Django"
            ],
            "dateOfBirth": "06/06/1995",
            "joiningDate": "06/06/2025",
            "salary": 80000
        },
        "employee7": {
            "employeeId": 7,
            "name": "Daniel Kim",
            "email": "daniel.kim@mycompany.com",
            "designation": "Mobile Developer",
            "department": "Development",
            "skills": [
                "Swift",
                "Java",
                "Kotlin",
                "React Native",
                "Firebase"
            ],
            "dateOfBirth": "07/07/1996",
            "joiningDate": "07/07/2026",
            "salary": 85000
        },
        "employee8": {
            "employeeId": 8,
            "name": "Olivia Chen",
            "email": "olivia.chen@mycompany.com",
            "designation": "Frontend Developer",
            "department": "Development",
            "skills": [
                "HTML",
                "CSS",
                "JavaScript",
                "ReactJS",
                "VueJS"
            ],
            "dateOfBirth": "08/08/1997",
            "joiningDate": "08/08/2027",
            "salary": 90000
        },
        "employee9": {
            "employeeId": 9,
            "name": "William Lee",
            "email": "william.lee@mycompany.com",
            "designation": "Backend Developer",
            "department": "Development",
            "skills": [
                "Java",
                "Spring",
                "Python",
                "Django",
                "Node",
                "Express",
                "MongoDB"
            ],
            "dateOfBirth": "09/09/1998",
            "joiningDate": "09/09/2028",
            "salary": 95000
        },
        "employee10": {
            "employeeId": 10,
            "name": "Sophia Kim",
            "email": "sophia.kim@mycompany.com",
            "designation": "Data Scientist",
            "department": "Analytics",
            "skills": [
                "Python",
                "R",
                "SQL",
                "Tableau",
                "Machine Learning"
            ],
            "dateOfBirth": "10/10/1999",
            "joiningDate": "10/10/2029",
            "salary": 100000
        }
    }
};

export { sortEmployees, filterEmployees, searchEmployees };