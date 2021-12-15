const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "admin",
    database: "employee_management_db"
});


const employeeManagement = async () => {
    //store all the managers
    // SELECT *, role.title AS 'Title' FROM employee INNER JOIN role ON role.id = employee.role_id WHERE role.title = 'Manager'
    const managers = await new Promise (resolve => db.query("SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS TITLE FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.title='Manager'", function(err,res) {
        resolve(res)
    }));

    //store all the roles
    //waits for promise to be resolved where it resolves when all info is found from roles
    const roles = await new Promise (resolve => db.query("SELECT * FROM role", function(err,res) {
        resolve(res)    
    }));

    //store all employees

    const employees = await new Promise (resolve => db.query("SELECT * FROM employee", function(err,res) {
        resolve(res)    
    }));

    // console.log("EMPLOYEES", employees);

    //store all the departments
    const departments = await new Promise (resolve => db.query("SELECT * FROM department", function(err,res) {
        resolve(res)    
    }));


    // console.log("MANAGERS", managers);
    // console.log("DEPARTMENTS", departments);
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
            case "View All Employees":
                db.query("SELECT employee.first_name AS first_name, employee.last_name AS last_name , role.title AS title, role.salary AS salary FROM employee INNER JOIN role ON employee.role_id = role.id ", function (err, results) {
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
                    message: 'Enter the department of the employee. \n\n',
                    name: 'employeeDepartment',
                    //return array of objects and inquirer uses it to select choice that gets stored as id
                    //name is what is displayed, value is id
                    choices: departments.map(item => ({name: item.name, value: item.id}))

                 }
                ]).then((response) => {
                    db.query(`INSERT INTO role(title,salary,department_id) VALUES ("${response.addRole}", "${response.addSalary}", "${response.employeeDepartment}")`, function (err, results) {
                        console.log("DEPARMENT ERRORS", err);
                        respond(() => console.log('New employee has been added to the database!'));
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
                    message: 'Enter the employee role. \n\n',
                    name: 'employeeRole',
                    choices: roles.map(item => ({name: item.title, value: item.id}))

                 },
//give user the option to add existing manager. using back ticks to combine 2 strings (first_name and last_name) to be 1 name!
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
// select an employee to update and their new role
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
                    choices: roles.map(item => ({name: item.title, value: item.id}))
                 }]).then((response) => {

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


