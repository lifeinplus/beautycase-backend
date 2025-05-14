import mongoose from "mongoose";

import app from "./app";
import config from "./config";
import Logging from "./library/Logging";

mongoose
    .connect(config.mongoUri || "", { dbName: "beautycaseDB" })
    .then(() => {
        Logging.info("Server connected to MongoDB");
        StartServer();
    })
    .catch((error) => {
        Logging.error("Unable to connect to MongoDB:");
        Logging.error(error);
    });

const StartServer = () => {
    app.listen(config.port, async () => {
        Logging.info(`Server is running on http://localhost:${config.port}`);
    });
};
