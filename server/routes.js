import express from "express";

import {
  createCategory,
  createCity,
  createFavorite,
  createPost,
  deleteCategory,
  deleteFavorite,
  deletePost,
  deleteUser,
  filterPostsByUser,
  getCategories,
  getCities,
  getFavoritesByUser,
  getParentCategories,
  getPostById,
  getPostsByCategoryId,
  getPostsByParentCategoryId,
  getRegions,
  getUserById,
  login,
  register,
  updatePost,
  updateUser,
  getPostsStatistics,
  getUsers,
  getAllPosts,
} from "./controllers.js";
const router = express.Router();

// rute admin

router.get("/getPostsStatistics", getPostsStatistics);

// rute user

router.post("/register", register);
router.post("/login", login);
router.post("/updateUser", updateUser);
router.get("/users/:userId", getUserById);
router.get("/getUsers", getUsers);
router.delete("/deleteUser/:userId", deleteUser);

// rute za postove
router.post("/createPost/", createPost);
router.put("/updatePost/", updatePost);
router.get("/getPosts", getAllPosts);
router.get(
  "/getPostsParentCategory/:parentCategoryId",
  getPostsByParentCategoryId
);
router.get("/getPostsCategory/:categoryId", getPostsByCategoryId);
router.get("/post/:postId", getPostById);
router.get("/filter/:userId", filterPostsByUser);
router.delete("/deletePost/:postId", deletePost);

// rute za gradove i zupanije

router.post("/createCity", createCity);
router.get("/getRegions", getRegions);
router.get("/getCities/:regionId", getCities);

// rute za kategorije

router.post("/createCategory", createCategory);
router.get("/categories/:categoryId", getCategories);
router.delete("/deleteCategory/:categoryId", deleteCategory);

// rute za favorite

router.post("/createFavorite", createFavorite);
router.get("/favorites/:userId", getFavoritesByUser);
router.delete("/deleteFavorite/:favoriteId", deleteFavorite);

// rute za nadkategorije

router.get("/getParentCategories", getParentCategories);

export default router;
