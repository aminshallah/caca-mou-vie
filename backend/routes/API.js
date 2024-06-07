import express from 'express';
import axios from 'axios';
import Movie from '../entities/movie.js';
import { appDataSource } from '../datasource.js';

const router = express.Router();

const TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const fetchAndStoreMovies = async () => {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: TMDB_API_KEY,
      },
    };

    const movieRepository = appDataSource.getRepository(Movie);
    let allMovies = [];
    
    const totalMovies = 100;
    const moviesPerPage = 20;
    const pagesToFetch = Math.ceil(totalMovies / moviesPerPage);

    for (let page = 1; page <= pagesToFetch; page++) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?language=en-US&page=${page}`,
        options
      );

      allMovies = allMovies.concat(response.data.results);
    }


    const movieDetailsPromises = allMovies.slice(0, totalMovies).map((movie) =>
      axios.get(`${TMDB_BASE_URL}/movie/${movie.id}?language=en-US&append_to_response=credits`, options)
    );

    const moviesDetails = await Promise.all(movieDetailsPromises);


    for (const detailResponse of moviesDetails) {
      const movieData = detailResponse.data;
      const newMovie = movieRepository.create({
        title: movieData.title,
        date: movieData.release_date,
        synopsis: movieData.overview,
        duration: movieData.runtime,
        mainActors: movieData.credits.cast.slice(0, 3).map(actor => actor.name).join(', '),
        director: movieData.credits.crew.find(crewMember => crewMember.job === 'Director')?.name,
        genre: movieData.genres.map(genre => genre.name).join(', '),
        posterPath: movieData.poster_path,
      });
      await movieRepository.save(newMovie);
    }

    console.log('Movies successfully fetched and stored');
  } catch (err) {
    console.error('Error fetching or storing movies:', err);
  }
};

router.post('/fetch-and-store-movies', async (req, res) => {
  await fetchAndStoreMovies();
  res.status(200).json({
    message: 'Movies fetched and stored successfully',
  });
});

export default router;

