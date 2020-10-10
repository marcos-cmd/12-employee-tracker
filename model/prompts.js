const inquirer = require("inquirer");

function isNotBlank(input) {
    return input !== '' || "Cannot leave blank";
}

const startPrompt = {
    name: 'options',
    type: 'list',
    message: 'Please select an option to continue',
    choices: [new inquirer.Separator(),
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        new inquirer.Separator(),
        'View Departments',
        'View a Role',
        'View an Employee',
        'View Employees by Manager',
        'View Department\'s salary budget',
        new inquirer.Separator(),
        'Update an Employee\'s Role',
        'Update an Employee\'s Manager',
        new inquirer.Separator(),
        'Delete a Department',
        'Delete a Role',
        'Delete an Employee',
        new inquirer.Separator(),
        'Exit menu'
      ]
};
 
   const addDeptPrompt = {
    type: 'input',
            name: 'department',
            message: 'Which department would you like to add?',
            validate: isNotBlank
};
 
   const addRolePrompt = [
    {
        name: 'title',
        type: 'input',
        message: 'What is the title of the role you are adding?',
        validate: isNotBlank
    },
    {
        name: 'salary',
        type: 'input',
        message: 'What is the proposed salary for this role?',
        validate: isNotBlank
    },
    {
        name: 'department_id',
        type: 'input',
        message: 'What is the department ID of the role?',
        validate: isNotBlank
    }
];
 
   const addEmployeePrompt = [
    {
        name: 'first',
        type: 'input',
        message: "Enter the employee's first name",
        validate: isNotBlank
    },
    {
        name: 'last',
        type: 'input',
        message: "Enter the employee's last name",
        validate: isNotBlank
    },
];
 
   module.exports = {
    startPrompt,
    addDeptPrompt,
    addRolePrompt,
    addEmployeePrompt,
  };
