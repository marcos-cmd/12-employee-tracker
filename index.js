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
        }
    ).then((answers) => {
        console.log(answers);
        switch (answers.options) {
            case 'Add a Department':
              addDepartment();
              break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'View Departments':
                viewDept();
                break;
            case 'View a Role':
                viewRole();
                break;
            case 'View an Employee':
                viewEmployee();
                break;
            case 'Update an Employee\'s Role':
                updateRole();
                break;
            case 'Update Employee Manager':
                updateManager();
                break;
            case 'Delete an Employee':
                deleteEmployee();
                break;
            case 'Delete a Department':
                deleteDept();
                break;
            case 'Delete a Role':
                deleteRole();
                break;
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
const addEmployee = () => {
    connection.query('SELECT * FROM roles;', (err, res) => {
        if (err) throw err;
        let rolesArr = [];
        for (let i=0; i < res.length; i++) {
            rolesArr.push(res[i]);
        }
        inquirer.prompt([
            {
                name: 'first',
                type: 'input',
                message: "Enter the employee's first name"
            },
            {
                name: 'last',
                type: 'input',
                message: "Enter the employee's last name"
            },
            {
                name: 'role',
                type: 'list', 
                message: "Enter the title of this employee's role",
                choices: function() {
                    return res.map(res => res.title);
                }
            }
        ]).then((res) => {
            let first_name = res.first;
            let last_name = res.last;
            let role_id;
            for (let i = 0; i < rolesArr.length; i++) {
                if (res.role === rolesArr[i].title) {
                    role_id = rolesArr[i].id;
                }
            }
            connection.query('SELECT * FROM employees;', (err, res) => {
                if (err) throw err; 
                let employeeArr = [];
                for (let i = 0; i < res.length; i++) {
                    employeeArr.push(res[i]);
                }
                inquirer.prompt({
                    name: 'manager',
                    type: 'list',
                    message: "Select this employee's manager",
                    choices: function() {
                        let arr = []
                        if (res.length > 0) {
                            for (let i = 0; i < employeeArr.length; i++) {
                                arr.push(`${employeeArr[i].first_name} ${employeeArr[i].last_name}`);
                            }
                        }
                        return arr;
                    }
                }).then(res => {
                    let manager_id;
                    for (let i =0; i < employeeArr.length; i++) {
                        if (res.manager === `${employeeArr[i].first_name} ${employeeArr[i].last_name}`) {
                            manager_id = employeeArr[i].id;
                        }
                    }
                    const query = 'INSERT INTO employees Set ?;';
                    connection.query(query, {first_name, last_name, role_id, manager_id}, err => {
                        if (err) throw err;
                    });
                    viewEmployee();
                });
            });
        })
    })
}
const viewDept = () => {
    connection.query('SELECT * FROM departments;', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}
const viewRole = () => {
    connection.query('SELECT * FROM roles;', (err, res) => {
        if(err) throw err;
        console.table(res);
        start();
    })
}
const viewEmployee = () => {
    connection.query('SELECT * FROM employees;', (err, res) => {
        if(err) throw err;
        console.table(res);
        start();
    })
}
const updateRole = () => {
    connection.query('SELECT * FROM employees;', (err, res) => {
        if (err) throw err;
        let employeeArr = [];
        for (let i = 0; i < res.length; i++) {
            employeeArr.push(res[i]);
        }
        inquirer.prompt({
            name: 'employee',
            type: 'list',
            message: "Which employee's role would you like to update?",
            choices: function() {
                let arr = ['None']
                if (res.length > 0) {
                    for (let i = 0; i < employeeArr.length; i++) {
                        arr.push(`${employeeArr[i].first_name} ${employeeArr[i].last_name}`);
                    }
                }
                return arr;
            }
        }).then(res => {
            let id;
            for (let i = 0; i < employeeArr.length; i++) {
                if (res.employee === `${employeeArr[i].first_name} ${employeeArr[i].last_name}`) {
                    id = employeeArr[i].id;
                }
            }
            connection.query('SELECT * FROM roles;', (err, res) => {
                if (err) throw err;
                let rolesArr = [];
                for (let i = 0; i < res.length; i++) {
                    rolesArr.push(res[i]);
                }
                inquirer.prompt({
                    name: 'role',
                    type: 'list',
                    message: "What would you like this employee's new role to be?",
                    choices: function () {
                        return res.map(res => res.title);
                    }
                }).then((res) => {
                    let role_id;
                    for (let i =0; i < rolesArr.length; i++) {
                        if (res.role === rolesArr[i].title) {
                            role_id = rolesArr[i].id;
                        }
                    }
                    const query = "UPDATE employees SET ? WHERE ?;";
                    connection.query(query, [{role_id}, {id}], err => {
                        if (err) throw err;
                    })
                    viewEmployee();
                });
            });
        });
    });
}
const updateManager = () => {
    connection.query('SELECT * FROM employees;', (err, res) => {
        if (err) throw err;
        let employeeArr = [];
        for (let i =0; i < res.length; i++) {
            employeeArr.push(res[i]);
        }
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: "Whose manager are you updating?",
                choices: function () {
                    let arr = []
                    if (res.length > 0) {
                        for (let i = 0; i < employeeArr.length; i++) {
                            arr.push(`${employeeArr[i].first_name} ${employeeArr[i].last_name}`);
                        }
                    }
                    return arr;
                }
            },
            {
                name: 'manager',
                type: 'list',
                message: "Who will become the manager of the selected employee?",
                choices: function () {
                    let arr = [];
                    if (res.length > 0){
                        for (let i = 0; i < employeeArr.length; i ++) {
                            arr.push(`${employeeArr[i].first_name} ${employeeArr[i].last_name}`)
                        }
                    }
                    return arr;
                }
            }
        ]).then(res => {
            let id; 
            let manager_id;
            for (let i = 0; i < employeeArr.length; i++) {
                if (res.employee === `${employeeArr[i].first_name} ${employeeArr[i].last_name}`) {
                    id = employeeArr[i].id;
                }
                if (res.manager === `${employeeArr[i].first_name} ${employeeArr[i].last_name}`) {
                    manager_id = employeeArr[i].id;
                }
            }
            const query = "UPDATE employees SET ? WHERE ?;";
            connection.query(query, [{manager_id}, {id}], err => {
                if (err) throw err;
            })
            viewEmployee();
        });
    });
}
const deleteEmployee = () => {
    connection.query('SELECT * FROM employees;', (err, res) => {
        if (err) throw err;
        let employeeArr = [];
        for (let i = 0; i < res.length; i++) {
            employeeArr.push(res[i]);
        }
        inquirer.prompt({
            name: 'employee', 
            type: 'list', 
            message: "Which employee are you deleting?",
            choices: function () {
                let arr = []
                if (res.length > 0) {
                    for (let i = 0; i < employeeArr.length; i++) {
                        arr.push(`${employeeArr[i].first_name} ${employeeArr[i].last_name}`);
                    }
                }
                return arr;
            }
        }).then(res => {
            let id;
            for (let i = 0; i < employeeArr.length; i++) {
                if (res.employee === `${employeeArr[i].first_name} ${employeeArr[i].last_name}`) {
                    id = employeeArr[i].id;
                }
            }
            const query = "DELETE FROM employees WHERE ?;";
            connection.query(query, {id}, err => {
                if (err) throw err;
            })
            console.log(`Deleted ${res.employee} from the database`);
            viewEmployee();
        });
    });
}
const deleteDept = () => {
    connection.query('SELECT * FROM departments;', (err, res) => {
        if (err) throw err;
        let deptArr = [];
        for (let i = 0; i < res.length; i++) {
            deptArr.push(res[i]);
        }
        inquirer.prompt({
            name: 'department',
            type: 'list',
            message: 'Which department would you like to delete?',
            choices: function () {
                let arr = []
                if (res.length > 0) {
                    for (let i = 0; i < deptArr.length; i++) {
                        arr.push(deptArr[i].name);
                    }
                }
                return arr;
            }
        }).then(res => {
            let id;
            for (let i = 0; i < deptArr.length; i++) {
                if (res.department === deptArr[i].name) {
                    id = deptArr[i].id;
                }
            }
            const query = 'DELETE FROM departments WHERE ?;';
            connection.query(query, {id}, err => {
                if (err) throw err;
            })
            console.log(`Successfully deleted ${res.department} from the database.`);
            viewDept();
        });
    });
}
const deleteRole = () => {
    connection.query('SELECT * FROM roles;', (err, res) => {
        if (err) throw err;
        let rolesArr = [];
        for (let i = 0; i < res.length; i++) {
            rolesArr.push(res[i]);
        }
        inquirer.prompt({
            name: 'role',
            type: 'list', 
            message: 'Which role are you deleting?',
            choices: function () {
                let arr = []
                if (res.length > 0) {
                    for (let i = 0; i < rolesArr.length; i++) {
                        arr.push(rolesArr[i].title);
                    }
                }
                return arr;
            }
        }).then(res => {
            let id; 
            for (let i = 0; i < rolesArr.length; i++) {
                if (res.role === rolesArr[i].title) {
                    id = rolesArr[i].id;
                }
            }
            const query = "DELETE FROM roles WHERE ?;";
            connection.query(query, {id}, err => {
                if (err) throw err;
            })
            console.log(`Successfully deleted ${res.role} from the database`);
            viewRole();
        });
    });
}
start();
