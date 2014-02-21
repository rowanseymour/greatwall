var _ = require('underscore');

var MAX_PEOPLE = 1000000;
var BIG_SOUP_FEEDS = 4;
var MED_SOUP_FEEDS = 2;

/**
 * Generates an order of lunch
 * @param menu the menu
 * @param numPeople the number of people
 */
function generateOrder(menu, numPeople) {
	var numBigSoups = Math.floor(numPeople / BIG_SOUP_FEEDS);
	var numMedSoups = Math.floor((numPeople - (numBigSoups * BIG_SOUP_FEEDS)) / MED_SOUP_FEEDS);
	var numStaples, numMains;

	if (numPeople <= 2) {
		// You can't really have a Chinese without a main and a staple
		numStaples = numMains = 1;
	}
	else {
		// This is up for debate...
		numStaples = Math.floor(numPeople * 0.4);
		numMains = numPeople - numStaples;
	}

	// Ideal number of plates per dish - wouldn't want to have to split one dish between too many people
	var platesPerDish = Math.ceil(numPeople * 0.25);

	// Clone menu sections as we'll be removing items as they are ordered
	var soups = _.clone(menu.soups);
	var staples = _.clone(menu.staples);
	var mains = _.clone(menu.mains);

	var order = [];

	var randomSoup = popRandomItem(soups);
	if (numBigSoups > 0) {
		order.push(orderItem(randomSoup, 'big', numBigSoups));
	}
	if (numMedSoups > 0) {
		order.push(orderItem(randomSoup, 'med', numMedSoups));
	}

	while (numStaples > 0) {
		var numOfDish = Math.min(numStaples, platesPerDish);
		order.push(orderItem(popRandomItem(staples), null, numOfDish));
		numStaples -= numOfDish;
	}

	while (numMains > 0) {
		var numOfDish = Math.min(numMains, platesPerDish);
		order.push(orderItem(popRandomItem(mains), null, numOfDish));
		numMains -= numOfDish;
	}

	return order;
}

/**
 * Constructs an order for a single menu item
 */
function orderItem(item, size, quantity) {
	var o = {
		item: { code: item.code, name: item.name },
		quantity: quantity
	};

	if (size) {
		o.size = size;
	}
	return o;
}

/**
 * Pops a random item from the given collection
 */
function popRandomItem(items) {
	var index = randomInt(0, items.length);
	var item = items[index];
	items.splice(index, 1);
	return item;
}

/**
 * Generates a random integer x where min <= x < max
 */
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Converts an order to an SMS friendly representation
 */
function smsify(order) {
	var simpleOrders = _.map(order, function(o) {
		return o.item.code + (o.size ? (" [" + o.size + "]") : "") + " => " + o.quantity;
	});
	return simpleOrders.join("\n");
}

function errorResponse(res, message) {
	res.statusCode = 400;
	res.send({ message: message });
}

/**
 * GET generate order
 */
exports.generate = function(req, res, next, menu) {
	var numPeople = parseInt(req.param('people'));
	var format = req.param('format');

	if (!numPeople || numPeople <= 0) {
		errorResponse(res, "Number of people must be a positive integer");
	}
	else if (numPeople > MAX_PEOPLE) {
		errorResponse(res, "Number of people must be less than " + MAX_PEOPLE);
	}
	else {
		var order = generateOrder(menu, numPeople);
		var output = (format == 'sms') ? smsify(order) : order;

		res.send(output);
	}
};