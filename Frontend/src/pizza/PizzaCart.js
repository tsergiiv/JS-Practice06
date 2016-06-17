/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $(".orders");

var Storage	=	require('../storage/storage');

var clearCart = $(".titleRight");

var amountOfAllPizza = 0;

var $counter = $("#amountAllPizza");

var totalSumOfOrder = $("#totalSumOfOrder");

var $countSum = 0;

var regName = /^[іІА-Яа-я]+$/;

var regPhone = /^(\+380[0-9]{9}|0[0-9]{9})$/;

$('#phoneInput').keyup(function(){
	if(regPhone.test($('#phoneInput').val())){
		$('#phoneFields').removeClass('has-error');
		$('#phoneFields').addClass('has-success');
		$('.phoneError').hide();
	} 
	else {
		$('#phoneFields').removeClass('has-success');
		$('#phoneFields').addClass('has-error');
		$('.phoneError').show();
	}
});

$('#nameInput').keyup(function(){
	if(regName.test($('#nameInput').val())){
		$('#nameFields').removeClass('has-error');
		$('#nameFields').addClass('has-success');
		$('.nameError').hide();
	} 
	else {
		$('#nameFields').removeClass('has-success');
		$('#nameFields').addClass('has-error');
		$('.nameError').show();
	}
});

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
	var is = false;
	for(var i = 0; i < Cart.length; i++){
		if(Cart[i].size == size && Cart[i].pizza.id == pizza.id){
			amountOfAllPizza++;
			Cart[i].quantity++;
			is = true;
			break;
		}
	}

	if(is == false){
		amountOfAllPizza++;
		
		Cart.push({
			pizza: pizza,
			size: size,
			quantity: 1
		});
	}
	
	$countSum += pizza[size].price;
	
    updateCart();
}

function removeFromCart(cart_item) {
	var index = Cart.indexOf(cart_item);
	
	Cart.splice(index, 1);
	Storage.set("cart",	Cart);
	
	$countSum -= cart_item.pizza[cart_item.size].price*cart_item.quantity;
	amountOfAllPizza -= cart_item.quantity;
	
    updateCart();
}

function initialiseCart() {
	var saved_orders = Storage.get("cart");
	if(saved_orders) { 
		$('.no-orders').hide();
		Cart = saved_orders; 
	}
    updateCart();
	console.log(Cart);
}

function getPizzaInCart() {
    return Cart;
}

function getSum() {
    return $countSum;
}

function recount() {
	amountOfAllPizza = 0;
	$countSum = 0;
	
	for(var i=0; i < Cart.length; i++){
		amountOfAllPizza += Cart[i].quantity;
		$countSum += amountOfAllPizza * Cart[i].pizza[Cart[i].size].price;
	}
}

function updateCart() {
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);
		
		var $money = $node.find(".amountPrice");

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
			amountOfAllPizza++;
			$countSum += cart_item.pizza[cart_item.size].price;
            $money.hide();
            updateCart();
        });
		
		$node.find(".minus").click(function(){
            cart_item.quantity -= 1;
			$money.show();
			$countSum -= cart_item.pizza[cart_item.size].price;
			amountOfAllPizza--;
			
			if(cart_item.quantity == 0)
				removeFromCart(cart_item);
			
            updateCart();
        });
		
		$node.find(".delete").click(function(){
            removeFromCart(cart_item);
        });
		
		if((cart_item.quantity % 10) == 1){
			$node.find(".pizzaAmountName").text(" піца");
		} else {
			if((cart_item.quantity % 10) > 4){
				$node.find(".pizzaAmountName").text(" піц");
			} else {
				$node.find(".pizzaAmountName").text(" піци");
			}
		}
		
        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
	
	recount();
	
	$counter.text(amountOfAllPizza);
	
	if($('#changeOrder').text() == "Редагувати замовлення"){
		$('.quantity').addClass('addMargin');
		$('.pizzaAmountName').show();
		$('.plus').hide();
		$('.minus').hide();
		$('.delete').hide();
		$('.orders').addClass('changeHeight');
	}
	
	if(amountOfAllPizza == 0){
		$('.no-orders').show();
		$('.no-orders').show();
		$('#orderPriceBox').hide();
		$('#makeOrder').addClass('disabled');
		$('.orders').removeClass('changeHeight');
	} else {
		$('#orderPriceBox').show();
		$('.no-orders').hide();
		$('.orders').addClass('changeHeight');
		$('#makeOrder').removeClass('disabled');
	}
	
	clearCart.click(function(){
		$countSum = 0;
		Cart = [];
		
		updateCart();
	});
	
	totalSumOfOrder.text($countSum);
	Storage.set("cart",	Cart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;
exports.getSum = getSum;

exports.PizzaSize = PizzaSize;