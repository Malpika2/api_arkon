
const express = require('express')
const app = express()
const cors = require("cors");
const http = require("http");

const port = 4000

const server = http.createServer(app);


app.use(cors());

app.use('',require('./src/routes'));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})