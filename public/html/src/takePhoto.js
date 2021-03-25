//获得video摄像头区域
let video = document.getElementById("video");
video.setAttribute('crossOrigin', 'anonymous');

function success(responseText){
    result=deepCopy(responseText);
    console.log("成功");
    console.log(JSON.parse(responseText));
    //return responseText;
}


function fail(request){
    console.log("失败");
    console.log(request);
}

function deepCopy(obj){
    let objCopy = {};
    for(let key in obj){
        objCopy[key] = obj[key];
    }
    return objCopy;
}

function getMedia() {
    let constraints = {
        video: {width: 500, height: 500},
        audio: false
    };
    /*
    这里介绍新的方法:H5新媒体接口 navigator.mediaDevices.getUserMedia()
    这个方法会提示用户是否允许媒体输入,(媒体输入主要包括相机,视频采集设备,屏幕共享服务,麦克风,A/D转换器等)
    返回的是一个Promise对象。
    如果用户同意使用权限,则会将 MediaStream对象作为resolve()的参数传给then()
    如果用户拒绝使用权限,或者请求的媒体资源不可用,则会将 PermissionDeniedError作为reject()的参数传给catch()
    */
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then(function (MediaStream) {
        video.srcObject = MediaStream;
        video.play();
    }).catch(function (PermissionDeniedError) {
        console.log(PermissionDeniedError);
    });
}

var result;
function takePhoto() {
    //获得Canvas对象
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 500, 500);
    let currFrame = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
    


    $.ajax(
    {
        url: '/',
        type: 'POST',
        async: 'false',
        // contentType: "application/json; charset=utf-8",
        data: {
            data:   JSON.stringify(currFrame.data),
            width:  currFrame.width,
            height: currFrame.height
        },
        success: success,
        error: fail,
    });

    if (result) console.log(result);


}