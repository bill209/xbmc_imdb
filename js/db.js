app.factory('firebaseFactory', function ($q, $http) {
	return {
		addMovie2: function(data){
		//data (all info from tmdb): + xbmcID
		// 	{from tmdb: id, adult, backdrop_path, original_title, release_date, poster_path:, popularity, title, vote_average:, vote_count}
			var fb = new Firebase(fbMad + data.tmdbId);
			fb.set (data, function(error){
				if(error){
					console.log({'error adding a movie to FB':error});
				}
			});
		},
		addBadMovie: function(data){
		//	data (title)
			var fb = new Firebase(fbBadMovies + data.title);
			fb.set (data, function(error){
				if(error){
					console.log({'error adding a bad movie to FB':error});
				}
			});
		}
	 }
});


