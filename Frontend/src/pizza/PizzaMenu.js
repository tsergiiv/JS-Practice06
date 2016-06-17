/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

var $all = $("#all");
var $seafood = $("#seafood");
var $meat = $("#meat");
var $pineapple = $("#pineapple");
var $mushroom = $("#mushroom");
var $vega = $("#vega");

var $n = 0;
var $type = $("#type");
var $count = $("#count");

$all.click(function(){
	filterPizza("cheese");
	$type.text("Усі піци");
});

$seafood.click(function(){
	filterPizza("ocean");
	$type.text("Піци з морепродуктами");
});

$meat.click(function(){
	filterPizza("meat");
	$type.text("М'ясні піци");
});

$pineapple.click(function(){
	filterPizza("pineapple");
	$type.text("Піци з ананасами");
});

$mushroom.click(function(){
	filterPizza("mushroom");
	$type.text("Піци з грибами");
});

$vega.click(function(){
	filterPizza("tomato");
	$type.text("Вегетаріанські піци");
});

$('.nav li').click(function() {

	$('.nav li').removeClass('active');

	var $this = $(this);
	if (!$this.hasClass('active')) {
		$this.addClass('active');
	}
});



//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        //pizza_shown.push(pizza);
		if(filter in pizza.content){
			pizza_shown.push(pizza);
			$n++;
		}
        //TODO: зробити фільтри
    });
	
	$count.text($n);
	$n = 0;
	
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;