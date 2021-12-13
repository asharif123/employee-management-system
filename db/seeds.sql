DROP DATABASE IF EXISTS employees_management_db;
CREATE DATABASE employees_management_db;

USE employees_management_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NULL,
  manager_id INT NULL,
  FOREIGN KEY (role_id)
  REFERENCES role(id)
  ON DELETE SET NULL,
  FOREIGN KEY (manager_id)
  REFERENCES role(id)
  ON DELETE SET NULL
);

INSERT INTO department(name)
VALUES ("SALES"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role(title,salary)
VALUES ("Sales Lead", 100000),
("Salesperson", 80000),
("Lead Engineer", 150000),
("Software Engineer", 120000),
("Account Manager", 120000),
("Accountant", 125000),
("Legal Team Lead", 250000),
("Lawyer", 250000);

INSERT INTO employee(first_name,last_name)
VALUES ("John", "Doe"),
("Mike", "Chan"),
("Ashley", "Rodriguez"),
("Awad", "Sharif"),
("Chad", "Tao"),
("Malia", "Brown"),
("Sarah", "Brown"),
("Tom", "Allen");

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;




