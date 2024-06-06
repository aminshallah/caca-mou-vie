import './Movie.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'

const DEFAULT_MOVIE_VALUES = {
  title: '',
  date: '',
  synopsis : '',
  duration : '',
  mainActors : '',
  genre : '',
  img : ''
};

function Movie({ movie }) {
  const [movieValue, setMovieValue] = useState(DEFAULT_MOVIE_VALUES);
  const [fullscreenMovie, setFullscreenMovie] = useState(null);
  const fullscreenRef = useRef(null);
  const [rankingValue, setRankingValue] = useState(0)
  const user = 1;

  useEffect(() => {
    setMovieValue({
      title: movie.title,
      date: movie.date,
      synopsis : movie.synopsis,
      duration : movie.duration,
      mainActors : movie.mainActors,
      genre : movie.genre,
      img : movie.posterPath
    });
  }, [movie]);


  
    const handleMovieClick = (movie) => {
      setFullscreenMovie(movie);
    };
  
    const closeFullscreenMovie = () => {
      setFullscreenMovie(null);
    };

    const sendNote = () => {
      axios.post('http://localhost:8000/notes/update', { userId: user, filmId: fullscreenMovie.id, note : rankingValue })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => console.error(error));
    };
  
    return (
      <>
        <li className="movie-item" onClick={() => handleMovieClick(movie)}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movieValue.img}`}
            alt={movieValue.title}
            className="movie-poster"
          />
        </li>
        {fullscreenMovie && (
        <div className="fullscreen-overlay" onClick={closeFullscreenMovie}>
          <div className="fullscreen-modal" onClick={(e) => e.stopPropagation()}>
            {<img
              src={`https://image.tmdb.org/t/p/original${fullscreenMovie.posterPath}`}
              alt={fullscreenMovie.title}
              className="fullscreen-image"
            />}
            <div className="movie-details">
            <h2>{fullscreenMovie.title}</h2>
            <p>{fullscreenMovie.synopsis}</p>
            <p><strong>Date de sortie:</strong> {fullscreenMovie.date}</p>
            <p><strong>Durée:</strong> {fullscreenMovie.duration} minutes</p>
            <p><strong>Réalisateur:</strong> {fullscreenMovie.director}</p>
            <p><strong>Acteurs.ices principaux.les:</strong> {fullscreenMovie.mainActors}</p>
            <p><strong>Genre:</strong> {fullscreenMovie.genre}</p>
            <button onClick={closeFullscreenMovie}>Close</button><div>
            <div className = "button-row">
            <input type="button" value="💩" onClick={() => {setRankingValue(1); sendNote()}} />
            <input type="button" value="🤒" onClick={() => {setRankingValue(2); sendNote()}} />
            <input type="button" value="😐" onClick={() => {setRankingValue(3); sendNote()}} />
            <input type="button" value="🥰" onClick={() => {setRankingValue(4); sendNote()}} />
            <input type="button" value="🥵" onClick={() => {setRankingValue(5); sendNote()}} />

          </div>
              </div>
          </div>
          </div>
        </div>
      )}
      </>
    );
  }

export default Movie;
