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
        'Purchase an Item by ID'
      ],
    }, ])
    .then(answer => {
      switch (answer.menuItem) {
        case 'See all items':
          showAll();
          break;
        case 'Purchase an Item by ID':
          purchaseByID()
          break;
        default:
          console.log('That is not an option');
          mainMenu();
      }
    });

}

function showAll() {
  connection.query("SELECT item_id,product_name,price,department_name FROM products ", function (err, res) {
    if (err) throw err;
    console.log("\n ======================= Availabe Products ========================\n");
    console.table(res);
    // connection.end();
    mainMenu();
  });
}

function purchaseByID() {
  inquirer
    .prompt([{
        name: 'itemId',
        message: 'Enter the ID of the product you wish to purchase:',
        validate: function validateItem(name) {
          return name !== '';
        }
      },
      {
        name: 'quantity',
        message: 'Enter the quantity of the products to purchase:',
        validate: function validateQuatity(quantity) {
          return quantity !== '';
        }
      }
    ])
    .then(function (answer) {
      var query = "SELECT product_name,price,stock_quantity FROM products WHERE?";
      connection.query(query, {
        item_id: answer.itemId
      }, function (err, res) {
        if (err) throw err;
        var newQuantity = res[0].stock_quantity - answer.quantity;
        var total = answer.quantity * res[0].price

        if (res[0].stock_quantity < answer.quantity) {
          console.log("\nSorry, we don't have enough to fill that order! \n\t Please enter a different amount.");
        } else {
          updateInventory(answer.itemId, newQuantity);

          console.log("\n\tItem:" + res[0].product_name + "\n\tQuantity: " + answer.quantity + "\n\tTotal: $" +
            total.toFixed(2) + "\n");
        }
        mainMenu();
      });

    });



}

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
      console.log("\n ========== Updated Inventory ==========\n");
      mainMenu();
    });

}





// function checkQuantity() {
//   if (userQuantity <= productQuantity) {

//   }