const express = require("express");
const cors = require('cors');
const app = express();
const port = 3306;

require('dotenv').config();

const { getConnection, createTables } = require("./db/dbConfig");

app.use(cors());
app.use(express.json());

const dbConnection = getConnection();

const userRoute = require("./Routes/userRoute");
const questionRoutes = require("./Routes/questionRoute");
const answerRoute = require('./Routes/answerRoute');

app.use("/api/users", userRoute);
app.use("/api/questions", questionRoutes);
app.use('/api/answers', answerRoute);






async function start() {
  try {
    await dbConnection.execute("SELECT 1");
    await createTables();
    app.listen(port, () => {
      console.log("Database Connection Established!");
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

start();
