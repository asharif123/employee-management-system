INSERT INTO department(name)
VALUES ("Engineering"),
("Sales"),
("Law"),
("Business"),
("Management");

INSERT INTO role(title,salary,department_id)
VALUES ("Sales Lead", 100000,2),
("Salesperson", 80000,2),
("Lead Engineer", 150000,1),
("Software Engineer", 120000,1),
("Manager", 220000,5),
("Accountant", 125000,4),
("Legal Team Lead", 250000,3),
("Lawyer", 250000,3),
("Front End Developer", 90000,1),
("Backend Developer", 100000,1),
("Fullstack developer", 120000,1);


INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES ("John", "Doe",1,5),
("Mike", "Chan",2,5),
("Awad", "Sharif",3,5),
("Chad", "Tao",5,4),
("Ashley", "Rodriguez",5,5),
("Malia", "Brown",3,4),
("Sarah", "Brown",5,7),
("Tom", "Allen",4,4),
("Patricia", "Anderson", 6,4),
("Hanna", "Joy", 7,4),
("Adam", "Scott", 8,4),
("Mitchell", "Michaels", 9,7),
("Donny", "Jackson", 10,7),
("Jason", "Newell" ,11,7);