// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes.js";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import upload from "./upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.post("/upload-multiple", upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ message: "Please upload at least one image" });
  }

  const filePaths = req.files.map((file) => file.path);
  res.json(filePaths);
});

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(bodyParser.json());
app.use("/route", routes);
app.use("/uploads", express.static("uploads"));

const angularDistPath = path.join(
  __dirname,
  "../oglasnik/dist/oglasnik/browser"
);
app.use(express.static(angularDistPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(angularDistPath, "index.html"));
});

app.listen(5000, () => {
  console.log("App is listening on http://localhost:5000");
});
