import express from "express";
import cors from "cors";
import userRoutes from "./routes/user_routes.js";
import postRoutes from "./routes/post_routes.js";
import fileRoutes from "./routes/file_route.js";
import connection from "./config/connection.js";
import { config } from "dotenv";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.__basedir = __dirname;

config();
const app = express();
const PORT = 8000;
app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", fileRoutes);

connection();

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
