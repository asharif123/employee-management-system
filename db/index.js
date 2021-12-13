const {prompt} = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "admin",
    database: "employees_management_db"
})