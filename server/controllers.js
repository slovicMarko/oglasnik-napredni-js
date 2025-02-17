import mysql from "mysql2";
import bcrypt from "bcrypt";
import session from "express-session";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "oglasnik",
});
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});

// CRUD za korisnike

export const register = async (req, res) => {
  const { username, password, name, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const query = `INSERT INTO korisnici (ime, username, email, lozinka) VALUES (?, ?, ?, ?)`;

  db.query(query, [name, username, email, hashedPassword], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: "User registered successfully" });
  });
};

export const login = (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM korisnici WHERE username = ?`;

  db.query(query, [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).send({ error: "User not found" });
    }
    const user = results[0];

    // Bcrypt compare async method
    bcrypt.compare(password, user.lozinka, (err, match) => {
      if (err || !match) {
        return res.status(400).send({ error: "Invalid password" });
      }

      // If passwords match
      req.session.user = {
        id: user.id,
        username: user.username,
        ime: user.ime,
        email: user.email,
        admin: user.admin,
      };

      res.send({ message: "Login successful", user: req.session.user });
    });
  });
};

export const createUser = async (req, res) => {
  const { username, password, ime, email, admin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const query = `INSERT INTO korisnici (username, lozinka, ime, email, admin) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    query,
    [username, hashedPassword, ime, email, admin],
    (err, result) => {
      if (err) return res.status(400).send(err);
      res.send({ message: "User created successfully" });
    }
  );
};

export const getUsers = (req, res) => {
  const query = `SELECT * FROM korisnici`;
  db.query(query, (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

export const getUserById = (req, res) => {
  const { userId } = req.params;
  const query = `SELECT * FROM korisnici WHERE id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err || result.length === 0)
      return res.status(400).send({ error: "User not found" });
    res.send(result[0]);
  });
};

export const updateUser = (req, res) => {
  const { userId, username, ime, email, admin } = req.body;
  const query = `UPDATE korisnici SET username = ?, ime = ?, email = ?, admin = ? WHERE id = ?`;
  db.query(query, [username, ime, email, admin, userId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: "User updated successfully" });
  });
};

export const deleteUser = (req, res) => {
  const { userId } = req.params;
  const query = `DELETE FROM korisnici WHERE id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: "User deleted successfully" });
  });
};

// CRUD za postove (oglase)

