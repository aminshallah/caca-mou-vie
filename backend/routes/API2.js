import express from 'express';
import axios from 'axios';
import Movie from '../entities/movie.js';
import { appDataSource } from '../datasource.js';

const router = express.Router();

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';

const fetchAndStoreTopMovies = async () => {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: API_KEY,
      },
    };

    const movieRepository = appDataSource.getRepository(Movie);
    
    // Fetch top rated movies
    const response = await axios.get(`${API_URL}/movie/top_rated?language=en-US&page=1`, options);

    const topRatedMovies = response.data.results;

    // Fetch detailed information for each movie
    const movieDetailsPromises = topRatedMovies.map(async (movie) => {
      const movieDetailResponse = await axios.get(`${API_URL}/movie/${movie.id}?language=en-US&append_to_response=credits`, options);
      return movieDetailResponse.data;
    });

    const moviesDetails = await Promise.all(movieDetailsPromises);

    // Insert each movie into the database
    for (const movieData of moviesDetails) {
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

    console.log('Top rated movies successfully fetched and stored');
  } catch (err) {
    console.error('Error fetching or storing top rated movies:', err);
  }
};

router.post('/fetch-and-store-top-movies', async (req, res) => {
  await fetchAndStoreTopMovies();
  res.status(200).json({
    message: 'Top rated movies fetched and stored successfully',
  });
});

export default router;
