const express = require("express");
const app = express();
const port = 4000;

const indexRoutes = require("./routes/index");

app.use(express.json());
app.use("/api", indexRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
