require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];

const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { SlashCommandBuilder } = require('discord.js');
  const source = fs.readFileSync(filePath, 'utf-8');

  // Regex para extrair apenas o conteúdo de SlashCommandBuilder
  const match = source.match(/new SlashCommandBuilder\(\)[\s\S]*?\.setDescription\(['"`](.*?)['"`]\)/);
  if (match) {
    const name = file.replace('.js', '');
    const description = match[1];

    const builder = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description);

    commands.push(builder.toJSON());
  } else {
    console.warn(`⚠️ Comando ${file} não possui SlashCommandBuilder válido.`);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('🔁 Registrando comandos...');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();
