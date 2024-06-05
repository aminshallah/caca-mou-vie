import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    title: {
      type: String,
      unique: false,
    },
    date: {
      type: String,
    },
    synopsis: {
      type: String,
      nullable: true,
    },
    duration: {
      type: Number,
      nullable: true,
    },
    mainActors: {
      type: String,
      nullable: true,
    },
    director: {
      type: String,
      nullable: true,
    },
    genre: {
      type: String,
      nullable: true,
    },
    posterPath: {
      type: String,
      nullable: true,
    },
  },
});
export default Movie;

