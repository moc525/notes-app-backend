import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import NotesRoutes from "./routes/notesRoutes";
import createHttpError, { isHttpError } from "http-errors";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/notes", NotesRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found!"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    let errorMsg = "An unknown error occured!";
    let statusCode = 500;

    if (isHttpError(error)) {
        statusCode = error.status;
        errorMsg = error.message;
    }

    res.status(statusCode).json({"error": errorMsg});
});

export default app;