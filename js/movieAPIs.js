app.factory('xbmcFactory', function($q, $http) {
	return {
		getMovies2: function(movies){
			var deferred = $q.defer();
			$http
				.get(movies)
				.then(function(d){
					deferred.resolve(angular.fromJson(d.data.result.movies));
				});
			return deferred.promise;
		}
	};
});

app.factory('tmdbFactory', function ($q, $http) {
	var APIKEY =  '829f2c4b8c9c5304ea86fc7cf47b1053';
	var tmdbLinks = {
		"getMovieByName" :  "http://api.themoviedb.org/3/search/movie?api_key=829f2c4b8c9c5304ea86fc7cf47b1053&query=[movietitle]&callback=JSON_CALLBACK"
//		&append_to_response=releases,trailers
	};
	return {
		getMovie: function(movie) {
			var deferred = $q.defer();
			var findMovie = tmdbLinks.getMovieByName.replace('[movietitle]', movie.replace(' ','+'));
			var x = $http
				.jsonp(findMovie)
				.success(function(d) {
					if(d.total_results > 0){
						deferred.resolve(d);
					} else {
						deferred.resolve({'error':'no record found', 'title' : movie});
					};
				})
				.error(function(d){
					console.log('error: ',d);
					deferred.reject(d);
				});
			return deferred.promise;
		}
	};
});
