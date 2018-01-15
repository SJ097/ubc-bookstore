var cart = {};
var totalPrice = 0;
var flag = 0;

function inactiveTime() {
	var footer = document.getElementById('timer');
	var number = footer.innerHTML;
	if (number == 0 && flag == 0) {
		alert("Hey there! Are you still planning to buy something?");
		flag = 1;
	}
	if (number > 0) {
		number--;
	}
	footer.innerHTML = number;
}

setInterval(inactiveTime, 1000);

function resetTime() {
	var footer = document.getElementById('timer');
	footer.innerHTML = 300;
	flag = 0;
}

var products = {};
var productsCompare = {};

	
var ajaxGet = function(url, successCallback, errorCallback){
		console.log("Calling "+url);
		
		var limit = 0;
		
		function shelverx(){
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", url);
			xhttp.onload=function() {
					if (xhttp.status == 200) {
						//var resp = JSON.parse(xhttp.responseText);
						//console.log(xhttp.responseText);
						successCallback(xhttp.responseText);
				}
				else{
					limit++;
					errorCallback(xhttp.statusText);
					if (limit < 7) setTimeout( shelverx, 1000 );
				}
				 
			};
			xhttp.ontimeout = function() {
			shelverx();
		};
			xhttp.timeout = 3000;
			 xhttp.send();
		};
		shelverx();
			 
}

var ajaxPostCheckout = function() {
		
		console.log("inside ajaxPostCheckout status");
	
			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "http://localhost:5000/checkout", true);
			 xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.onload=function() {
					if (xhttp.status == 200) {
						var resp = xhttp.responseText;
						console.log("inside 200 status");
						computePrice();
						
					}
				else{
					console.log("inside else status");
				}
				 
			};
			xhttp.ontimeout = function() {
			console.log("timeout in ajaxPostCheckout");
		};
			xhttp.timeout = 3000;
			xhttp.send("cart="+ JSON.stringify(cart) + "&totalPrice=" + totalPrice + "&user_token=Xoe2inqwe");
	
}



function checkoutCompare() {
	
	var quantityMessage = "";
	var priceMessage = "";
	var checkoutMessage = "";

	// Check server update
	for (var a in cart) {
		
		// If a certain product in the cart has a quantity of 0, remove it
		if (cart[a] == 0)
			delete cart[a];
		
		else {
			// If quantity of a product on the server is less than what's in the cart, concatenate appropriate message and update cart
			if (cart[a] > productsCompare[a].quantity) {
				quantityMessage += "There are only " + productsCompare[a].quantity + " " + a + " in stock.\n";
				cart[a] = productsCompare[a].quantity;
			}
		
			// If price on server changes, concatenate appropriate message
			if (products[a].price != productsCompare[a].price) {
				priceMessage += a + "'s price is now $" + productsCompare[a].price + ".\n";
			}
		
			// Concatenate checkout message
			checkoutMessage += cart[a] + " " + a + ": $" + productsCompare[a].price*cart[a] + ".\n";
		}
	}
	
	// Add confirmation question in checkout message
	checkoutMessage += "Confirm?";
	
	// Alert user if quantities change
	if (quantityMessage != "")
		alert(quantityMessage);
	
	// Alert user if prices change
	if (priceMessage != "")
		alert(priceMessage);
		
	// Update each product
	for (var a in products)
		products[a] = productsCompare[a];
	
	for (var a in cart) {
		// If a certain product in the cart has a quantity of 0, remove it
		if (cart[a] == 0)
			delete cart[a];
	}
	
	// Compute price to be displayed on cart button
	computePrice();
	document.getElementById("showCart").textContent = "Cart ($" + totalPrice + ")"; 
	
	// Update prices DOM in HTML
	showPrices();
	
	// Update modal prices and quantities
	showCart();
	
	// If product's quantity is 0, display out of stock
	showOutOfStock();
	
	// Display confirmation message
	var correct = confirm(checkoutMessage);
	
	// If user confirms, alert total price
	if (correct)
		alert("The total cost is $" + totalPrice);
	
}
	
//var url = "http://localhost:5000/products/20/300/Xoe2inqwe";  // url to check min and max
var url = "http://localhost:5000/products/Xoe2inqwe";

	
ajaxGet(url,
		success,
		fatal
	);

// NOTE: For test 2, it seems that the products from the server should NOT be parsed by JSON beforehand...
// Therefore, please use successModal for test 2 and not success
// They work the same way, except the successModal input is expected to be parsed by JSON beforehand,
// while the success input is not, thus they work slightly differently but give the same outcome
function success(response) {
	
	var reponse = JSON.parse(response);
	
	//console.log(response);
			alert(response + "SUCCESS");
			for(var key in reponse){	
				if(reponse.hasOwnProperty(key)){
					products[key] = reponse[key];
					//alert(key);
				};
				
			};
			console.log(products);
			keyinitialise();
			showPrices(); // To show the prices of the products
			showImages();
			showOutOfStock();
}

