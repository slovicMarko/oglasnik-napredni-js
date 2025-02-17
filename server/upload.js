import multer from "multer";
import path from "path";

// Postavke za multer (spremanje slika u folder 'uploads')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // pohranjivanje slika u direktorij 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ime slike bit će timestamp + ekstenzija
  },
});

const upload = multer({ storage: storage });

// Ruta za upload slika
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  // Možeš spremiti informacije o slici u bazu podataka ako treba
  res
    .status(200)
    .send({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
};

export { upload, uploadImage };
