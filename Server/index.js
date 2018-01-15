var express = require('express');
var path = require('path');
var app = express();

app.set('port', (process.env.PORT || 5000))

app.use(express.static(path.join(__dirname, 'public')));  // For bonus task 7. It is working.


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

// url for task 2.
app.get('/products/:user_token', function(request, response) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var user_token = request.params.user_token;
	  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  
  // Checking authentic token
  db.collection("users").findOne( {"token": user_token }, function(err, output){
	  
	  if (err) throw err;
	  if(output == null){
		  response.status(401).send("User token does not match");
		  
	  }else{
		 
		   var products_obj = "{";
  db.collection("products").find({}).toArray(function(err, result) {
    if (err) throw err;
 
	for(var i in result){
		var name = result[i].name;
        var price = result[i].price;
        var quantity = result[i].quantity;
        var imageUrl = result[i].imageUrl;
	
		if(i==(result.length-1)){   // to remove last comma
			products_obj += '"' + name + '":{"name":"' + name + '","price":'
			products_obj += price + ',"quantity":' + quantity + ',"imageUrl":"'
			products_obj += imageUrl + '"}'
		}else{
		
		products_obj += '"' + name + '":{"name":"' + name + '","price":'
        products_obj += price + ',"quantity":' + quantity + ',"imageUrl":"'
        products_obj += imageUrl + '"},'
		}
		
	}
	
	products_obj += '}';
	 response.json(JSON.parse(products_obj));
    db.close();
  });
	  } 
  });
});
   
   
})

// url for task 3, minimum amd maximum price filter is included.
app.get('/products/:min/:max/:user_token', function(request, response) {

  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  var min = request.params.min;
  var max = request.params.max;
  var user_token = request.params.user_token;
  
   if (isNaN(min) || isNaN(max)) {
    response.status(400).send("The entered values are not numbers");
  };
  
    min = Number(min);
	max = Number(max);
	
	if (min > max) {
    response.status(400).send("Minimum price cannot be greater than maximum price");
  };
  
	  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  
  // Checking authentic token
  db.collection("users").findOne( {"token": user_token }, function(err, output){
	  if (err) throw err;
	  if(output == null){
		  response.status(401).send("User token does not match");
		  
	  }else{
	var products_obj = "{";
  db.collection("products").find({}).toArray(function(err, result) {
    if (err) throw err;
	
	for(var i in result){
		var price = result[i].price;
		if(price>=min && price<=max){
			
		var name = result[i].name;
        
        var quantity = result[i].quantity;
        var imageUrl = result[i].imageUrl;
	
		if(i==(result.length-1)){   // to remove last comma
			console.log("last element");
			products_obj += '"' + name + '":{"name":"' + name + '","price":'
			products_obj += price + ',"quantity":' + quantity + ',"imageUrl":"'
			products_obj += imageUrl + '"}'
		}else{
			
		products_obj += '"' + name + '":{"name":"' + name + '","price":'
        products_obj += price + ',"quantity":' + quantity + ',"imageUrl":"'
        products_obj += imageUrl + '"},'
		}
			
		};
		
	}
	products_obj += '}';
	 response.json(JSON.parse(products_obj));
    db.close();
  });
		  
	  }
  });
  
});
   
});

app.post('/checkout', function(request, response){
	
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	
	
  var cart = JSON.parse(request.body.cart);
  var totalPrice = request.body.totalPrice;
  var user_token = request.body.user_token;
  
   MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  
  // Checking authentic token
  db.collection("users").findOne( {"token": user_token }, function(err, output){
	  if (err) throw err;
	  if(output == null){
		  response.status(401).send("User token does not match");
		  
	  }else{
		  
		  // Inserting into orders table
		db.collection("orders").insertOne({"cart":JSON.stringify(cart), "total":totalPrice}, function(err, result) {
          if (err) throw err;
        });
	  db.collection("products").find({}).toArray(function(err, result){
		  if (err) throw err;
		  
		for(var i in result){
		var name = result[i].name;
        var quantity = result[i].quantity;
		
		// Checking if the particular product exists in cart
		if(name in cart){   
			console.log( name+ " exists in cart");
			quantity = quantity - cart[name];
			
			 // Decrement the quantity in the products table if the product exists in the cart.
			 db.collection("products").updateOne({"name":name}, {$set:{"quantity":quantity}}, function(err, res) {
                if (err) throw err;
              });
            }
		} 
	  });
  }
		  
	  });
  });
  
  response.status(200).send("Checkout successful.");
	
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});