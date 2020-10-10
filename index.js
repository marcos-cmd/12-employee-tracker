const inquirer = require('inquirer');
const connection = require('./config/connection');

const start = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'options',
            message: 'Please select an option to continue:',
            choices: 
            [
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'View a Department',
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
        }
    ).then((answers) => {
        console.log(answers);
        switch (answers.options) {
            case 'Add a Department':
              addDepartment();
              break;
            default:
              break;
        }
    })
};

const addDepartment = async () => {
    // console.log('test success');
    const answers = await inquirer.prompt(
        {
            type: 'input',
            name: 'department',
            message: 'Which department would you like to add?'
        }
    ).then(({name}) => {
            const query = 'INSERT INTO departments SET ?;';
            connection.query(query, {name}, err => {
                if (err) throw err;
            });
            viewDept();
        })
};

const addRole = () => {
    inquirer.prompt([
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
    ]).then (({title, salary, department_id}) => {
        const query = 'INSERT INTO roles SET ?;';
        connection.query(query, {title, salary, department_id}, err => {
            if (err) throw err;
        });
        viewRole();
    })
}

start();
