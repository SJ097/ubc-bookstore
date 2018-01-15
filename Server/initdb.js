db.products.insertMany([
  {
    name: "KeyboardCombo",
    price: 25,
    quantity: 10,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/KeyboardCombo.png"
  },
  {
    name: "Mice",
    price: 6,
    quantity: 10,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/Mice.png"
  },
  {
    name: "PC1",
    price: 324,
    quantity: 5,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/PC1.png"
  },
  {
    name: "PC2",
    price: 376,
    quantity: 9,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/PC2.png"
  },
  {
    name: "PC3",
    price: 357,
    quantity: 8,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/PC3.png"
  },
  {
    name: "Tent",
    price: 35,
    quantity: 0,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/Tent.png"
  },
  {
    name: "Box1",
    price: 5,
    quantity: 3,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/Box1.png"
  },
  {
    name: "Box2",
    price: 7,
    quantity: 9,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/Box2.png"
  },
  {
    name: "Clothes1",
    price: 25,
    quantity: 4,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/Clothes1.png"
  },
  {
    name: "Clothes2",
    price: 26,
    quantity: 3,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/Clothes2.png"
  },
  {
    name: "Jeans",
    price: 35,
    quantity: 8,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/Jeans.png"
  },
  {
    name: "Keyboard",
    price: 21,
    quantity: 1,
    imageUrl: "https://cpen400a-bookstore.herokuapp.com/images/Keyboard.png"
  }
])

db.orders.insertOne(
  {
    cart: "json string for cart object",
    total: 117
  }
)

db.users.insertMany([
{
	token : "Xoe2inasd"
},

{
	token : "Xoe2inqwe"
},

{
	token : "Xoe2infgh"
},

{
	token : "Xoe2invbn"
},

{
	token : "Xoe2ilkmnui"
}
])