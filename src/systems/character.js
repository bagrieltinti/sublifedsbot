const nomes = require('../data/nomes.json');
const sobrenomes = require('../data/sobrenomes.json');
const estadosCidades = require('../data/estados_cidades.json');

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createCharacter() {
  const nome = `${getRandom(nomes)} ${getRandom(sobrenomes)}`;
  const estado = getRandom(Object.keys(estadosCidades));
  const cidade = getRandom(estadosCidades[estado]);

  return {
    nome,
    estado,
    cidade,
    idade: 0,
    felicidade: 50,
    inteligencia: 50,
    saude: 50,
    dinheiro: 0.0
  };
}

module.exports = { createCharacter };
