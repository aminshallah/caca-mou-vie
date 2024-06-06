import { EntitySchema } from 'typeorm';

const Note = new EntitySchema({
  name: 'Note',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    userId: {
      type: Number,
    },
    filmId: {
      type: Number,
    },
    note: {
      type: Number,
    },
  },
});

export default Note;
