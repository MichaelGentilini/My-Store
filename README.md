# My-Store - an Amazon-like storefront using Node.js and MySQL

## Getting Started

1. Clone the repo

```sh
git clone https://github.com/MichaelGentilini/My-Store.git
```

2. Install dependencies

```sh
npm install
```

3. Create bamazon database using contents of schemal.sql

4. Run the program

```sh
node bamazonCustomer.js
```

Allows the user to:

- View products available
- Purchase a product by the item_id

```sh
node bamazonManager.js
```

Allows the manager to:

- View Products for Sale
- View Low Inventory
- Add to Inventory
- Add New Product

```sh
node bamazonSupervisor.js
```

Allows the supervisor to:

- View Product Sales by Department
- Create New Department

<hr>

<p align="center">
  <img src="bamazon.gif" width="50%">
</p>

## Things used

[REGEX](https://regex101.com/) for validation

[inquirer](https://www.npmjs.com/package/inquirer) for the CLI

[mysql](https://www.npmjs.com/package/mysql) is the database

[console.table](https://www.npmjs.com/package/console.table) for formatting

<hr>

### Find it on [GitHub](https://github.com/michaelgentilini/My-Store)

### Watch the [Video](https://drive.google.com/file/d/1m3Z4QNdZxOSmnrUOFUGyiaZxDG1wvpNy/view?usp=sharing)
