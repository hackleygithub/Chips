const Jimp = require('jimp');

module.exports = function() {
  client.on("guildMemberAdd",  async (member) => {
    let memberguild = member.guild;
    let userid= member.user.id;

    if(handleAutoKick(memberguild.id, member)){
      handleAutoRole(memberguild.id, member);

      if(client.memberjoin.captcha[memberguild.id]){
        try{
          let results = await antiraidCaptcha(member);
          console.log('Captcha success results: ' + results);
        }catch(fail){
          console.log('Captcha failure results: ' + fail);

          if(fail[1] && (fail[1] == 'failed captcha' || fail[1] == 'timeout'))
            await fail[0].kick();
        }
      }
      try {
        if(memberguild.id=="257889450850254848"){
          setTimeout(() =>{
            console.log("[SINX] adding role...");
            member.addRole(memberguild.roles.get("305302877641900052")||memberguild.roles.find('name',"Unverified"));
            console.log("[SINX] sending welcome msg...");
            let welcomeC=memberguild.channels.get("314407824568614913")||memberguild.channels.find('name','unverified');
            welcomeC.send(`<@${userid}>, Welcome to Sinbadx Knights! **If you would like to get verified and be able to speak in the other channels, please answer the following questions!**
              1. How did you hear about this server?
              2. Why did you join this server?
              3. Do you promise to read <#297263352252727296>?
              4. What is your favorite diep.io tank?
  (you can answer these with just a sentence or two, no need to write an essay!)`).then(console.log("[SINX] Welcome msg sent")).catch(err=>console.log('welcome msg err:[sinx] '+ err));
          }, 500);
        /*}else if(memberguild.id=="252525368865456130"){
          setTimeout(() => {
            console.log("[SK] adding role...");
            member.addRole(memberguild.roles.get("303587467741757440")||memberguild.roles.find('name',"lollipop-unverified"));
            console.log("[SK] sending welcome msg...");
            let welcomeC=memberguild.channels.get("308772937731670016")||memberguild.channels.find('name','unverified');
            welcomeC.send(`<@${userid}>, Welcome! Please read <#307895557815402496> and become acquainted with the rules here, then contact a staff member to be able to speak in other channels!`);
          }, 700);*/
        }else if(memberguild.id=="315891125825044482"){
          setTimeout(() =>{
            console.log("[SK2] adding role...");
            member.addRole(memberguild.roles.get("316017088160595970")||memberguild.roles.find('name',"unverified"));
            console.log("[SK2] sending welcome msg...");
            let welcomeC=client.channels.get("307342989783728131")||memberguild.channels.find('name','unverified');
            welcomeC.send(`<@${userid}>, Welcome to Sunk Nights! **If you would like to get verified and be able to speak in the other channels, please answer the following questions!**
              1. How did you hear about this server?
              2. Why did you join this server?
              3. Do you promise to read <#316019707276820483>?
              4. What is your favorite diep.io tank?
              (you can answer these with just a sentence or two, no need to write an essay!)`).then(console.log("[SK2] Welcome msg sent"));
          }, 500);
        }else if(memberguild.id=="315502587111669772"){
          setTimeout(()=>{
            console.log("Changing nick...");
            member.setNickname(`(♤)${member.user.username}`.substring(0,Math.min(member.user.username+`(♤)`.length,32)));
          });
        }
      } catch (err) {
        console.log("could not add unverified role or set nick");
      }
    }
  });
  require('./ChannelUpdate')();
};

const handleAutoKick = (gid, mem) => {
  if(memberjoin.panics[gid]&&memberjoin.panicKick[gid]){
    setTimeout(async ()=>{
      let oldmem = await mem.kick();

      while(mem.guild.members.get(oldmem.id)!=null){
        try{
          oldmem = await oldmem.kick();
        }catch(err){
          console.log(`[Autokick for guild ${mem.guild.id}]: Failed to kick ${oldmem.id}..trying again.`);
        }
      }
    },5000);
    return false;
  }
  return true;
};

const handleAutoRole = (gid, mem) => {
  if(client.memberjoin.autorole[gid]&&mem.guild.roles.get(client.memberjoin.autorole[gid]))
    mem.addRole(mem.guild.roles.get(client.memberjoin.autorole[gid]));
};

const antiraidCaptcha = (mem) => {
  return new Promise( (res, rej) => {
    mem.died = false;
    let guild = mem.guild;
    let timestamp = process.hrtime();
    let captchaText = Math.random().toString(36).replace(/[^a-z,\d]+/g, '').substring(1, 8).toUpperCase();

    let image = new Jimp(256, 256);
    let filepath = `${mem.id}.captcha.${timestamp}.${image.getExtension()}`;

    Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
      for(const letterInd in captchaText.split(''))
        image.print(font, 10+Math.floor(5*Math.random())+30*letterInd, 112+Math.floor(40*Math.random()), captchaText[letterInd]);
      image.blur(2);

      image.write(filepath,async ()=>{
        let sentmsg = await mem.user.send(`<@${mem.id}>, Hello! You just joined the server \`\`${guild.name}\`\` which has an antiraid enabled.
          **To start the verification process, please respond with the letters and numbers you see in this image (not case sensitive):** `,
          {files: [filepath]});
        fs.unlinkSync(filepath);

        let thisDmC = sentmsg.channel;

        let memIsBlind = 0;
        const filter = (m) =>{
          if(m.author.id != mem.id) return false;

          if(m.content.toUpperCase() == captchaText) {
            console.log(m.content);
            return true;
          } else {
            if(mem.died==false){
              memIsBlind++;
              thisDmC.send(`Incorrect! (${3-memIsBlind>0?3-memIsBlind+' tries left, please try again!':'Sorry, you have failed the captcha too many times'})`);
              if(memIsBlind>=3){
                mem.died = true;
                rej([mem, 'failed captcha']);
                return true;
              }
            }
            return false;
          }
        };
        thisDmC.awaitMessages(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
        .then(collected => {
          if(!mem.died){
            console.log(collected.size);
            thisDmC.send('Successfully verified with captcha!');
            mem.died = false;
            res([mem, 'success']);
          }
        }).catch(collected => {
          if(collected.size==0&&mem.died==false) {
            console.log(`After 5 minutes, the user did not respond.`);
            mem.died = true;
            res([mem, 'timeout']);
          }else{
            thisDmC.send('Uh oh, something went wrong with your verification!');
          }
        });
      });
    });
  });
};