const gifs = [
  "http://i0.kym-cdn.com/photos/images/original/001/256/969/543.jpg",
  "http://i3.kym-cdn.com/photos/images/facebook/001/242/548/f0f.jpg",
  "https://i.ytimg.com/vi/pAcf_VV8KmI/maxresdefault.jpg",
  "http://i3.kym-cdn.com/photos/images/original/001/243/406/73c.jpg",
  "http://i2.kym-cdn.com/photos/images/newsfeed/001/263/237/be8.gif",
  "http://i.imgur.com/sqaPWSV.gifv",
  "https://pbs.twimg.com/media/CgggRytUUAAmvT6.jpg"
];

module.exports = {
  name: "everyone",
  async func(msg, { send }) {
    return send(gifs[_.random(0,gifs.length-1)]);
  }
};