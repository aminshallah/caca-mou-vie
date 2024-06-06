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
  const [sortOption, setSortOption] = useState(null);
  const [fullscreenMovie, setFullscreenMovie] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchMovies = () => {
    axios.get('http://localhost:8000/movies/')
      .then((response) => {
        setMovies(response.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies) {
      let sortedMovies = [...movies];
      // Tri des films en fonction de l'option sélectionnée
      if (sortOption === 'genre') {
        const sortMoviesByGenre = (movies) => {
          // Copie des films pour ne pas modifier l'original
          let sortedMovies = [...movies];
          // Création d'un ensemble de genres uniques
          const uniqueGenres = [...new Set(sortedMovies.map(movie => movie.genre))];
          // Tri des genres par ordre alphabétique
          uniqueGenres.sort((a, b) => a.localeCompare(b));
          // Tri des films en fonction des genres triés
          sortedMovies.sort((a, b) => {
            const genreA = a.genre.toLowerCase();
            const genreB = b.genre.toLowerCase();
            const indexA = uniqueGenres.indexOf(genreA);
            const indexB = uniqueGenres.indexOf(genreB);
            return indexA - indexB;
          });
          return sortedMovies;
        };
        sortedMovies = sortMoviesByGenre(sortedMovies);
      } else if (sortOption === 'A-Z') {
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOption === 'Z-A') {
        sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
      } else if (sortOption === 'dernieres-sorties') {
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
  <span>Rechercher un film</span>
  <input
    id="name-input"
    value={movieName}
    onChange={(event) => setMovieName(event.target.value)}
    placeholder="Entrez le nom du film..."
  />
</div>
        <p>{movieName}</p>
        <h3 onClick={() => setShowAddForm(true)} >Ajouter un nouveau film</h3>
        {showAddForm&& (<form onSubmit={handleSubmit}>
              <label htmlFor="title">Titre:</label>
              <input type="text" id="title" name="movie_title" value={newMovieTitle}
                onChange={(event) => setNewMovieTitle(event.target.value)} />
              <label htmlFor="date">Date:</label>
              <input type="text" id="date" name="movie_date" value={newMovieDate}
                onChange={(event) => setNewMovieDate(event.target.value)} />
              <button type="submit" className="button">Submit</button>

        </form>)}
        <div className="deroul">
          <span>Trier par</span>
          <div>
            <input type="button" value="genre" onClick={() => setSortOption('genre')} />
            <input type="button" value="A-Z" onClick={() => setSortOption('A-Z')} />
            <input type="button" value="Z-A" onClick={() => setSortOption('Z-A')} />
            <input type="button" value="dernières sorties" onClick={() => setSortOption('dernieres-sorties')} />
          </div>
        </div>
        {movies && (
          <div className="movie-list">
            <h3>Movie List:</h3>
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

