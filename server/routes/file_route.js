import express from "express";
import multer from "multer";
const routes = express.Router();
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "/uploads/");
    cb(null, path.join(process.cwd(), "uploads/"));
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 1,
  // },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      // res.status(400).json({
      //   error: "Files types allowed are .jpg , .png , .jpeg",
      // });
    }
  },
});

routes.post("/uploadFile", upload.single("file"), function (req, res) {
  res.json({ filename: req.file.filename });
});

const downloadFile = (req, res) => {
  const filename = req.params.filename;
  // const filePath = __basedir + `/uploads/`;
  const filePath = path.join(process.cwd(), "uploads/", filename);

  res.download(filePath, (error) => {
    if (error) {
      res.status(500).send({ msg: "File cannot be downloaded" + error });
    }
  });
};

routes.get("/files/:filename", downloadFile);

export default routes;
