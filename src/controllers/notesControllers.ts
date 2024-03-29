import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const notes = await NoteModel.find().exec();

        if (!notes) {
            throw createHttpError(404, "Notes not found!");
        }

        res.status(200).json(notes);

    } catch (error) {
        next(error);
    }
}

export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note identifier!");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found!");
        }

        res.status(200).json(note);

    } catch (error) {
        next(error);
    }
}

interface CreateNoteBody {
    title: string,
    text?: string
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {
        if (!title) {
            throw createHttpError(400, "Note must have a title!");
        }

        const newNote = await NoteModel.create({
            "title": title,
            "text": text
        });

        res.status(201).json(newNote);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // MongoDB error code for duplicate entries
        if (error.code === 11000) {
            next(createHttpError(400, "Note's title must be unique!"));
        } else {
            // Pass other errors to the next middleware
            next(error);
        }
    }
}

interface UpdateNoteParams {
    noteId: string
}

interface UpdateNoteBody {
    title?: string,
    text?: string
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const updatedTitle = req.body.title;
    const updatedText = req.body.text;

    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note identifier!");
        }

        if (!updatedTitle) {
            throw createHttpError(400, "Note must have a title!");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found!");
        }

        note.title = updatedTitle;
        note.text = (updatedText == undefined || "") ? note.text : updatedText;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // MongoDB error code for duplicate entries
        if (error.code === 11000) {
            next(createHttpError(400, "Note's title must be unique!"));
        } else {
            // Pass other errors to the next middleware
            next(error);
        }
    }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note identifier!");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found!");
        }

        await note.deleteOne();
        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}