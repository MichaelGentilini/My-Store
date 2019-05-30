var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

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
  supervisorMenu();
});

function supervisorMenu() {
  inquirer
    .prompt([{
      name: 'menuItem',
      message: 'What would you like to do?: \n\n',
      type: 'list',
      choices: [
        'View Product Sales by Department',
        'Create New Department',
        'Quit'
      ],
    }, ])
    .then(answer => {
      switch (answer.menuItem) {
        case 'View Product Sales by Department':
          viewSales();
          break;
        case 'Create New Department':
          addDepartment()
          break;
        case 'Quit':
          connection.end();
          break;
        default:
          supervisorMenu();
      }
    });
}

function viewSales() {
  connection.query("SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(product_sales) AS product_sales, departments.over_head_costs-SUM(product_sales) AS total_profit FROM products INNER JOIN departments ON products.department_name=departments.department_name GROUP BY department_id", function (err, res) {
    if (err) throw err;

    for (let j = 0; j < res.length; j++) {
      if ((res[j].product_sales === null) || (res[j].total_profit === null)) {
        res[j].product_sales = 0;
        res[j].total_profit = 0;
      } else {
        res[j].product_sales = res[j].product_sales.toFixed(2);
        res[j].total_profit = res[j].total_profit.toFixed(2);
      }
    }
    console.log('\n ======================= Product Sales by Department =======================\n');
    console.table(res);
    supervisorMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([{
        name: 'department',
        message: 'Enter the department to be added:',
        validate: function validateItem(name) {
          return name !== '';
        }
      },
      {
        name: 'costs',
        message: 'Enter the overhead costs:',
        validate: function checkInput(number) {
          var reg = /^\d+$/;
          return reg.test(number) || "please enter a valid value (decimals are not needed)"
        }
      }
    ])
    .then(function (answer) {
      var sql = "INSERT INTO departments SET ?";
      connection.query(sql, {
          department_name: answer.department,
          over_head_costs: answer.costs,
        },

        function (err, res) {
          if (err) throw err;
          console.log("\n\t" + answer.department + " has been added with department_id " + res.insertId + "\n");
          supervisorMenu();
        });

    });
}

// ! for reference
//  inquirer
// .prompt([{
//     name: 'product',
//     message: 'Enter name of the product to be added: ',
//     validate: function validateItem(name) {
//       return name !== '';
//     }
//   },
//   {
//     name: 'department',
//     message: 'Enter the department of the product:',
//     validate: function validateItem(name) {
//       return name !== '';
//     }
//   },
//   {
//     name: 'price',
//     message: 'Enter the price of the product to be updated:',
//     validate: function checkInput(number) {
//       var reg = /^\d+(\.[0-9][0-9])$/;
//       return reg.test(number) || "please enter a valid price including cents (example 24.99)"
//     }
//   },
//   {
//     name: 'quantity',
//     message: 'Enter the quantity to be added:',
//     validate: function checkInput(number) {
//       var reg = /^\d+$/;
//       return reg.test(number) || "please enter a valid quantity"
//     }
//   }
// ])
// .then(function (answer) {
//   var sql = "INSERT INTO products SET ?";
//   connection.query(sql, {
//       product_name: answer.product,
//       department_name: answer.department,
//       price: answer.price,
//       stock_quantity: answer.quantity
//     },

//     function (err, res) {
//       if (err) throw err;
//       console.log(res);
//       console.log(answer.quantity);
//       console.log("\n" + answer.product + " has been added with item_id" + insertId + "\n\n");

//       managerMenu();
//     });

// });