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

  showAll();
});


function showAll() {
  connection.query("SELECT item_id,product_name,price,department_name FROM products ", function (err, res) {
    if (err) throw err;
    console.log("=============== Availabe Inventory ===============\n");
    console.table(res);
    connection.end();
  });
}