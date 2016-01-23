$(document).ready(function () {

	$(function (){

		var $users = $(".users");
		var $albums = $(".albums_wrapper");
		var $photos = $(".thumbnail_photos");
		var $large_photo = $(".large_photo");
		var $users_error = $(".users_error"), $albums_error = $(".albums_error"), $photos_error = $(".photos_error");
		var $users_loading = $(".users_loading"), $albums_loading = $(".albums_loading"), $photos_loading = $(".photos_loading");

		function set_active_state (selected) {
			selected.addClass('clicked').siblings().removeClass('clicked');
		}

		function fetch_users(success_callback) {
			$.ajax({
			    type: "GET",
			    url: "http://jsonplaceholder.typicode.com/users",
			    success: success_callback,
			    error: function() {
			    	$users_error.show();
			    },
			    beforeSend: function() {
			    	$users_loading.show();
			    },
			    complete: function() {
			    	$users_loading.hide();
			    }
			});
		}

		function fetch_albums(user_id, success_callback) {
			$.ajax({
			    type: "GET",
			    url: "http://jsonplaceholder.typicode.com/users/"+ user_id +"/albums",
			    success: success_callback,
			    error: function() {
			    	$albums_error.show();
			    },
			    beforeSend: function() {
			    	$albums.html("");
			    	$albums_loading.show();
			    },
			    complete: function() {
			    	$albums_loading.hide();
			    }
			});
		}

		function fetch_photos(album_id, success_callback) {
			$.ajax({
			    type: "GET",
			    url: "http://jsonplaceholder.typicode.com/albums/"+ album_id +"/photos",
			    success: success_callback,
			    error: function() {
			    	$photos_error.show();
			    },
			    beforeSend: function() {
			    	$photos.html("");
			    	$photos_loading.show();
			    },
			    complete: function() {
			    	$photos_loading.hide();
			    }
			});
		}


		/* LOADING USERS */

		fetch_users(function success_callback(users) {

			var $all_users = $("<ul>").addClass("users_content");

			$.each(users, function(i, user) { 				
				var $name = $("<p>").html(user.name);
				var $email = $("<p>").html(user.email);
				var $company = $("<p>").html(user.company.name);
				var $user = $("<li>")
									.data("id", user.id)
									.append($name)
									.append($email)
									.append($company);

				$all_users.append($user); 
			});
			$users.append($all_users);
		});


		/* LOADING ALBUMS BY CLICKING ON THE SPECIFIC USER */

		var previous_user_id = "";

		$users.on("click","li", function() {
			var user_id = $(this).data("id");

			if (previous_user_id !== user_id) {		/* checking if we are already looking albums of this user  */
				
				previous_user_id = user_id;
				set_active_state($(this));	

				$photos.hide();						/* hiding photos if we change user */
				$large_photo.hide();				/* hiding large photo if we change user */

				fetch_albums(user_id, function success_callback(albums) {
					
					var $all_albums = $("<ul>")
											   .addClass("albums");
					$.each(albums, function(i, album) { 
						$album = $("<li>")
										  .data("id", album.id)
										  .html(album.title);

						$all_albums.append($album);
					});
					$albums.html($all_albums);

				});				
			}

		});


		/* LOADING PHOTOS BY CLICKING ON THE SPECIFIC ALBUM */

		var previous_album_id = "";

		$albums.on("click","li", function() {
			var album_id = $(this).data("id");

			if (previous_album_id !== album_id) {		/* checking if we are already looking photos from this album  */
				
				previous_album_id = album_id;				
				set_active_state($(this));

				$large_photo.hide();					/* hiding large photo if we change album */				

				fetch_photos(album_id, function success_callback(photos) {

					var $images_container = $("<div>");

					$.each(photos, function(i, photo) {
						var $image = $("<img>")
					                          .addClass("img-responsive")
					                          .data("id", photo.id)
					                          .data("url", photo.url)
					                          .data("title", photo.title)
					                          .attr("src", photo.thumbnailUrl);
			            $images_container.append($image);
			        });

					var $photos_title = $("<h3>").text("Photos");
					$photos.append($photos_title).append($images_container).show();

				});	

				
			}
		});


		/* SHOWING BIG PHOTO BY CLICKING ON THE SPECIFIC THUMBNAIL PHOTO */ 
		
		var previous_photo_id = "";

		$photos.on("click","img", function() {
			
			var photo_data = $(this).data();			/* fetching all data from the selected photo */

			var photo_id = photo_data.id;			
			var photo_title = photo_data.title;
			var photo_url = photo_data.url;			

			if (previous_photo_id !== photo_id) {		/* checking if we are already looking this photo from photos list  */
			
				previous_photo_id = photo_id;
				set_active_state($(this));

				$large_photo.show();
				$large_photo.find('h3').text(photo_title);
				$large_photo.find('img').attr('src', photo_url)
										.addClass("img-responsive");
			}
			
		});

			
	});
});

