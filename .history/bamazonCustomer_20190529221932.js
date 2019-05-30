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
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt([{
      name: 'menuItem',
      message: 'What would you like to do?: \n\n',
      type: 'list',
      choices: [
        'See all items',
        'Purchase an Item by ID',
        'Quit'
      ],
    }, ])
    .then(answer => {
      switch (answer.menuItem) {
        case 'See all items':
          showAll();
          break;
        case 'Purchase an Item by ID':
          purchaseByID();
          break;
        case 'Quit':
          quitProgram();
          break;
        default:
          console.log('That is not an option');
          mainMenu();
          break;
      }
    });
}

function quitProgram() {
  console.log("Thank you for your business!");
  connection.end();
}

function showAll() {
  connection.query("SELECT item_id,product_name,price,department_name FROM products ", function (err, res) {
    // if (err) throw err;
    console.log("\n ======================= Availabe Products ========================\n");
    console.table(res);
    mainMenu();
  });
}

function purchaseByID(printResults) {
  inquirer
    .prompt([{
        name: 'itemId',
        message: 'Enter the ID of the product you wish to purchase:',
        validate: function checkInput(number) {
          var reg = /^\d+$/;
          return reg.test(number) || "please enter a valid ID number"
        }
      },
      {
        name: 'quantity',
        message: 'Enter the quantity of the products to purchase:',
        validate: function checkInput(number) {
          var reg = /^\d+$/;
          return reg.test(number) || "please enter a valid quantity"
        }
      }
    ])
    .then(function (answer) {
      var query = "SELECT product_name,price,stock_quantity,product_sales FROM products WHERE?";
      connection.query(query, {
        item_id: answer.itemId
      }, function (err, res) {
        if (err) throw err;

        if (err) {
          console.log("Error login: " + err);
        }

        // ? not sure how to stop the program from running if there is no result (no item_id)
        if (res.length < 1) {
          console.log('\n 💩 💩 💩\t That item does not exist. Please try your order again! \n');
          mainMenu();

        } else if (res[0].stock_quantity < answer.quantity) {
          console.log("\nSorry, we don't have enough to fill your order! \n\t Please enter a different amount.\n");
          mainMenu();
        } else {
          updateSales(answer.itemId, total);
          updateInventory(answer.itemId, newQuantity, printResults);
          mainMenu();
        }
        if (res[0]) {
          var newQuantity = res[0].stock_quantity - answer.quantity;
          var total = answer.quantity * res[0].price;
          var prod = res[0].product_name;
          var quan = answer.quantity;
          var sales = parseFloat(res[0].product_sales);
        }
        if (!sales) {
          total = total;
        } else {
          total = sales + total;
        }
        // ? this function prints the order with total on checkout
        function printResults(prod, quan, total) {
          console.log("\n\t\Item:\t\t" + prod + "\n\tQuantity: \t" + quan + "\n\tTotal: \t\t$" +
            total.toFixed(2) + "\n");
        }

        // ? this function updates inventory on checkout
        function updateInventory(id, newQuantity) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: newQuantity
              },
              {
                item_id: id
              }
            ],
            function (err, res) {
              if (err) throw err;
              console.log("\n ====== Inventory Has Been Updated ======");
              printResults(prod, quan, total);
              mainMenu();
            });
        }

        // ? this function updates the product-sales amount on checkout
        function updateSales(id, total) {
          console.log('sales updated!');
          connection.query(
            "UPDATE products SET ? WHERE ?", [{
                product_sales: total
              },
              {
                item_id: id
              }
            ],
            function (err, res) {
              if (err) throw err;
              console.log(res);
            });
        }
      });
    });
}