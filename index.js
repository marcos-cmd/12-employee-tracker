const inquirer = require('inquirer');
const { connection } = require('./config/connection');
const { insertDepts, insertRoles, insertEmployees, selectDepts, selectRoles, selectEmployees, updateEmployees, selectSum, selectBudget, selectEmployeeByManager, deleteDepts, deleteRoles, deleteEmployees } = require('./model/queries');
const { startPrompt, addDeptPrompt, addRolePrompt, addEmployeePrompt } = require('./model/prompts');

connection.connect(function (err) {
    if (err) throw err;
    start();
});

const start = () => {
    inquirer.prompt(startPrompt).then((answers) => {
        console.log(answers);
        switch (answers.options) {
            case 'Add a Department':
                addDept();
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
            case 'Update an Employee\'s Manager':
                updateManager();
                break;
            case 'View Employees by Manager':
                viewByManager();
                break;
            case 'Delete an Employee':
                deleteEmployee();
                break;
            case 'View Department\'s salary budget':
                deptBudget();
                break;
            case 'Delete a Department':
                deleteDept();
                break;
            case 'Delete a Role':
                deleteRole();
                break;
            default:
                process.exit(22);
                break;
        }
    })
};

const addDept = async () => {
    inquirer.prompt(addDeptPrompt).then(({ name }) => {
        console.log({ name })
        connection.query(insertDepts, { name }, err => {
            if (err) throw err;
        });
        console.log(`Added ${name} department to the database.`);
        start();
    })
};

