DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products
(
  item_id INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price FLOAT(6,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products
  (item_id,product_name,department_name,price,stock_quantity)
VALUES
  (001, "60 inch 4k television", "tv", 799.99, 3),
  (002, "60 inch LED television", "tv", 999.88, 5),
  (003, "13 inch Macbook Pro", "laptop", 1299.88, 5),
  (004, "14 inch Chromebook", "laptop", 299.00, 12),
  (005, "Lenovo - Yoga 13.9 inch Laptop", "laptop", 1149.47, 6),
  (006, "Nikon D850 DSLR camera", "camera", 2699.99, 2),
  (007, "Canon - EOS Rebel T7i DSLR Camera", "camera", 949.99, 6),
  (008, "iPhone X", "smart-phone", 849.99, 10),
  (009, "Samsung S10", "smart-phone", 899.99, 20),
  (010, "Google - Home Mini ", "smart-home", 48.99, 50),
  (011, "Amazon - Echo Dot", "smart-home", 49.99, 45),
  (012, "Ring - Video Doorbell", "smart-home", 199.99, 25)
;

SELECT *
FROM products;

