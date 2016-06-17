/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);
	
	function base64(str) { 
		return new Buffer(str).toString('base64'); 
	}
	
	var crypto = require('crypto'); 
	function sha1(string) { 
		var sha1 = crypto.createHash('sha1'); 
		sha1.update(string); 
		return sha1.digest('base64'); 
	}
	
	var description = "Замовлення піци: " + order_info.name + " \n" + 
		"Адреса доставки: " + order_info.address + " \n" +
		"Телефон: " + order_info.phone + " \n" + 
		"Замовлення: " + "\n";
	
	for(var i = 0; i < order_info.pizza_list.length; i++){
		description += "- " + order_info.pizza_list[i].quantity + "шт. [";
		if (order_info.pizza_list[i].size == "small_size") {
			description += "Мала] " + order_info.pizza_list[i].pizza.title + ";"
		} else {
			description += "Велика] " + order_info.pizza_list[i].pizza.title + ";"
		}
		description += "\n";
	}
	
	description += " \n" + "Разом: " + order_info.payAmount + "грн";

	console.log(description);
		
	var order =	{ 
		version: 3, 
		public_key:	"i22236206117", 
		action:	"pay", 
		amount:	order_info.payAmount, 
		currency: "UAH", 
		description: description, 
		order_id: Math.random(),
		sandbox: 1
	};
	
	var data = base64(JSON.stringify(order)); 
	var signature =	sha1("sbetiztfkIS0y2qqN8BKgigrL67EZyEQ6fHUFm6t" + data + "sbetiztfkIS0y2qqN8BKgigrL67EZyEQ6fHUFm6t");

    res.send({
        success: true,
		data: data,
		signature: signature
    });
};