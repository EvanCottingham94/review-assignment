$(function() {
	Parse.initialize("DpdBXQYnm4ws0Ou0fejJ5yKS7f9VGNDgSax0Hppx", "0XdtaZ0twcsn27QVXRbHNqMIVBYgFGAhhutrbEz9");
	 
	var Review = Parse.Object.extend('Review');

	$('#stars').raty({ path: 'raty-2.7.0/lib/images'});

	// Click event when form is submitted
	$('form').submit(function() {
		// sets key value pairs in parse for user input components of a review
		var review = new Review();
		review.set("title", $('#title').val());
		review.set("review", $('#review').val());
		review.set("stars", $('#stars').raty("score"));
		review.set("upvotes", 0);
		review.save(null, {
			success:getData
		})
	})

	// Write a function to get data
	var getData = function() {
		var query = new Parse.Query(Review);
		
		query.find({
			success:function(d) {
				buildList(d);
			}
		})
	}

	// A function to build your list
	var buildList = function(data) {
		// Empty out your ordered list, initialize counts for total stars between all reviews and total reviews
		$('ol').empty();
		var count = 0;
		var total = 0;
		
		// Loop through your data, and pass each element to the addItem function, increment stars count and total reviews count
		data.forEach(function(d){
			addItem(d);
			count++;
			if(d.get('stars') != undefined){
				total += d.get('stars');
			} 	
		})
		var average = total / count;
		$('#avgRating').raty({readOnly: true, score: average, path: 'raty-2.7.0/lib/images'});
		$('#avgRating').append('<p id = "totalRev">' + count + ' reviews </p>');
	}

	// This function takes in an item, adds it to the screen
	var addItem = function(item) {
		// Get parameters (website, band, song) from the data item passed to the function
		
		var revTitle = item.get('title');
		var revDescrip = item.get('review');
		var numStars = item.get('stars');

		//rating set to '0 stars' if user does not input a star rating
		if(numStars == undefined){
			numStars = 0;
		}
		
		var div = $('<div id = "bigWell" class = well well-sm><h3>' + revTitle + '</h3><div id = "smallWell" class = well well-sm>' + revDescrip + '</div></div>');
		
		// Append li that includes text from the data item
		var li = $('<li></li>');
		
		// Create a button with a <span> element (using bootstrap class to show the X)
		var thumbDown = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-thumbs-down"></span></button>');
		var thumbUp = $('<button class="btn-success btn-xs"><span class="glyphicon glyphicon-thumbs-up"></span></button>');

		//display stars of the review
		var divStar = $("<div id = 'divStar'></div>");
		var revStar = divStar.raty({readOnly: true, score: numStars});
		
		// check how many upvotes a review has so that message is gramatically correct (cannot go below zero)
		if(item.get('upvotes') < 0){
			var numUpvotes = 0;	
			div.prepend('<p class = "lead"> the majority of people found this unhelpful!</p>');
		} else if(item.get('upvotes') == 1){
			var numUpvotes = item.get('upvotes');
			div.prepend('<p class = "lead"> ' + numUpvotes + ' like!</p>');
		} else {
			var numUpvotes = item.get('upvotes');
			div.prepend('<p class = "lead"> ' + numUpvotes + ' likes!</p>');
		}
		
		// Append everything to list of reviews
		div.prepend(revStar);
		div.append(thumbDown);
		div.append(thumbUp); 
		li.append(div);
		$('ol').prepend(li);
		
		// Click function to count 'upvotes' of a review
		thumbUp.click(function() {
			item.increment("upvotes");
			item.save();
			location.reload();
		})
		
		thumbDown.click(function() {
			item.increment("upvotes", -1);
			item.save();
			location.reload();
		})
	}
	// Call your getData function when the page loads
	getData();
});
