import express from 'express';
import { exec } from 'child_process';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';

const router = express.Router();

router.get('/recommandation/:userId', async (req, res) => {
  const userId = req.params.userId;
  exec(
    `python3 backend/recommandation/home.py ${userId}`,
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);

        return res.status(500).json({ error: 'Internal Server Error' });
    }

      try {
        const recommendedMovieIds = JSON.parse(stdout);
        const movieRepository = appDataSource.getRepository(Movie);

        const movies = await movieRepository.findByIds(recommendedMovieIds);
        const sortedMovies = recommendedMovieIds.map(id => movies.find(movie => movie.id === id));

        res.json(sortedMovies);
      } catch (err) {
        console.error('Error parsing JSON:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

export default router;
