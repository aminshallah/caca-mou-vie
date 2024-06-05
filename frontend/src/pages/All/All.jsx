import {useEffect, useState} from 'react'
import './All.css'
import axios from 'axios'
import Movie from '../../components/Movie/Movie.jsx';

function All(){
  const [movies, setMovies] = useState(null);
  const [movieName, setMovieName] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  const useFetchMovies = () => {
      setMovies(null) ;

      axios.get('http:localhost:8000/movies/').then((response) => setMovies(response.data.results)).then((response) => console.log(response)).catch((err => console.error(err)))
  }
  
  useEffect(()=>{
    useFetchMovies();
  }, []);

/*   useEffect(() => {
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
  }, [movieName, movies]); */


  return(
    <div className = "All-container">
      <h1>CacaMouvie</h1>
      <div> 
        <h2> Rechercher un film </h2>
        <input
          id="name-input"
          value={movieName}
          onChange={(event) => setMovieName(event.target.value)}
        />
        <h3>{movieName}</h3>

        <h2>Tous les films</h2>

        <p id="movie-name-print"> {movieName}</p>
        {movies && (
          <div>
            <h3>Movie List:</h3>
            <ul class="liste">
              {movies.map((movie) => (
                <Movie key={movie.id} movie={movie.titre} />
              ))}
            </ul>
        </div>
        )}

    </div>
    </div>
  )
}

export default All;