function successModal(response) {
	
	console.log(response);
			//var products = {};
			//alert(response + "SUCCESS");
			for(var key in response){	
				if(response.hasOwnProperty(key)){
					productsCompare[key] = response[key];
					//alert(key);
				};
				
			};
			console.log(productsCompare);
	
}

function showPrices(){
	var prices = document.getElementsByClassName("costPosition");
	for(var i =0; i<prices.length; i++){
		prices[keys[i]] = prices[i];
		delete prices[i];
		};
		
		for(var key in products){	
				if(products.hasOwnProperty(key)){
					prices[key].innerHTML = "$" + products[key].price;
				};
				
			};
	
}

function showImages(){
	var imagesdisplay = document.getElementsByClassName("resize");
	for(var i =0; i<imagesdisplay.length; i++){
		imagesdisplay[keys[i]] = imagesdisplay[i];
		delete imagesdisplay[i];
		};
		
		for(var key in products){	
				if(products.hasOwnProperty(key)){
					imagesdisplay[key].src = products[key].imageUrl;
				};
				
			};
	
}

function showOutOfStock(){
	var x = document.getElementsByClassName("removeButton");
	for(var i =0; i<x.length; i++){
		x[keys[i]] = x[i];
		delete x[i];
	};
	
	var y = document.getElementsByClassName("addButton");
	for(var i =0; i<y.length; i++){
		//console.log("inside");
		y[keys[i]] = y[i];
		delete y[i];
	};
	
	var z = document.getElementsByClassName("centered");
	for(var i =0; i<z.length; i++){
		z[keys[i]] = z[i];
		delete z[i];
	};
	
	var a = document.getElementsByClassName("resizeCart");
	for(var i =0; i<a.length; i++){
		a[keys[i]] = a[i];
		delete a[i];
	};
	
	
	
	for(var productName in products){	
				if(products.hasOwnProperty(productName)){
					if(products[productName].quantity == 0){
				//console.log(y);
				y[productName].style.display = "none";
				z[productName].style.display = "block";
				a[productName].style.display = "none";

					}
				};
				
			};
}




function fatal(error) {
	alert(error);
}

var keys = [];
var keyinitialise = function(){

for(var k in products){ 
	keys.push(k);
}
keys.sort();
console.log(keys);
};

function addToCart(productName) {
	if(products[productName].quantity > 0){
		if(cart.hasOwnProperty(productName)){
				cart[productName] +=1; 
		} 
		
		else{
				cart[productName] = 1;
		}

	products[productName].quantity -=1;
	totalPrice += products[productName].price;
	console.log(totalPrice);
	document.getElementById("showCart").textContent = "Cart ($" + totalPrice + ")"; 
	var x = document.getElementsByClassName("removeButton");
	for(var i =0; i<x.length; i++){
		x[keys[i]] = x[i];
		delete x[i];
	};
	
	var y = document.getElementsByClassName("addButton");
	for(var i =0; i<y.length; i++){
		//console.log("inside");
		y[keys[i]] = y[i];
		delete y[i];
	};
	
	var z = document.getElementsByClassName("centered");
	for(var i =0; i<z.length; i++){
		z[keys[i]] = z[i];
		delete z[i];
	};
	
	var a = document.getElementsByClassName("resizeCart");
	for(var i =0; i<a.length; i++){
		a[keys[i]] = a[i];
		delete a[i];
	};
		
	if(cart[productName]>0){
		console.log(x);
		x[productName].style.display = "flex";

	}
	
	if(products[productName].quantity == 0){
		console.log(y);
		y[productName].style.display = "none";
		z[productName].style.display = "block";
		a[productName].style.display = "none";

	}
	
	}
	resetTime();
};