const addRole = () => {
    inquirer.prompt(addRolePrompt).then(({ title, salary, department_id }) => {
        connection.query(insertRoles, { title, salary, department_id }, err => {
            if (err) throw err;
        });
        console.log(`Added the role of ${title} to the database.`);
        start();
    })
}
const addEmployee = () => {
    connection.query(selectRoles, (err, res) => {
        if (err) throw err;
        let rolesArr = [];
        for (let i = 0; i < res.length; i++) {
            rolesArr.push(res[i]);
        }
        addEmployeePrompt.push({
            name: 'role',
            type: 'list',
            message: "Enter the title of this employee's role",
            choices: function () {
                return res.map(res => res.title);
            }
        });
        inquirer.prompt(addEmployeePrompt).then((res) => {
            let first_name = res.first;
            let last_name = res.last;
            let role_id;
            for (let i = 0; i < rolesArr.length; i++) {
                if (res.role === rolesArr[i].title) {
                    role_id = rolesArr[i].id;
                }
            }
            connection.query(selectEmployees, (err, res) => {
                if (err) throw err;
                let employeeArr = [];
                for (let i = 0; i < res.length; i++) {
                    employeeArr.push(res[i]);
                }
                inquirer.prompt({
                    name: 'manager',
                    type: 'list',
                    message: "Select this employee's manager",
                    choices: function () {
                        let arr = []
                        if (res.length > 0) {
                            for (let i = 0; i < employeeArr.length; i++) {
                                arr.push(`${employeeArr[i].first_name} ${employeeArr[i].last_name}`);
                            }
                        }
                        arr.push('No one');
                        return arr;
                    }
                }).then(res => {
                    let manager_id;
                    for (let i = 0; i < employeeArr.length; i++) {
                        if (res.manager === `${employeeArr[i].first_name} ${employeeArr[i].last_name}`) {
                            manager_id = employeeArr[i].id;
                        }
                    }
                    connection.query(insertEmployees, { first_name, last_name, role_id, manager_id }, err => {
                        if (err) throw err;
                    });
                    console.log(`Added ${first_name} ${last_name} to the database.`);
                    start();
                });
            });
        })
    })
}
const viewDept = () => {
    connection.query(selectDepts, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}
const viewRole = () => {
    connection.query(selectRoles, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}
const viewEmployee = () => {
    connection.query(selectEmployees, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
}
const updateRole = () => {
connection.query(selectEmployees, (err, res) => {
    if (err) throw err;
let employeeArr = [];
for (let i = 0; i < res.length; i++) {
    employeeArr.push(res[i]);
}
    inquirer.prompt({
    name: 'employee',
    type: 'list',
    message: "Which employee's role are you updating??",
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
    let first_name;
    let last_name;
    for (let i = 0; i < employeeArr.length; i++) {
        if (res.employee === `${employeeArr[i].first_name} ${employeeArr[i].last_name}`) {
            id = employeeArr[i].id;
            first_name = employeeArr[i].first_name;
            last_name = employeeArr[i].last_name;
        }
    }
    connection.query(selectRoles, (err, res) => {
        if (err) throw err;
        let rolesArr = [];
        for (let i = 0; i < res.length; i++) {
            rolesArr.push(res[i]);
        }
        inquirer.prompt(
        {
            name: 'role',
            type: 'list',
            message: "What will this employee's new role be?",
            choices: function () {
                return res.map(res => res.title);
            }
        }
        ).then((res) => {
            let role_id;
            for (let i = 0; i < rolesArr.length; i++) {
                if (res.role === rolesArr[i].title) {
                    role_id = rolesArr[i].id;
                }
            }
            connection.query(updateEmployees, [{ role_id }, { id }], err => {
                if (err) throw err;
                })
                console.log(`${first_name} ${last_name}'s role has been updated to "${res.role}".`);
                    start();
                });
            });
        });
    });
}
const updateManager = () => {
        connection.query(selectEmployees, (err, res) => {
            if (err) throw err;
            let employeeArr = [];
            for (let i = 0; i < res.length; i++) {
                employeeArr.push(res[i]);
            }
            const choices = () => {
                let arr = []
                if (res.length > 0) {
                    for (let i = 0; i < employeeArr.length; i++) {
                        arr.push(`${employeeArr[i].first_name} ${employeeArr[i].last_name}`);
                    }
                }
                arr.push('No one');
                return arr;
            }
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: "Whose manager are you updating?",
                    choices: choices
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: "Who will become the manager of the selected employee?",
                    choices: choices
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
                connection.query(updateEmployees, [{ manager_id }, { id }], err => {
                    if (err) throw err;
                })
                console.log(`${res.manager} has been set as the manager for ${res.employee}.`);
                start();
            });
        });
    }
    const viewByManager = () => {
        connection.query(selectEmployees, (err, res) => {
            if (err) throw err;
            let employeeArr = [];
            for (let i = 0; i < res.length; i++) {
                employeeArr.push(res[i]);
            }
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: "Pick a manager to view their employees",
                    choices: function () {
                        let arr = []
                        if (res.length > 0) {
                            for (let i = 0; i < employeeArr.length; i++) {
                                arr.push(`${employeeArr[i].first_name} ${employeeArr[i].last_name}`);
                            }
                        }
                        return arr;
                    }
                }
            ]).then(res => {
                let manager_id;
                for (let i = 0; i < employeeArr.length; i++) {
                    if (res.employee === `${employeeArr[i].first_name} ${employeeArr[i].last_name}`) {
                        manager_id = employeeArr[i].id;
                    }
                }
                connection.query(selectEmployeeByManager, manager_id, (err, res) => {
                    if (err) throw err;
                    if (Object.keys(res).length !== 0) {
                        console.table(res);
                    } else {
                        console.log('The manager you have selected does not supervise any employees.');
                    }
                    start();
                })
            });
        })
    }
    const deleteEmployee = () => {
        connection.query(selectEmployees, (err, res) => {
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
                connection.query(deleteEmployees, { id }, err => {
                    if (err) throw err;
                })
                console.log(`Deleted ${res.employee} from the database`);
                start();
            });
        });
    }
    const deleteDept = () => {
        connection.query(selectDepts, (err, res) => {
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
                connection.query(deleteDepts, { id }, err => {
                    if (err) throw err;
                })
                console.log(`Successfully deleted ${res.department} department from the database.`);
                start();
            });
        });
    }
    const deleteRole = () => {
        connection.query(selectRoles, (err, res) => {
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
                connection.query(deleteRoles, { id }, err => {
                    if (err) throw err;
                })
                console.log(`Successfully deleted the role of ${res.role} from the database.`);
                start();
            });
        });
    }

    const deptBudget = () => {
        connection.query(selectDepts, (err, res) => {
            if (err) throw err;
            let deptArr = [];
            for (let i = 0; i < res.length; i++) {
                deptArr.push(res[i]);
            }
            inquirer.prompt({
                name: 'dept',
                type: 'list',
                message: "Choose a department to view its total utilized budget. i.e. the combined salaries of all employees in that department",
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
                connection.query(selectBudget, res.dept, (err, res) => {
                    if (err) throw err;
                    if (Object.keys(res).length !== 0) {
                        console.table(res);
                    }
                })
                connection.query(selectSum, res.dept, (err, res) => {
                    if (err) throw err;
                    if (res[0].total !== null) {
                        console.log(`The total utilized budget of the ${res[0].name} department is $${res[0].total.toFixed(2)}.`);
                    } else {
                        console.log(`The total utilized budget of the ${res[0].name} department is $0.00.`)
                    }
                    start();
                })
            })
        })
    }
