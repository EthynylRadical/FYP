
function toggleClass(ele, className){
  let classList =ele.classList;
  if(classList.contains(className)){
    classList.remove(className)
  }else {
    classList.add(className)
  }
}


function loadImageAsync(img){
  console.log(typeof img);
  if (typeof img === 'string') {
    let src = img;
    img = new Image();
    img.src = src;
  }
  if (img.complete) {
    return Promise.resolve(img);
  }
  return new Promise(function (resolve, rej){
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', () => rej(img))
  })
}


// function $(slt, ele){
//   return (ele || document).querySelector(slt);
// }


function readPixel(texture, size){
  let gl = $('#gl-cvs').getContext('webgl');
  let framebuffer = new Flip.GL.FrameBuffer({
    width: size[0],
    height: size[1]
  });
  let result = framebuffer.readTexture(gl, texture);
  framebuffer.disposeGLHandle(gl);
  return result;
}