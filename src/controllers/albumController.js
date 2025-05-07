import {
  insertAlbum,
  getAllAlbums,
  deleteAlbumById,
} from "../models/albumModel.js";

// 新增相簿
export const createAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).send("Album name is required.");

    const album = await insertAlbum(name, description);
    res.status(201).json(album);
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).send("Internal server error.");
  }
};

// 取得所有相簿
export const getAlbums = async (req, res) => {
  try {
    const albums = await getAllAlbums();
    res.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).send("Internal server error.");
  }
};

// 刪除相簿
export const deleteAlbum = async (req, res) => {
  const { id } = req.params;
  try {
    const album = await deleteAlbumById(id);
    if (!album) return res.status(404).send("Album not found.");

    res.send({ msg: "Album deleted successfully." });
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).send("Internal server error.");
  }
};
