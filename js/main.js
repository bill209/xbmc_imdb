/*
	/m = load movies from tmdb
	/b = load buyers
*/

var app = angular.module('xbmcAdmin', ['ngRoute']);
var fbBadMovies = 'https://boiling-fire-3340.firebaseio.com/badMovies/';
var fbMad = 'https://boiling-fire-3340.firebaseio.com/mad/';
var XBMC_MOVIES = 'd/3movies_da.json';
//tmdb api: 30 requests / 10 seconds
var RT_DELAY = 401;

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/m', {
        templateUrl: 'views/loadTMDB.html',
        controller: 'loadMoviesCtrl'
      }).
      when('/b', {
        templateUrl: 'views/loadBuyers.html',
        controller: 'buyersCtrl'
      }).
      otherwise({
        redirectTo: '/m'
      });
  }]);

app.controller('mainCtrl', function mainCtrl($scope, $location){
	$scope.ctr = 0;
	$scope.data = {};
	$scope.badMovies = {};
	$scope.data.xbmc = {};
	var d = new Date();
	$scope.loadDate  = d.getFullYear() + '/' + (('0' + d.getMonth()).slice(-2)) + '/' + (('0' + d.getDate()).slice(-2));
	$scope.loadDate = '2014/01/01';
	$scope.test = 'xxx';
});

/*
	loads movies from json file into FB
	input: d/movies.json
	output: https://boiling-fire-3340.firebaseio.com/m/
*/
app.controller('loadMoviesCtrl', function buyersCtrl($scope,xbmcFactory,tmdbFactory,firebaseFactory){

	$scope.loadMovies = function() {
		var promise = xbmcFactory.getMovies2(XBMC_MOVIES);
		promise.then(function(movieData){
console.log('movieData',movieData);
			$scope.data = movieData;
			looper(movieData);
		});
	};
	var looper = function(xmovies){
		i = 0;
		var loopit = function(zmovies, i){
			var promise2 = tmdbFactory.getMovie(zmovies[i].title);
			var loadDate = new Date();
			promise2.then(function(tmdbMovies){
				if(!tmdbMovies.error){
					var m = [], tmdbId = tmdbMovies.results[0].id;
					m['tmdbId'] = tmdbId;
					m['title'] =	tmdbMovies.results[0].original_title;
					m['original_title'] =	tmdbMovies.results[0].original_title;
					m['results'] = tmdbMovies.total_results;
					m['adult'] =	tmdbMovies.results[0].adult;
					m['fanart'] = {};
					m['fanart']['backdrop_path'] =	tmdbMovies.results[0].backdrop_path;
					m['fanart']['poster_path'] =	tmdbMovies.results[0].poster_path;
					m['popularity'] =	tmdbMovies.results[0].popularity;
					m['release_date'] =	tmdbMovies.results[0].release_date;
					m['vote_average'] =	tmdbMovies.results[0].vote_average;
					m['vote_count'] =	tmdbMovies.results[0].vote_count;
					m['owners'] = {'bill':true};
					m['date_added']= zmovies[i].dateadded;
					$scope.data[i] = m;
					firebaseFactory.addMovie2(m);
				} else {
					$scope.data[i] = {'error': tmdbMovies.error, 'title' : tmdbMovies.title};
					$scope.badMovies[i] = {'title':tmdbMovies.title};
					var result = firebaseFactory.addBadMovie({'title':tmdbMovies.title});
console.log('result',result);
				}
				$scope.ctr ++;

				if(++i < zmovies.length){
					setTimeout(function(){loopit(zmovies, i)}, RT_DELAY);
				} else {
					console.log('finished');
				}
			},
			function(error){
				console.log('eRROR: ',e);
			});
		};
		loopit(xmovies,i);
	};
});

app.controller('buyersCtrl', function buyersCtrl($scope){

});


