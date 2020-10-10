const startPrompt = {
    name: 'options',
    type: 'list',
    message: 'Please select an option to continue',
    choices: [
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'View Departments',
        'View a Role',
        'View an Employee',
        'Update an Employee\'s Role',
        'Update an Employee\'s Manager',
        'Delete a Department',
        'Delete a Role',
        'Delete an Employee',
        'View Department\'s salary budget',
        'Exit menu'
      ]
};
 
   const addDeptPrompt = {
    type: 'input',
            name: 'department',
            message: 'Which department would you like to add?'
};
 
   const addRolePrompt = [
    {
        name: 'title',
        type: 'input',
        message: 'What is the title of the role you are adding?'
    },
    {
        name: 'salary',
        type: 'input',
        message: 'What is the proposed salary for this role?'
    },
    {
        name: 'department_id',
        type: 'input',
        message: 'What is the department ID of the role?'
    }
];
 
   const addEmployeePrompt = [
    {
      name: 'first',
      type: 'input',
      message: "What is the employee's first name?"
    },
    {
      name: 'last',
      type: 'input',
      message: "What is the employee's last name?"
    }
  ];
 
   module.exports = {
    startPrompt,
    addDeptPrompt,
    addRolePrompt,
    addEmployeePrompt,
  };
