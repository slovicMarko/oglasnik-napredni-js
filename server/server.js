import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes.js";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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
