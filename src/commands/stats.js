const { SlashCommandBuilder } = require('discord.js');
const { getUserData } = require('../firebase/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Mostra os atributos do seu personagem'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const data = await getUserData(userId);

    if (!data) {
      return await interaction.reply({
        content: '❌ Você ainda não criou seu personagem. Use o comando `/start` primeiro.',
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `📊 **Seus atributos:**\n\n👤 Nome: ${data.nome}\n📍 Localização: ${data.cidade}, ${data.estado}\n📅 Idade: ${data.idade} anos\n\n❤️ Felicidade: ${data.felicidade}\n🧠 Inteligência: ${data.inteligencia}\n💪 Saúde: ${data.saude}\n💰 Dinheiro: R$ ${data.dinheiro.toFixed(2)}`,
      ephemeral: true
    });
  }
};