export const createPost = (req, res) => {
  const { cijena, grad, kategorija, korisnik_id, naslov, opis } = req.body;
  const query = `INSERT INTO oglasi (naslov, opis, cijena, korisnik_id, kategorija_id, grad_id) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [naslov, opis, cijena, korisnik_id, kategorija, grad],
    (err, result) => {
      if (err) return res.status(400).send(err);
      res.send({ message: "Post created successfully" });
    }
  );
};

export const updatePost = (req, res) => {
  const { id, cijena, grad, korisnik_id, naslov, opis } = req.body;
  const query = `UPDATE oglasi SET naslov = ?, opis = ?, cijena = ?, grad_id = ? WHERE id = ? AND korisnik_id = ?`;
  db.query(
    query,
    [naslov, opis, cijena, grad, id, korisnik_id],
    (err, result) => {
      if (err) return res.status(400).send(err);
      res.send({ message: "Post updated successfully" });
    }
  );
};

export const getPosts = (req, res) => {
  const query = `SELECT o.*, k.naziv AS kategorija, g.naziv AS grad, u.username AS korisnik, z.naziv as zupanija FROM oglasi o 
                 INNER JOIN korisnici u ON o.korisnik_id = u.id
                 INNER JOIN kategorije k ON o.kategorija_id = k.id
                 INNER JOIN gradovi g ON o.grad_id = g.id
                 INNER JOIN zupanije z ON g.zupanija_id  = z.id
                 ORDER BY o.datum_objave DESC`;
  db.query(query, (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

export const getPostsByParentCategoryId = (req, res) => {
  const { parentCategoryId } = req.params;
  const query = `SELECT o.*, k.naziv AS kategorija, g.naziv AS grad, u.username AS korisnik, z.naziv as zupanija FROM oglasi o 
                 INNER JOIN korisnici u ON o.korisnik_id = u.id
                 INNER JOIN kategorije k ON o.kategorija_id = k.id
                 INNER JOIN gradovi g ON o.grad_id = g.id
                 INNER JOIN zupanije z ON g.zupanija_id  = z.id
                 WHERE k.nadkategorija_id  = ?
                 ORDER BY o.datum_objave DESC`;
  db.query(query, [parentCategoryId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

export const getPostsByCategoryId = (req, res) => {
  const { categoryId } = req.params;
  const query = `SELECT o.*, k.naziv AS kategorija, g.naziv AS grad, u.username AS korisnik, z.naziv as zupanija FROM oglasi o 
                 INNER JOIN korisnici u ON o.korisnik_id = u.id
                 INNER JOIN kategorije k ON o.kategorija_id = k.id
                 INNER JOIN gradovi g ON o.grad_id = g.id
                 INNER JOIN zupanije z ON g.zupanija_id  = z.id
                 WHERE k.id = ?
                 ORDER BY o.datum_objave DESC`;
  db.query(query, [categoryId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

export const getPostById = (req, res) => {
  const { postId } = req.params;
  const query = `SELECT o.*, k.naziv AS kategorija, k.nadkategorija_id, g.naziv AS grad, z.id, u.username AS korisnik, z.id as zupanija_id ,z.naziv as zupanija FROM oglasi o
                 INNER JOIN korisnici u ON o.korisnik_id = u.id
                 INNER JOIN kategorije k ON o.kategorija_id = k.id
                 INNER JOIN gradovi g ON o.grad_id = g.id
                 INNER JOIN zupanije z ON g.zupanija_id  = z.id
                 WHERE o.id = ?`;
  db.query(query, [postId], (err, result) => {
    if (err || result.length === 0)
      return res.status(400).send({ error: "Post not found" });
    res.send(result[0]);
  });
};

export const filterPostsByUser = (req, res) => {
  const { userId } = req.params;
  const query = `SELECT o.*, k.naziv AS kategorija, g.naziv AS grad, u.username AS korisnik, z.naziv as zupanija FROM oglasi o
                 INNER JOIN korisnici u ON o.korisnik_id = u.id
                 INNER JOIN kategorije k ON o.kategorija_id = k.id
                 INNER JOIN gradovi g ON o.grad_id = g.id
                 INNER JOIN zupanije z ON g.zupanija_id  = z.id
                 WHERE o.korisnik_id = ?
                 ORDER BY o.datum_objave DESC`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

export const deletePost = (req, res) => {
  const { postId } = req.params;
  const query = `DELETE FROM oglasi WHERE id = ?`;
  db.query(query, [postId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: "Post deleted successfully" });
  });
};

// CRUD za zupanije

export const getRegions = (req, res) => {
  const query = `SELECT * FROM zupanije`;
  db.query(query, (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

// CRUD za gradove

export const createCity = (req, res) => {
  const { naziv, zupanija_id } = req.body;
  const query = `INSERT INTO gradovi (naziv, zupanija_id) VALUES (?, ?)`;
  db.query(query, [naziv, zupanija_id], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: "City created successfully" });
  });
};

export const getCities = (req, res) => {
  const { regionId } = req.params;
  const query = `SELECT g.* FROM gradovi g 
                 INNER JOIN zupanije z on g.zupanija_id = z.id
                 WHERE z.id = ?`;
  db.query(query, [regionId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

// CRUD za kategorije

export const createCategory = (req, res) => {
  const { naziv, nadkategorija_id } = req.body;
  const query = `INSERT INTO kategorije (naziv, nadkategorija_id) VALUES (?, ?)`;
  db.query(query, [naziv, nadkategorija_id], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: "Category created successfully" });
  });
};

export const getCategories = (req, res) => {
  const { categoryId } = req.params;
  const query = `
    SELECT k.* 
    FROM oglasnik.kategorije k 
    JOIN oglasnik.nadkategorije nk ON k.nadkategorija_id = nk.id
    WHERE k.nadkategorija_id = ?
    ORDER BY id ASC`;

  db.query(query, [categoryId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

export const deleteCategory = (req, res) => {
  const { categoryId } = req.params;
  const query = `DELETE FROM kategorije WHERE id = ?`;
  db.query(query, [categoryId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: "Category deleted successfully" });
  });
};

// CRUD za favorite

export const createFavorite = (req, res) => {
  const { userId, postId } = req.body;
  const query = `INSERT INTO favoriti (korisnik_id, oglas_id) VALUES (?, ?)`;
  db.query(query, [userId, postId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: "Favorite added successfully" });
  });
};

export const getFavoritesByUser = (req, res) => {
  const { userId } = req.params;
  const query = `SELECT f.*, o.naslov, o.opis, o.cijena FROM favoriti f 
                 INNER JOIN oglasi o ON f.oglas_id = o.id 
                 WHERE f.korisnik_id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

export const deleteFavorite = (req, res) => {
  const { userId, postId } = req.params;
  const query = `DELETE FROM favoriti WHERE korisnik_id = ? AND oglas_id = ?`;
  db.query(query, [userId, postId], (err, result) => {
    if (err) return res.status(400).send(err);
    res.send({ message: "Favorite deleted successfully" });
  });
};

// CRUD za nadkategorije

export const getParentCategories = (req, res) => {
  const query = `SELECT * FROM nadkategorije
                 ORDER BY id ASC`;
  db.query(query, (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};

// ADMIM dohvati

export const getPostsStatistics = (req, res) => {
  const query = `SELECT k.id, k.ime, k.username, COUNT(o.id) as broj_oglasa
                 FROM oglasi o
                 RIGHT JOIN korisnici k on k.id = o.korisnik_id 
                 GROUP BY k.id`;
  db.query(query, (err, result) => {
    if (err) return res.status(400).send(err);
    res.send(result);
  });
};
