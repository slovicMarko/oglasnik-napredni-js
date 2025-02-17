import mysql from "mysql2";
import bcrypt from "bcrypt";
import session from "express-session";
import { promisify } from "util";

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

    bcrypt.compare(password, user.lozinka, (err, match) => {
      if (err || !match) {
        return res.status(400).send({ error: "Invalid password" });
      }

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
  const query = `SELECT ime, username, email FROM korisnici WHERE id = ?`;
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

const query = promisify(db.query).bind(db);

export const updatePost = async (req, res) => {
  try {
    const { id, cijena, grad, korisnik_id, naslov, opis, slike } = req.body;

    const updateQuery = `UPDATE oglasi SET naslov = ?, opis = ?, cijena = ?, grad_id = ? WHERE id = ? AND korisnik_id = ?`;

    await query(updateQuery, [naslov, opis, cijena, grad, id, korisnik_id]);

    await deleteImages(id);
    await addImages(id, slike);

    res.send({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send({ message: "Internal server error", error });
  }
};

const deleteImages = (oglas_id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM slike_oglasa WHERE oglas_id = ?`;
    db.query(query, [oglas_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const addImages = (oglas_id, slike) => {
  if (!slike || slike.length === 0) {
    return Promise.resolve();
  }

  const query = `INSERT INTO slike_oglasa (oglas_id, url_slike) VALUES (?,?)`;

  const insertPromises = slike.map((slika) => {
    return new Promise((resolve, reject) => {
      db.query(query, [oglas_id, slika], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });

  return Promise.all(insertPromises);
};

const getPostsQuery = `
  SELECT 
    o.*, 
    k.naziv AS kategorija, 
    k.nadkategorija_id,
    g.naziv AS grad, 
    u.username AS korisnik, 
    z.naziv AS zupanija,
    z.id as zupanija_id,
    GROUP_CONCAT(s.url_slike) AS slike 
  FROM oglasi o
  INNER JOIN korisnici u ON o.korisnik_id = u.id
  INNER JOIN kategorije k ON o.kategorija_id = k.id
  INNER JOIN gradovi g ON o.grad_id = g.id
  INNER JOIN zupanije z ON g.zupanija_id  = z.id
  LEFT JOIN slike_oglasa s ON o.id = s.oglas_id
`;

const getPosts = (whereClause = "", params = [], res) => {
  const query = `${getPostsQuery} ${whereClause} GROUP BY o.id ORDER BY o.datum_objave DESC`;

  db.query(query, params, (err, result) => {
    if (err) return res.status(400).send(err);

    result.forEach((post) => {
      post.slike = post.slike
        ? post.slike.split(",").map((slika) => slika.replace("\\", "/"))
        : [];
    });
    res.send(result);
  });
};

export const getAllPosts = (req, res) => {
  getPosts("", [], res);
};

export const getPostsByParentCategoryId = (req, res) => {
  getPosts("WHERE k.nadkategorija_id = ?", [req.params.parentCategoryId], res);
};

export const getPostsByCategoryId = (req, res) => {
  getPosts("WHERE k.id = ?", [req.params.categoryId], res);
};

export const getPostById = (req, res) => {
  getPosts("WHERE o.id = ?", [req.params.postId], res);
};

export const filterPostsByUser = (req, res) => {
  getPosts("WHERE o.korisnik_id = ?", [req.params.userId], res);
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
