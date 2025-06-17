// server/routes/uploadRoute.js
const router = require("express").Router();
const guard = require("../middlewares/auth");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: "recipes" },
});

const upload = multer({ storage });

router.post("/", guard, upload.single("image"), (req, res) => {
    res.status(201).json({ url: req.file.path });
});

module.exports = router;