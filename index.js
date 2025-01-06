require("dotenv").config();

const cors = require("cors");

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 4000;

require("./models");

//middlewaress
//test
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
	cors({
		origin: ["https://paluan-tour.vercel.app", "http://localhost:3000"],
		credentials: true,
	})
);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/auth", require("./routes/auth"));
app.use("/resorts", require("./routes/resorts"));
app.use("/stats", require("./routes/stats"));
app.use("/ratings", require("./routes/rating"));
app.use("/guest", require("./routes/guests"));
app.use("/spotimages", require("./routes/spotimages"));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
