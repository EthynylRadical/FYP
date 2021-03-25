

var trainer = require('./FeatTrainer');
var patArr = require('./getPattern');
const THRES = 5;
var matchThres = THRES;
var id = 0;

var process = function (imgData){
  //console.log('Function <process> called!')
  //=====================================================================================================
  let grayImage = trainer.getGrayScaleMat(imgData);
  //console.log(grayImage);
  // let grayImage = imgData.data;
  let features = trainer.describeFeatures(grayImage); //计算特征点
  //console.log('Feature described!')
  let i = 1;
  for (let pat of patArr) {
    console.log(`Matching[${i}]...`);
    console.log(`BUFFER${i}:${pat.descriptors[0].buffer}`);
    let matches = trainer.matchPattern(features.descriptors, pat.descriptors); //特征点匹配
    console.log(matches.length);
    //console.log(`Finding transform matrix[${i}]...`);
    let result = trainer.findTransform(matches, features.keyPoints, pat.keyPoints); //计算仿射矩阵
    if (result.goodMatch > matchThres) { 
      // best = pat;
      matchThres = result.goodMatch;
      id = i;
      console.log(`id:${i}, match:${result.goodMatch}`);
    }
    i++;
  }
  matchThres = THRES;
  //console.log('Finished!');
  if (id) {
    console.log(`${id}.png matched!`)
  }
  else {
    console.log(`NO MATCH!!!`);
  }
  //=====================================================================================================
  return id;
}

module.exports = process;

