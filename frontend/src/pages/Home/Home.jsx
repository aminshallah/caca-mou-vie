import logo from './logo.svg';
import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Movie from '../../components/Movie/Movie.jsx';
import Movie2 from '../../components/Movie/Movie2.jsx';

function Home() {
  const [movieName, setMovieName] = useState('');
  const [movies, setMovies] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieDate, setNewMovieDate] = useState('');
  const [movieReco, setMovieReco] = useState([]);
  const [sortOption, setSortOption] = useState(null);
  const [fullscreenMovie, setFullscreenMovie] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const[topRated, setTopRated] = useState([]);

  const fetchMovies = () => {
    axios.get('http://localhost:8000/movies/')
      .then((response) => {
        setMovies(response.data);
      })
      .catch((err) => console.error(err));
  };

  const fetchTopRated = () => {
    const options = {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/top_rated',
      params: {language: 'en-US', page: '1'},
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
      }
    };
    
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setTopRated(response.data.results);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect ( () => {
    fetchTopRated();
  },[]);

  const fetchMoviesReco= ()=> {
    axios.get('http://localhost:8000/recommandation/1')
      .then((response) => {
        setMovieReco(response.data);
      })
      .catch((err) => console.error(err));

  };

  useEffect(() => {
    fetchMoviesReco();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies) {
      let sortedMovies = [...movies];
      if (sortOption === 'For you') {
        sortedMovies = movieReco;
      } else if (sortOption === 'A-Z') {
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOption === 'Z-A') {
        sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
      } else if (sortOption === 'Latest-releases') {
        sortedMovies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      }
      // Filtrer les films en fonction du nom
      const filtered = sortedMovies.filter((movie) =>
        movie.title && movie.title.toLowerCase().includes(movieName.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [movieName, movies, sortOption]);
  

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/movies/new', { title: newMovieTitle, date: newMovieDate })
      .then(response => {
        console.log(response.data);
        setNewMovieTitle('');
        setNewMovieDate('');
        fetchMovies();
        setShowAddForm(false);
      })
      .catch(error => console.error(error));
  };



  return (
    <div className="App">
      <header className="App-header">
      <div className="search-container">
  <span>Search a movie</span>
  <input
    id="name-input"
    value={movieName}
    onChange={(event) => setMovieName(event.target.value)}
    placeholder="Spiderman"
  />
</div>
        <h3 onClick={() => setShowAddForm(!showAddForm)} >Add a new movie</h3>
        {showAddForm&& (<form onSubmit={handleSubmit}>
              <label htmlFor="title">Title:</label>
              <input type="text" id="title" name="movie_title" value={newMovieTitle}
                onChange={(event) => setNewMovieTitle(event.target.value)} />
              <label htmlFor="date">Date:</label>
              <input type="text" id="date" name="movie_date" value={newMovieDate}
                onChange={(event) => setNewMovieDate(event.target.value)} />
              <button type="submit" className="button">Submit</button>

        </form>)}
        {!movieName&& (
        < div className = "reco">
          <h1>Best rated on TMDB</h1>
          <ul className="liste">
              {topRated.slice(0, 7).map((movie) => (
                <Movie2 key={movie.id} movie={movie} />
              ))}
            </ul>
        </div>)}

    {!movieName&& (
        < div className = "reco">
          <h1>Recommended for you</h1>
          <ul className="liste">
              {movieReco.slice(0, 7).map((movie) => (
                <Movie key={movie.id} movie={movie} />
              ))}
            </ul>
        </div>)}
        <div className = "movie-title">
        <h1>All movies</h1></div>
        <div className="deroul">
          <span>Sort by</span>
          <div>

            <input type="button" value="A-Z" onClick={() => setSortOption('A-Z')} />
            <input type="button" value="Z-A" onClick={() => setSortOption('Z-A')} />
            <input type="button" value="Latest-release" onClick={() => setSortOption('Latest-release')} />
            <input type="button" value="For you" onClick={() => setSortOption('For you')} />
          </div>
        </div>
        {movies && (
          <div className="movie-list">

            <ul className="liste">
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

