module.exports = {
  name: "emojis",
  async func(msg, { send, guild, }) {
    if(guild)
       return send((new Discord.RichEmbed).setDescription(guild.emojis.array().map(e=>e+[]).join(' ')).setTitle(guild.emojis.size+' emojis').setColor(member.displayColor));
    else return ("You need to be in a server to use this command!");
  }
};
