// src/commands/start.js
const { SlashCommandBuilder } = require('discord.js');
const { createCharacter } = require('../systems/character');
const { saveUserData } = require('../firebase/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Cria seu personagem e inicia sua jornada no Sublife'),
  async execute(interaction) {
    const userId = interaction.user.id;

    const character = createCharacter();
    await saveUserData(userId, character);

    await interaction.reply({
      content: `🎉 Seu personagem foi criado!\n\n👤 Nome: ${character.nome}\n📍 Localização: ${character.cidade}, ${character.estado}\n🍼 Idade: ${character.idade} anos\n\n❤️ Felicidade: ${character.felicidade}\n🧠 Inteligência: ${character.inteligencia}\n💪 Saúde: ${character.saude}\n💰 Dinheiro: R$ ${character.dinheiro.toFixed(2)}`,
      ephemeral: true
    });
  }
};
