
const express = require('express')
const app = express()
const cors = require("cors");

const port = 4000

app.set('json spaces', 2);


app.use(cors());
app.use(express.json());

app.use('',require('./src/routes'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})