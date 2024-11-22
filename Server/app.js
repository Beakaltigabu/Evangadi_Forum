const express = require("express");
const cors = require('cors');
const app = express();
const port = 5500;

require('dotenv').config();

const { getConnection, createTables } = require("./db/dbConfig");

app.use(cors());
app.use(express.json());

const userRoute = require("./Routes/userRoute");
const questionRoutes = require("./Routes/questionRoute");
const answerRoute = require('./Routes/answerRoute');
const voteRoute = require('./Routes/voteRoute');

app.use("/api/users", userRoute);
app.use("/api/questions", questionRoutes);
app.use('/api/answers', answerRoute);
app.use('/api/votes', voteRoute);

async function start() {
  try {
    const dbConnection = getConnection();
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
