/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');
	var API = require('./API');


	
	/********************************
	*								*
	*          Google Maps			*
	*								*
	********************************/
	
	function initialize() {
		//Тут починаємо працювати зкартою
		var directionsDisplay = new google.maps.DirectionsRenderer();
		
		var mapProp = { 
			center:	new	google.maps.LatLng(50.464379,30.519131),
			zoom: 13 
		}; 
		var html_element = document.getElementById("googleMap");
		var map	= new google.maps.Map(html_element,	mapProp); 
		directionsDisplay.setMap(map);
		//Карта створена і показана
		
		var point = new	google.maps.LatLng(50.464379,30.519131);
		var marker = new google.maps.Marker({ 
			position: point,
			map: map, 
			icon: "assets/images/map-icon.png" 
		});
		
		var home = new google.maps.Marker({ 
			position: null,
			map: map, 
			icon: "assets/images/home-icon.png" 
		});
		
		function calculateRoute(A_latlng, B_latlng) { 
			var directionService = new	google.maps.DirectionsService();
			directionService.route({ 
				origin: A_latlng, 
				destination: B_latlng, 
				travelMode:	google.maps.TravelMode["DRIVING"]
			}, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
				  directionsDisplay.setDirections(response);
				  directionsDisplay.setOptions( { suppressMarkers: true } );
				  $('#timeDeliver').text(response.routes[0].legs[0].duration.text);
				  $('#addressFields').removeClass("has-error");
				  $('#addressFields').addClass("has-success");
				} else {
				  $('#addressFields').removeClass("has-success");
				  $('#addressFields').addClass("has-error");
				}
			}); 
		}
		
		$('#addressInput').keyup(function(){
			var inputAddress = $('#addressInput').val();
			geocodeAddress(inputAddress, function(err, coordinate){ 
				if(!err) { 
					//Дізналися адресу 
					console.log(coordinate); 
					calculateRoute(point, coordinate);
					home.setPosition(coordinate);
					$('#addressDeliver').text(inputAddress);
					$('#addressFields').removeClass("has-error");
					$('#addressFields').addClass("has-success");
				} else { 
					console.log("Немає адреси на карті"); 
					$('#addressDeliver').text("невідома");
					$('#timeDeliver').text("невідомий");
					$('#addressFields').removeClass("has-success");
					$('#addressFields').addClass("has-error");
				}
			})
		});
		
		google.maps.event.addListener(map, 'click',function(me){ 
			var coordinates	= me.latLng; 
			geocodeLatLng(coordinates, function(err, adress){ 
				if(!err) { 
					//Дізналися адресу 
					console.log(adress); 
					calculateRoute(point, coordinates);
					home.setPosition(coordinates);
					$('#addressInput').val(adress);
					$('#addressDeliver').text(adress);
				} else { 
					console.log("Немає адреси"); 
					
				} 
			}) 
		});
	}
	
	function geocodeLatLng(latlng, callback){ 
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'location': latlng}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK&&	results[1])	{
				var adress = results[1].formatted_address;
				callback(null,	adress); 
			} else { 
				callback(new Error("Can't find adress"));
			} 
		}); 
	}
	
	function geocodeAddress(address, callback) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'address': address}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK && results[0])	{
				var coordinates	= results[0].geometry.location;
				callback(null, coordinates); 
			} else {
				callback(new Error("Can	not	find the adress")); 
			} 
		}); 
	}

	google.maps.event.addDomListener(window, 'load', initialize);
	
	
	/********************************
	*								*
	*             LiqPay   			*
	*								*
	********************************/
	
	function base64(str) { 
		return new Buffer(str).toString('base64'); 
	}
	
	var crypto = require('crypto'); 
	
	function sha1(string) { 
		var sha1 = crypto.createHash('sha1'); 
		sha1.update(string); 
		return sha1.digest('base64'); 
	}
	
    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
	
	function createOrder(callback) {
		var nameCustomer = $('#nameInput').val();
		var phoneCustomer = $('#phoneInput').val();
		var addressCustomer = $('#addressInput').val();
		var priceCustomer = PizzaCart.getSum();
		var pizzaCustomer = PizzaCart.getPizzaInCart();
		
		var customer_data = {
			name: nameCustomer,
			phone: phoneCustomer,
			address: addressCustomer,
			payAmount: priceCustomer,
			pizza_list: pizzaCustomer
		}
		
		API.createOrder(customer_data, function(err, user_data){ 
			if(!err) { 
				callback(null, user_data);
			} else {
				return	callback(err);
			}
		});
	}
	
	$(".postButton").click(function(){
		
		createOrder(function(err, user_data) { 
			if(err)	{ 
				return callback(err); 
			}
			
			LiqPayCheckout.init({
				data: user_data.data,
				signature: user_data.signature,
				embedTo: "#liqpay_checkout",
				mode: "popup" // embed || popup
			}).on("liqpay.callback", function(data){
				console.log(data.status);
				console.log(data);
			}).on("liqpay.ready", function(data){
				// ready
			}).on("liqpay.close", function(data){
				// close
			});
	        
		});
	});
});