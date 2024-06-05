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


  const fetchMovies = () => {
    axios.get('http://localhost:8000/movies/').then((response) =>{
      setMovies(response.data);
    }).catch((err) => console.error(err))
  }

  useEffect(() => {
    fetchMovies();
  }, []);
  

  useEffect(() => {
    if (movies) {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(movieName.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [movieName, movies]);

  const handleSubmit = (event) =>{
    event.preventDefault();
    axios.post('http://localhost:8000/movies/new', {title : newMovieTitle, date : newMovieDate}).then(response => {
      console.log(response.data);
      setNewMovieTitle('');
      setNewMovieDate('');
      fetchMovies();
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        Cars
        <input
          id="name-input"
          value={movieName}
          onChange={(event) => setMovieName(event.target.value)}
        />
        <p>{movieName}</p>
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
