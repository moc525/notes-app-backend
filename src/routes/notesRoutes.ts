import express from "express";
import * as NotesControllers from "../controllers/notesControllers";

const router = express.Router();

router.get("/all", NotesControllers.getNotes);
router.get("/:noteId", NotesControllers.getNote);
router.post("/add", NotesControllers.createNote);
router.patch("/:noteId", NotesControllers.updateNote);
router.delete("/:noteId", NotesControllers.deleteNote);

export default router;