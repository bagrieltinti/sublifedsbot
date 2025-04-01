// src/commands/idade.js
const { SlashCommandBuilder } = require('discord.js');
const { getUserData, saveUserData } = require('../firebase/db');
const { gerarEventoComEfeito } = require('../systems/eventosGemini');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('idade')
    .setDescription('Avança 1 ano na vida do seu personagem'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;
    const data = await getUserData(userId);

    if (!data) {
      return await interaction.editReply({
        content: '❌ Você ainda não criou seu personagem. Use o comando `/start` primeiro.'
      });
    }

    // Avança 1 ano
    data.idade += 1;
    await saveUserData(userId, data);

    // Gera dois eventos aleatórios
    const tipos = ['idade', 'idade', 'escola', 'trabalho', 'desastre', 'mundo', 'sorte', 'negativo'];
    const tiposSorteados = [
      tipos[Math.floor(Math.random() * tipos.length)],
      tipos[Math.floor(Math.random() * tipos.length)]
    ];

    const eventos = [];
    for (const tipo of tiposSorteados) {
      const evento = await gerarEventoComEfeito(userId, tipo);
      if (evento) eventos.push(evento);
    }

    const descricaoEventos = eventos.map(ev => `🔸 ${ev.evento}`).join('\n');
    const personagem = await getUserData(userId);

    await interaction.editReply({
      content: `📆 Você envelheceu 1 ano. Agora tem **${personagem.idade} anos**.\n\n${descricaoEventos || 'Nenhum evento aconteceu este ano.'}\n\n❤️ Felicidade: ${personagem.felicidade}\n🧠 Inteligência: ${personagem.inteligencia}\n💪 Saúde: ${personagem.saude}\n💬 Carisma: ${personagem.carisma || 0}\n💰 Dinheiro: R$ ${personagem.riqueza?.toFixed(2) || '0.00'}`
    });
  }
};
