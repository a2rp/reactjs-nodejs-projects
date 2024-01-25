const express = require("express");
const app = express();
const PORT = process.env.PORT || 1198;
const cors = require("cors");

app.use(cors());

app.get("/api/a2rp", (req, res) => {
    console.log("a2rp: an Ashish Ranjan presentation");
    res.json({ success: true, message: "a2rp: an Ashish Ranjan presentation" });
});

app.listen(PORT, () => console.log(`server listening - http://localhost:${PORT}`));


