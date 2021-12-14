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
    const managers = await new Promise (resolve => db.query("SELECT employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.title='Manager'", function(err,res) {
        resolve(res)
    }));

    //store all the roles
    const roles = await new Promise (resolve => db.query("SELECT * FROM role", function(err,res) {
        resolve(res)
        
    }));
    console.log("MANAGERS", managers);
    console.log("ROLES", roles);
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
                    respond(() => console.table(results));
                })
                break;
// show all the roles
            case "View All Roles":
                db.query("SELECT * FROM role ", function (err, results) {
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

//add new role to the employee database
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
                    choices: roles.map(item => item.title)

                 },
//give user the option to add existing manager. using back ticks to combine 2 strings (first_name and last_name) to be 1 name!
                 {
                    type:'list',
                    message: 'Enter the manager of the employee. \n\n',
                    name: 'employeeManager',
                    choices: managers.map((item) => ([item.first_name,item.last_name].join(" ")))
                    // {name: `${first_name} ${last_name}`, value: id}

                 }
            ]).then((response) => {
                    db.query(`INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ("${response.firstName}", "${response.lastName}", "${response.employeeRole}", "${response.employeeManager}")`, function (err, results) {
                        respond(() => console.log('New employee has been added to the database!'));
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