function removeFromCart(productName) {
		if(cart.hasOwnProperty(productName)){
			if(cart[productName] > 1){
				cart[productName] -= 1;
			} else if(cart[productName] == 1){
				//console.log("inside ");
				delete cart[productName];
			}
			if (cart[productName] != 0) {
				products[productName].quantity +=1;
				totalPrice -= products[productName].price;
			}
			console.log(totalPrice);
		    document.getElementById("showCart").textContent = "Cart ($" + totalPrice + ")";
			
			var x = document.getElementsByClassName("removeButton");
			for(var i =0; i<x.length; i++){
				x[keys[i]] = x[i];
				delete x[i];
			};
	
	var y = document.getElementsByClassName("addButton");
		for(var i =0; i<y.length; i++){
			console.log("inside");
			y[keys[i]] = y[i];
			delete y[i];
		};
		
		var z = document.getElementsByClassName("centered");
		for(var i =0; i<z.length; i++){
		z[keys[i]] = z[i];
		delete z[i];
	};
	
	var a = document.getElementsByClassName("resizeCart");
	for(var i =0; i<a.length; i++){
		a[keys[i]] = a[i];
		delete a[i];
		};
		
	if(!(cart.hasOwnProperty(productName))){
		x[productName].style.display = "none";

		}
	
	if(products[productName].quantity > 0){
		//console.log(y);
		y[productName].style.display = "flex";
		z[productName].style.display = "none";
		a[productName].style.display = "block";
		
		}
	}
		
	console.log(cart);
		
	resetTime();
			
};

function showCart(){
	var output = "";
	var i = 0;
	var table = document.getElementById("cartTable");
	var carey = document.getElementById("total");

	// Delete each modal table's child nodes except total price row
	while (table.hasChildNodes()) {
		
		if (table.firstChild === table.lastChild)
			break;
		
		table.removeChild(table.firstChild);
		
	}
	
	// Create header node on table for product, quantity, add, remove and price
	var headerNode = document.createElement("tr");
	var one = document.createElement("th");
	var two = document.createElement("th");
	var three = document.createElement("th");
	var four = document.createElement("th");
	var five = document.createElement("th");
	
	one.innerHTML = "Product";
	two.innerHTML = "Quantity";
	three.innerHTML = "Add";
	four.innerHTML = "Remove";
	five.innerHTML = "Price";
	
	// Append children to header node
	headerNode.appendChild(one);
	headerNode.appendChild(two);
	headerNode.appendChild(three);
	headerNode.appendChild(four);
	headerNode.appendChild(five);
	
	// Insert node before total price node on table
	table.insertBefore(headerNode, table.lastChild);
	
	var abutton = {};
	var rbutton = {};
	
	// For each product in the cart...
	for (var productName in cart) {
		
		// If there are products in the cart...
		if (cart[productName] > 0) {
		
			// Create a table node for each of them (including children)
			var newNode = document.createElement("tr");
			var nom = document.createElement("td");
			var quant = document.createElement("td");
			var add = document.createElement("td");
			abutton[productName] = document.createElement("button");
			add.appendChild(abutton[productName]);
			var rem = document.createElement("td");
			rbutton[productName] = document.createElement("button");
			rem.appendChild(rbutton[productName]);
			var prix = document.createElement("td");
		
			nom.innerHTML = productName;
			quant.innerHTML = cart[productName];
			abutton[productName].innerHTML = "+";
			rbutton[productName].innerHTML = "-";
			prix.innerHTML = "$" + products[productName].price*cart[productName];
		
			// Add functionality for add and remove buttons
			buttons(productName, abutton, rbutton);
			
			// Append children to same node
			newNode.appendChild(nom);
			newNode.appendChild(quant);
			newNode.appendChild(add);
			newNode.appendChild(rem);
			newNode.appendChild(prix);
		
			// Insert this node before total price node in table DOM
			table.insertBefore(newNode, table.lastChild);
		}
		
	}
	
	// Compute price and update appropriate DOM ID
	computePrice();
	document.getElementById("totalPrice").innerHTML = "$" + totalPrice;
	
	resetTime();
	
	 // Modal code
	 
	var modal = document.getElementById('myModal');

	// Modal button
	var btn = document.getElementById("showCart");

	// Close modal
	var span = document.getElementsByClassName("close")[0];

	// Display modal when cart button is clicked
    modal.style.display = "block";

	span.onclick = function() {
		modal.style.display = "none";
		resetTime();
	} 

};

function buttons(product, put, take) {
	
	// Add addToCart and removeFromCart functionalities for appropriate buttons in modal
	put[product].addEventListener("click", function() {addToCart(product);
	showCart(); computePrice();});
	take[product].addEventListener("click", function() {removeFromCart(product);
	showCart(); computePrice();});
	
}

function computePrice() {
	
	totalPrice = 0;
	
	// Calculate total price for products in cart
	for (var a in cart) {
		totalPrice += products[a].price*cart[a];
	}
	
}

// Handle ESC key (key code 27)
document.addEventListener('keyup', function(e) {
	var modal = document.getElementById('myModal');
    if (e.keyCode == 27) {
		
		if (!(modal.style.display == "none")) {
			resetTime();
		}
		
        modal.style.display = "none";
    }
});

window.onload = function() {
var b= document.getElementById("checkout");
b.addEventListener("click", ajaxPostCheckout, false);
};