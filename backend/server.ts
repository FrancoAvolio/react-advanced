import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from "convert-csv-to-json";

const app = express();
const port = process.env.PORT ?? 3000;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let userData: Array<Record<string, string>> = [];

app.use(cors());

app.post("/api/files", upload.single("file"), async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(500).json({
      message: "File is required",
    });
  }
  if (file.mimetype !== "text/csv") {
    return res.status(500).json({
      message: "Invalid file type",
    });
  }
  let json: Array<Record<string, string>> = [];
  try {
    const csv = Buffer.from(file.buffer).toString("utf-8");
    console.log(csv);
    json = csvToJson.fieldDelimiter(",").csvStringToJson(csv);
    userData = json;
  } catch (error) {
    return res.status(500).json({
      message: "Error parsing CSV file",
    });
  }
  return res.status(200).json({
    data: userData,
    message: "File uploaded successfully",
  });
});

app.get("/api/users", async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(500).json({
      message: "Query is required",
    });
  }

  const search = q.toString().toLowerCase();

  const filteredData = userData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toLowerCase().includes(search)
    );
  });

  return res.status(200).json({
    data: filteredData,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
