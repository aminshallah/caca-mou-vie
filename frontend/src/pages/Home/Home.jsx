import logo from './logo.svg';
import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Movie from '../../components/Movie/Movie.jsx';

function Home() {
  const [movieName, setMovieName] = useState('');
  const [movies, setMovies] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieDate, setNewMovieDate] = useState('');

  const useFetchMovies = () => {
    setMovies(null);
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
      },
    };
    axios
      .get(
        'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
        options
      )
      .then((response) => setMovies(response.data.results))
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    useFetchMovies();
  }, []);

  useEffect(() => {
    function Filtre(movies, search) {
      const n = search.length;

      return movies.filter(
        (movie) =>
          movie.title.substring(0, n).toLowerCase() === search.toLowerCase()
      );
    }

    if (movies) {
      setFilteredMovies(Filtre(movies, movieName));
    }
  }, [movieName, movies]);

  const handleSubmit = (event) =>{
    event.preventDefault();
    axios.post('http://localhost:8000/movies/new', {title : newMovieTitle, date : newMovieDate}).then(response => {
      console.log(response.data);
      setNewMovieTitle('');
      setNewMovieDate('');
      useFetchMovies();
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
        Cars
        <input
          id="name-input"
          value={movieName}
          onChange={(event) => setNewMovieName(event.target.value)}
        />
        <h3>Ajouter un nouveau film</h3>
        <form onSubmit={handleSubmit}>
  <ul>
    <li>
      <label for="title">Titre:</label>
      <input type="text" id="title" name="movie_title" value={newMovieTitle}
                onChange={(event) => setNewMovieTitle(event.target.value)}/>
    </li>
    <li>
      <label for="date">Date:</label>
      <input type="text" id="date" name="movie_date" value={newMovieDate}
                onChange={(event) => setNewMovieDate(event.target.value)}/>
    </li>
    <li class = "button">
      <button type = "submit"> Submit</button>
    </li>
  </ul>
</form>
        <p id="movie-name-print"> {movieName}</p>
        {movies && (
          <div>
            <h3>Movie List:</h3>
            <ul class="liste">
              {filteredMovies.map((movie) => (
                <Movie key={movie.id} movie={movie} />
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default Home;
