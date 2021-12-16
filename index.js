const inquirer = require("inquirer");
const mysql = require("mysql2");

//connect to mysql database
const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "admin",
    database: "employee_management_db"
});

//NOTE: employeeManagement() is sync so if passing in db.query, need to make employeeManagement() async
const employeeManagement = async () => {
    //store all the managers
    //waits for promise to be resolved where if it resolves all info is displayed

    const managers = await new Promise (resolve => db.query("SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS TITLE FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.title='Manager'", function(err,res) {
        resolve(res)
    }));
    console.log("MANAGERS", managers);
    //store all the roles, used to create dropdown menu allowing user to select a role
    const roles = await new Promise (resolve => db.query("SELECT * FROM role", function(err,res) {
        resolve(res)    
    }));
    //store all employees used to create dropdown menu allowing user to select

    const employees = await new Promise (resolve => db.query("SELECT * FROM employee", function(err,res) {
        resolve(res)    
    }));
    //store all the departments used to create dropdown menu
    const departments = await new Promise (resolve => db.query("SELECT * FROM department", function(err,res) {
        resolve(res)    
    }));

    //user can selec to view employees, add employee, update, view all roles, add role, view all departments, add department
    inquirer.prompt([
        {
            message: "Welcome! What do you want to do?",
            type: "list",
            name: "choice",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"]
    
        }

    ]).then(response => {
// use switch statement to create conditions based off specific user choice
        
        switch(response.choice) {
// show all the employees if user selected "View All Employees"
//join employee with role to see first name, last name, title, salary and department name
//LEFT JOIN appends everything from left side, since we are left joining role, we can reference the manager
            case "View All Employees":
                db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, results) {
                    console.log(err)
                    respond(() => console.table(results));
                })
                break;
// show all the roles
            case "View All Roles":
                db.query("SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role INNER JOIN department ON role.department_id = department.id ORDER BY role.id; ", function (err, results) {
                    respond(() => console.table(results));
                })
                break;
                
// show all the departments
            case "View All Departments":
                db.query("SELECT * FROM department ", function (err, results) {
                    respond(() => console.table(results));
                })
                break;
//add new department to the department database
            case "Add Department":
                inquirer.prompt({
                    type:'input',
                    message: 'Enter the department name to add. \n\n',
                    name: 'addDepartment'
                }).then((response) => {
                    db.query(`INSERT INTO department(name) VALUES ("${response.addDepartment}")`, function (err, results) {
                        respond(() => console.log(`\n\n${response.addDepartment} has been added to departments!\n`));
                    })
                })
                break;

//add new role ( the name, salary, and department)
            case "Add Role":
                 inquirer.prompt([{
                     type:'input',
                     message: 'What is the name of the new role?',
                     name: 'addRole',
                 },
                 {
                     type:'number',
                     message: "What is the role salary?",
                     name: "addSalary",
                 },
                 {
                    type:'list',
                    message: 'Which department does the new role belong to? \n\n',
                    name: 'employeeDepartment',
                    //return array of objects and inquirer uses it to select choice that gets stored as id
                    //name is what is displayed, value is id of specific department
                    choices: departments.map(item => ({name: item.name, value: item.id}))

                 }
                ]).then((response) => {
                    db.query(`INSERT INTO role(title,salary,department_id) VALUES ("${response.addRole}", "${response.addSalary}", "${response.employeeDepartment}")`, function (err, results) {
                        // console.log("DEPARMENT ERRORS", err);
                        respond(() => console.log('New role has been added to the database!'));
                })
            })
                break;

//add new employee to the database
            case "Add Employee":
                inquirer.prompt([{
                    type:'input',
                    message: 'Enter the first name. \n\n',
                    name: 'firstName'
                },

                 {
                    type:'input',
                    message: 'Enter the last name. \n\n',
                    name: 'lastName'
                 },
                 {
                    type:'list',
                    message: 'Select the employee role. \n\n',
                    name: 'employeeRole',
                    choices: roles.map(item => ({name: item.title, value: item.id}))

                 },
//give user the option to add existing manager
                 {
                    type:'list',
                    message: 'Enter the manager of the employee. \n\n',
                    name: 'employeeManager',
                    choices: managers.map((item) => ({name: item.first_name + ' ' + item.last_name, value: item.id}))

                 }

            ]).then((response) => {
                    db.query(`INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ("${response.firstName}", "${response.lastName}", "${response.employeeRole}", "${response.employeeManager}")`, function (err, results) {
                        respond(() => console.log('New employee has been added to the database!'));
                    })
                })
                break;
// select an employee to update their new role and grab employee id based off selection
            case "Update Employee Role":
                inquirer.prompt([{
                    type:'list',
                    message: 'Which employee do you want to update? \n\n',
                    name: 'updateEmployee',
                    choices: employees.map((item) => ({name: item.first_name + ' ' + item.last_name, value: item.id}))

                 },
                 {
                    type:'list',
                    message: 'Which role do you want to assign to the selected employee? \n\n',
                    name: 'updateEmployeeRole',
// note: value we pass is item.id corresponding to name selection
                    choices: roles.map(item => ({name: item.title, value: item.id}))
                 }]).then((response) => {
                    db.query(`UPDATE employee SET employee.role_id = ${response.updateEmployeeRole} WHERE employee.id = ${response.updateEmployee}`, function (err, results) {
                        console.log("ERROR", err)
                        respond(() => console.log('New role for employee has been added to the database!'));
                    })
                 })
                break;

            
        }
    })
}

employeeManagement();

//function will take in a callback method and call employeeManagement prompt
function respond(callback) {
    callback();
    setTimeout(employeeManagement, 2000);
}


