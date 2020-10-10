DROP DATABASE IF EXISTS employeeManagementSystemDB;
CREATE DATABASE employeeManagementSystemDB;

-- "department" Table
USE employeeManagementSystemDB;
CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    --will hold department name
    department_name VARCHAR(30),
    PRIMARY KEY(id)
);
-- "role" Table
CREATE TABLE role(
    id INTEGER NOT NULL AUTO_INCREMENT,
    --will hold role of the title
    title VARCHAR(30),
    salary DECIMAL(10,2), NOT NULL, 
    --should reference department table
    department_id INT,
    PRIMARY KEY(id)
);

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    -- this will refer to the role the employee has
    role_id INT NOT NULL,
    -- this will reference the manager of selected employee
    manager_id INT,
    PRIMARY KEY(id)
);
