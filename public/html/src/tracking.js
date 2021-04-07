

var trainer = new FeatTrainer();
var lastTransform;
let playState = 1;

let video = document.getElementById("camera");
let mVideo = document.getElementById('video');
getWebRTCVideoAsync()
.then(function (video){
  let cvs = document.getElementById("canvas");
  cvs.width = video.videoWidth;
  cvs.height = video.videoHeight;
  // cvs.style.width = document.documentElement.clientWidth + 'px';
  // cvs.style.height = document.documentElement.clientHeight + 'px';
  // document.body.appendChild(cvs);
  // loop(video, mVideo);
    recognizing(video);
  
})




// function loop(video, mVideo) {
//   recognizing(video, mVideo);
//   requestAnimationFrame(loop(video, mVideo));
// }


function fail(request){
  console.log("失败");
  console.log(request);
}




function recognizing(video) {
  if (video.readyState === 4) {
  let cache = document.getElementById("camCache");
  let ctxCache = cache.getContext('2d');
  ctxCache.drawImage(video, 0, 0, 500, 500);
  let currFrame = ctxCache.getImageData(0, 0, video.videoWidth, video.videoHeight);////
  let grayImage = trainer.getGrayScaleMat(currFrame);
  $.ajax( {
    url: '/',
    type: 'POST',
    async: 'false',
    data: {
      data:   JSON.stringify(grayImage.data),
      width:  currFrame.width,
      height: currFrame.height
    }
  })
  .then(success, fail);
  }
  setTimeout("recognizing(video)", 3000);


  function success(resData) {
    let res = new Object(JSON.parse(resData));
    if(res.id === 0){
      console.log(`#################NO Match!!!!!##################`)
      return;
    }
    console.log(`id: ${res.id}`);
    let pat = res.pat;
    for (item of pat.descriptors) {
      item.buffer.f32 = new Float32Array(Object.values(item.buffer.f32));
      item.buffer.f64 = new Float64Array(Object.values(item.buffer.f64));
      item.buffer.i32 = new Int32Array(Object.values(item.buffer.i32));
      item.buffer.u8 = new Uint8Array(Object.values(item.buffer.u8));
      item.data = new Uint8Array(Object.values(item.data));
    }
    
    if (mVideo.src !==  "http://localhost:3000/objects/2.mp4") {
      mVideo.setAttribute('src', `./objects/${res.id}.mp4`);
    }
    console.log(`${mVideo.src}`);
    function render() {
      let state = drawVideo(video, mVideo, pat);
      if (state) {
        // mVideo.style.display = "inline";
        // document.getElementById("video").play();
        requestAnimationFrame(render);
      }
    }
    // if (playState) {
    //   document.getElementById("video").play();
    //   playState = 0;
    // }
    // render();
    requestAnimationFrame(render);
    //document.getElementById("video").pause();
    // mVideo.style.display = "none";
  }

  function drawVideo(video, mVideo, pattern) {
    console.log('==========DRAW VIDEO===========')
    let cache = document.getElementById("camCache");
    let ctxCache = cache.getContext('2d');
    ctxCache.drawImage(video, 0, 0, 500, 500);
  
    if (pattern) {
  
      //=====================================================================================================
      let frameCache = ctxCache.getImageData(0, 0, video.videoWidth, video.videoHeight)
      let grayImage = trainer.getGrayScaleMat(frameCache);
      let features = trainer.describeFeatures(grayImage); //计算特征点
      let matches = trainer.matchPattern(features.descriptors, pattern.descriptors); //特征点匹配
      console.log(matches.length);
      let result = trainer.findTransform(matches, features.keyPoints, pattern.keyPoints); //计算仿射矩阵
      //=====================================================================================================
      if(result) console.log(result.goodMatch);
      let transform = result && result.goodMatch > 8 ? result.transform : lastTransform;
      if (transform) {
        ctxCache.save();
        let [ a, c, e, b, d, f ] = transform.data;
        let size = pattern.levels[ 0 ];
  
        ctxCache.transform(a, b, c, d, e, f);
        ctxCache.drawImage(mVideo, 0, 0, mVideo.videoWidth, mVideo.videoHeight, 0, 0, size[ 0 ], size[ 1 ]);
        ctxCache.restore();
        lastTransform = transform;
        return 1;
      }
      else {
        console.log("**************NO TRANS MATRIX!!!**************");
        return 0;
      }    
    }
    else console.log("**************NO PAT MATRIX!!!**************");
      return 0;
    
  }
  
}


function getWebRTCVideoAsync(){
  let constraints = {
    video: {width: 500, height: 500},
    audio: false
  };
  return new Promise(function (res, rej){
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function (MediaStream) {
      video.srcObject = MediaStream;
      video.play();
      res(video);
    })
    .catch(function (PermissionDeniedError) {
      console.log(PermissionDeniedError);
    })
  })
}




