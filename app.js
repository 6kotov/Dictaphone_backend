if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("fs").promises;

const bodyParser = require("body-parser");
const imageStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./public/images/");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});
const soundStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./public/sounds/");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});
const imageUpload = multer({ storage: imageStorage });
const soundUpload = multer({ storage: soundStorage });

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/public", express.static("public"));

if (!fs.existsSync("./public/images/")) {
  fs.mkdirSync("./public/images/");
}

if (!fs.existsSync("./public/sounds/")) {
  fs.mkdirSync("./public/sounds/");
}

app.get("/", async (req, res) => {
  const images = await readDirectory("./public/images/");
  const sounds = await readDirectory("./public/sounds/");
  const soundList = sounds.length ? sounds : ["No sounds loaded!"];
  const imageList = images.length ? images : ["No images loaded!"];
  res.render("index", { imageList, soundList });
});

app.post("/api/upload/image/", imageUpload.single("photo"), (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

app.post("/api/upload/sound/", soundUpload.single("sound"), (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

app.get("/api/file", async (req, res, next) => {
  var options = {
    root: path.join(__dirname, "public/images/"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  const images = await readDirectory("./public/images/");
  const fileName = images[0];

  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

async function readDirectory(dirPath) {
  const directoryPath = path.join(__dirname, dirPath);
  return fs.promises.readdir(directoryPath);
}

app.listen(
  process.env.PORT || 3000,
  console.log("Server started on http://localhost:3000")
);
