import app from "./app";
import env from "./util/validateconf";
import mongoose from "mongoose";

const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected!");

        app.listen(port, () => {
            console.log(`Server is listening at port: ${port}`);
        });
    })
    .catch(console.error);
