/* import { useEffect, useState } from 'react';
import axios from 'axios';


const DEFAULT_MOVIE_VALUES = {
  titre: '',
  date: '', */
/*   synopsis : '',
  mainActor : '',
  director :  */
  /* image: '', */

/* }; */

/* function Movie({ movie }) {
  const [movieValue, setMovieValue] = useState(DEFAULT_MOVIE_VALUES);

  const useFetchMovie = () => { */
      /*const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
      },
    }; */
/* 
    setMovieValue((prev) => ({
      ...prev,
      titre: movie.title,
      date: movie.release_date,
    })); */

/*     axios
      .get(`https://api.themoviedb.org/3/movie/${movie.id}/images`, options)
      .then((response) => {
        const imagePath = response.data.backdrops[0]?.file_path || '';
        setMovieValue((prev) => ({
          ...prev,
          image: imagePath,
        }));
      })
      .then((response) => console.log(response))
      .catch((err) => console.error(err)); */
/*   };

  useEffect(() => {
    useFetchMovie();
  }, [movie.id]);

  return (
    <li>
      <p>{movieValue.titre}</p>
      <p>Sorti le : {movieValue.date}</p>
      {/* {movieValue.image && (
        <img
          src={`https://image.tmdb.org/t/p/w500${movieValue.image}`}
          alt={movieValue.title}
        />
      )} *//* }
    </li>
  );
} */

/* export default Movie; */

import React, { useEffect, useState } from 'react';

const DEFAULT_MOVIE_VALUES = {
  title: '',
  date: '',
  // Additional fields can be added here
};

function Movie({ movie }) {
  const [movieValue, setMovieValue] = useState(DEFAULT_MOVIE_VALUES);

  useEffect(() => {
    setMovieValue({
      title: movie.title,
      date: movie.date,
    });
  }, [movie]);

  return (
    <li>
      <p>Title: {movieValue.title}</p>
      <p>Release Date: {movieValue.date}</p>
    </li>
  );
}

export default Movie;