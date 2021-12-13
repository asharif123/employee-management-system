const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "admin",
    database: "employees_management_db"
});

//create inquirer prompt that has options view all departments, view all roles,
//all employees, add dep, add role, add employee, and update employee

//use when operator on view all deparments option to show table containing names and ids

//use when operator on view all roles option to show title, role id, the department that role belongs to, and the salary for that role

//use when operator on view all employees to employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

//use when operator on add department so department is added to department database

//use when operator on add role so enter the name, salary, and department added to role database

//use when operator to add employee first name, last name, role, and manager to employee database

//use when operator on update employee to seelect employee to update and add employee to database


const employeeManagement = () => {
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
                db.query("SELECT * FROM employee ", function (err, results) {
                    console.table(results);
                })
                break;
// show all the roles
            case "View All Roles":
                db.query("SELECT * FROM role ", function (err, results) {
                    console.table(results);
                })
                break;

// show all the departments
            case "View All Departments":
                db.query("SELECT * FROM department ", function (err, results) {
                    console.table(results);
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
                        console.log(`\n\n${response.addDepartment} has been added to departments!\n`);
                    })
                })
                break;

//add new role to the employee database
            case "Add Employee":
                inquirer.prompt({
                    type:'input',
                    message: 'Enter the department name to add. \n\n',
                    name: 'addDepartment'
                }).then((response) => {
                    db.query(`INSERT INTO department(name) VALUES ("${response.addDepartment}")`, function (err, results) {
                        console.log(`\n\n${response.addDepartment} has been added to departments!\n`);
                    })
                })
                break;
        }
        //rerun the function if user selects y, else, exit!
            // inquirer.prompt({
            //     type:'input',
            //     message: 'Enter Y/y to continue or N/n to exit!\n\n',
            //     name: 'addEmployee'
            // }).then((results) => {
            //     if (results.addEmployee === "Y" || results.addEmployee === "y") {
            //         employeeManagement();
            //     }

            //     else {
            //         return;
            //     }
            // })
        

    })
}

employeeManagement();


