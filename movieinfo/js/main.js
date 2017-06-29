$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    // Hide the slide-show when user enters the search
    $(".carousel").hide();
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText){
  // Here we're searching the movie by its title from the database
  axios.get('https://api.themoviedb.org/3/search/movie?api_key=a31b982ce4158307feeee8704b10318b&query='+searchText)
    .then((response) => {
      console.log(response);
      // This will get the Array of Movies that the API send back when user searches with some term
      let movies = response.data.results;
      let output = '';
      
      $.each(movies, (index, movie) => {
        // Save the images of different Movie Posters
        var posterImg = "https://image.tmdb.org/t/p/w185"+ movie.poster_path;
        // Made the 'output' variable to be able to append all the following data together
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${posterImg}">
              <h5>${movie.title}</h5>
              <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });
      // Print all the movies from user's search
      $('#movies').html(output);
    })
    // Runs in case of an error
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id){
  // To pass data from one page to another, we are using Session Storage here. The movie ID passed will be saved here.
  sessionStorage.setItem('movieId', id);
  // Redirect to the new page
  window.location = 'movie.html';
  return false;
}

function getMovie(){
  // Get the ID from Session Storage and save it in a variable
  let movieId = sessionStorage.getItem('movieId');
  // Here we're searching the movie by its ID from the database
  axios.get('https://api.themoviedb.org/3/movie/'+ movieId +'?api_key=a31b982ce4158307feeee8704b10318b')
    .then((response) => {
      console.log(response);
      let movie = response.data;
      // Save the Movie's Poster
      var posterImg = "https://image.tmdb.org/t/p/w185"+ movie.poster_path;

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${posterImg}" class="thumbnail">

          </div>
          <div class="col-md-8">
            <h2>${movie.title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Tagline:</strong> ${movie.tagline}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.release_date}</li>
              <li class="list-group-item"><strong>Runtime:</strong> ${movie.runtime} min</li>
              <li class="list-group-item"><strong>Vote Average:</strong> ${movie.vote_average}</li>
              <li class="list-group-item"><strong>No. of Votes:</strong> ${movie.vote_count}</li>
              <li class="list-group-item"><strong>Genre:   </strong> ${movie.genres[0].name}</li>
              <li class="list-group-item"><strong>Revenue:</strong> ${movie.revenue} USD</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.overview}
            <hr>
            <a href="http://imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">View on IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;
      // Displays all the Movie Info
      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}