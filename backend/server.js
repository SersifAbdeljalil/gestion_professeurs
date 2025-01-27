const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const professeursRoutes = require("./routes/professeurs");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/professeurs", professeursRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
