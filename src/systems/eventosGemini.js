// src/systems/eventosGemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { saveUserData, getUserData } = require('../firebase/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const STATS = ["felicidade", "saude", "inteligencia", "carisma", "riqueza", "emprego", "escolaridade"];

function gerarPrompt(tipoEvento) {
  return `Você é uma IA criativa e sarcástica que escreve eventos para um jogo estilo BitLife com contexto 100% brasileiro, tom caótico, engraçado e com espaço para crítica social.
Gere um evento de tipo \"${tipoEvento}\" com 1 a 2 frases e escreva em português do Brasil.

Evite eventos ofensivos, preconceituosos ou de conteúdo adulto explícito.

Retorne também os efeitos desse evento em formato JSON com os seguintes atributos do personagem:
[${STATS.join(', ')}] — todos com valores inteiros, positivos ou negativos, entre -20 e +20.

Formato da resposta:
{
  \"tipo\": \"${tipoEvento}\",
  \"evento\": \"texto engraçado e contextualizado\",
  \"efeitos\": {
    \"felicidade\": int,
    \"saude\": int,
    \"inteligencia\": int,
    \"carisma\": int,
    \"riqueza\": int,
    \"emprego\": int,
    \"escolaridade\": int
  }
}`;
}

async function gerarEventoComEfeito(userId, tipoEvento, tentativas = 3) {
  const user = await getUserData(userId);
  let ultimaResposta = null;

  for (let i = 0; i < tentativas; i++) {
    try {
      const prompt = gerarPrompt(tipoEvento);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const json = JSON.parse(response.text());

      // Aplica os efeitos ao personagem
      for (const stat of STATS) {
        if (json.efeitos[stat] != null) {
          if (!user[stat]) user[stat] = 0;
          user[stat] += json.efeitos[stat];
        }
      }

      // Salva histórico
      if (!user.eventos) user.eventos = [];
      user.eventos.push({ tipo: tipoEvento, evento: json.evento, efeitos: json.efeitos, data: new Date().toISOString() });

      await saveUserData(userId, user);
      return json;
    } catch (e) {
      console.warn(`⚠️ Tentativa ${i + 1} falhou para o tipo '${tipoEvento}':`, e.message);
      ultimaResposta = e.message;
    }
  }

  return {
    tipo: tipoEvento,
    evento: `Nada aconteceu. ${ultimaResposta ? `(${ultimaResposta})` : ''}`.trim(),
    efeitos: {}
  };
}

module.exports = {
  gerarEventoComEfeito
};
