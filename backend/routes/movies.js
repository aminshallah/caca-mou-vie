import express from 'express';
import Movie from '../entities/movie.js';
import { appDataSource } from '../datasource.js';

 const router = express.Router();
/*
*/


router.get('/',(req,res) => {
  const movieRepository = appDataSource.getRepository(Movie);
  movieRepository.find()
    .then(movies => {
      res.json(movies)});
    });

router.get('/:id', async (req, res) => {
  const movieRepository = appDataSource.getRepository(Movie);
  try {
    const movieId = parseInt(req.params.id);  // Extraire l'ID depuis l'URL
    const movie = await movieRepository.findOneBy({ id: movieId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/new', (req,res) => {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    date: req.body.date,
  });
  movieRepository.insert(newMovie);
  res.status(201).json({
    message: 'Film successfully created',
    id: newMovie.id,
  });
   console.log(req.body)});


  router.delete('/:id', function (req, res) {
    const movieId = parseInt(req.params.id) ;
    const movieRepository = appDataSource.getRepository(Movie)

    movieRepository.delete(movieId ).then(function () {
        res.status(200).json({ message: 'Movie succesfully suppressed' });
      }).catch(function () {
        res.status(500).json({ message: 'Error while deleting the movie' });
      });
  });




/* router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ users: movies });
    });
}); */

export default router;
