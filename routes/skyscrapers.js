const express = require("express");
const fs = require("fs/promises");
const router = express.Router();

// GETS
//home
router.get("/", (req, res) => {
  res.send("Home");
});
//lista todos
router.get("/skyscrapers", async (req, res) => {
  const data = JSON.parse(await fs.readFile(global.dataPath))
  delete data.nextId;
  res.send(data);
});
//lista por id
router.get("/skyscrapers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = JSON.parse(await fs.readFile(global.dataPath))
    const skycraper = data.skyscrapers.find(skycraper => skycraper.id === id)
    if (!skycraper) {
      res.send(`O id de numero <b>${id}</b> não foi encontrado.`);
    }
    res.send(skycraper);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//create post
router.post("/skyscrapers/create", async (req, res) => {
  try {
    let skycraper = req.body;

    if (!skycraper.nome || !skycraper.altura || !skycraper.localizacao) {
      throw new Error("Os campos Nome, Altura e Localização são Obrigatórios.");
    }

    const data = JSON.parse(await fs.readFile(global.dataPath));
    skycraper = {
      id: data.nextId++,
      nome: skycraper.nome,
      localizacao: skycraper.localizacao,
    };

    data.skyscrapers.push(skycraper);

    await fs.writeFile(global.dataPath, JSON.stringify(data, null, 2));
    res.send(
      `O ID de número <b>${skycraper.id}</b>, com o nome de <b>${skycraper.nome}</b> inserido com sucesso.`
    );
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//put
router.put("/skyscrapers/put", async (req, res) => {
  try {
    const skycraper = req.body;

    if (!skycraper.nome || !skycraper.altura || !skycraper.localizacao) {
      throw new Error("Os campos Nome, Altura e Localização são Obrigatórios.");
    }

    const data = JSON.parse(await fs.readFile(global.dataPath));

    const index = data.skyscrapers.findIndex(a => a.id === skycraper.id) 

    if (index === -1) {
      throw new Error("Registro não encontrado.");
    }
    
    data.skyscrapers[index].nome = skycraper.nome
    data.skyscrapers[index].altura = skycraper.altura
    data.skyscrapers[index].localizacao = skycraper.localizacao

    await fs.writeFile(global.dataPath, JSON.stringify(data, null, 2));

    res.send(skycraper);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


router.delete('/skyscrapers/delete/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const data = JSON.parse(await fs.readFile(global.dataPath));
   
    const index = data.skyscrapers.findIndex(a => a.id === id) 

    if (index === -1) {
      throw new Error("Registro não encontrado.");
    }


    data.skyscrapers = data.skyscrapers.filter(s => s.id !== id);
   
    await fs.writeFile(global.dataPath, JSON.stringify(data));
    res.sendStatus(200);
    res.end();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


module.exports = router;
