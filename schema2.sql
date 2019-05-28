
USE bamazon;

CREATE TABLE departments
(
  department_id INT NOT NULL
  AUTO_INCREMENT,
  department_name VARCHAR
  (100) NULL,
  over_head_costs VARCHAR
  (100) NULL,
    PRIMARY KEY
  (department_id)
);

  INSERT INTO departments
    (department_name,over_head_costs)
  VALUES
    ("tv", 20000),
    ("laptop", 12000),
    ("camera", 8000),
    ("smart-phone", 10000),
    ("smart-home", 4500),
    ("houseware", 15000)
  ;
  SELECT *
  FROM departments;

