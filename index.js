const express = require("express");
const routerSkyscrapers = require("./routes/skyscrapers.js");
const port = 3000;
const fs = require("fs/promises");
const cors = require("cors")

global.dataPath = './data/skyscrapers.json'; //caminho do json com os dados

const app = express();
app.use(express.json())
app.use(cors());

app.use("/", routerSkyscrapers);

app.listen(port, async () => {
  try {
    await fs.readFile(global.dataPath)
    console.info(`App rodando em: http://localhost:${port}`);
  } catch (error) {
    const initialData = {
      nextId: 1,
      skyscrapers: []
    };
    fs.writeFile(global.dataPath, JSON.stringify(initialData)).then(() => {
      console.info(`Data created and App rodando em: http://localhost:${port}`);
    }).catch(err => {
      console.info(err)
    });
  }
});

