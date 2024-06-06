import express from 'express';
import Note from '../entities/note.js';
import { appDataSource } from '../datasource.js';

const router = express.Router();

router.post('/update', async (req, res) => {
  const { userId, filmId, note } = req.body;

  if (!userId || !filmId || !note || note < 1 || note > 5) {
    return res.status(400).json({ message: 'Invalid data. Please provide valid userId, filmId, and note (between 1 and 5).' });
  }

  const noteRepository = appDataSource.getRepository(Note);

  try {
    const existingNote = await noteRepository.findOne({ where: { userId, filmId } });

    if (existingNote) {
      existingNote.note = note;
      await noteRepository.save(existingNote);
    } else {
      const newNote = noteRepository.create({ userId, filmId, note });
      await noteRepository.insert(newNote);
    }

    res.status(200).json({ message: 'Note successfully updated' });
  } catch (error) {
    console.error('Error while updating note:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;
