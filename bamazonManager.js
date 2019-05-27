var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});
connection.connect(function (err, res) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  managerMenu();
});

function managerMenu() {
  inquirer
    .prompt([{
      name: 'menuItem',
      message: 'What would you like to do?: \n\n',
      type: 'list',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product',
        'Quit'
      ],
    }, ])
    .then(answer => {
      switch (answer.menuItem) {
        case 'View Products for Sale':
          showAll();
          break;
        case 'View Low Inventory':
          lowInventory()
          break;
        case 'Add to Inventory':
          addInventory()
          break;
        case 'Add New Product':
          addProduct()
          break;
        case 'Quit':
          connection.end();
          break;
        default:
          managerMenu();
      }
    });
}

function showAll() {
  connection.query("SELECT item_id,product_name,price,department_name,stock_quantity FROM products ", function (err, res) {
    if (err) throw err;
    console.log("\n ======================= Products For Sale ========================\n");
    console.table(res);
    // connection.end();
    managerMenu();
  });
}

function lowInventory() {
  connection.query("SELECT item_id,product_name,price,department_name,stock_quantity FROM products", function (err, res) {
    if (err) throw err;
    var lowInventoryArray = [];

    for (let i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
        lowInventoryArray.push(res[i]);
      }
    };
    if (lowInventoryArray.length < 1) {

      console.log('\nWe have at least 5 of each item');
    } else {
      console.log("\n\t\t *We have less than 5 of the following*\n");
      console.table(lowInventoryArray);
    };
    console.log('\n');
    managerMenu();
  });
}

function addInventory() {
  inquirer
    .prompt([{
        name: 'itemId',
        message: 'Enter the ID of the product to be updated:',
        validate: function validateItem(name) {
          return name !== '';
        }
      },
      {
        name: 'quantity',
        message: 'Enter the quantity to be added to inventory:',
        validate: function checkInput(number) {
          var reg = /^\d+$/;
          return reg.test(number) || "please enter a valid quantity"
        }
      }
    ])
    .then(function (answer) {
      connection.query("UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: answer.quantity
          },
          {
            item_id: answer.itemId
          }
        ],
        function (err, res) {
          if (err) throw err;
          console.log("\nThe quantity has been updated to " + answer.quantity + " units\n");
          managerMenu();
        });

    });
}

function addProduct() {
  inquirer
    .prompt([{
        name: 'product',
        message: 'Enter name of the product to be added: ',
        validate: function validateItem(name) {
          return name !== '';
        }
      },
      {
        name: 'department',
        message: 'Enter the department of the product:',
        validate: function validateItem(name) {
          return name !== '';
        }
      },
      {
        name: 'price',
        message: 'Enter the price of the product to be updated:',
        validate: function checkInput(number) {
          var reg = /^\d+(\.[0-9][0-9])$/;
          return reg.test(number) || "please enter a valid price including cents (example 24.99)"
        }
      },
      {
        name: 'quantity',
        message: 'Enter the quantity to be added:',
        validate: function checkInput(number) {
          var reg = /^\d+$/;
          return reg.test(number) || "please enter a valid quantity"
        }
      }
    ])
    .then(function (answer) {
      var sql = "INSERT INTO products SET ?";
      connection.query(sql, {
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },

        function (err, res) {
          if (err) throw err;
          console.log(res);
          console.log(answer.quantity);
          console.log("\n" + answer.product + " has been added with item_id" + insertId + "\n\n");

          managerMenu();
        });

    });
}