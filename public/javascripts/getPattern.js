var trainer = require('./FeatTrainer');
var fs = require('fs');
var Frame = require('./Frame')
var PNG = require('pngjs').PNG;


function pngRead(path){
    let buffer = fs.readFileSync(path);
    let data = PNG.sync.read(buffer);
    return data;
}

let imgPath = 'D:/Github/expressStudy/public/images/'
let patArr = new Array();
let frame = new Frame();

let imgs = fs.readdirSync(imgPath);

for (let img of imgs){

    let imgData = pngRead(imgPath+img); 

    frame.width = imgData.width;
    frame.height = imgData.height;
    frame.data = new Uint8Array(imgData.data);

    let grayImg = trainer.getGrayScaleMat(frame);
    let pattern = trainer.trainPattern(grayImg);
    patArr.push(pattern);
}

module.exports = patArr;


