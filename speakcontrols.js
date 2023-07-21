import {
  GestureRecognizer,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0"
let gestureRecognizer
      let runningMode = "VIDEO"
      let webcamRunning = false
      const videoHeight = "360px"
      const videoWidth = "480px"  
      var songList = [
        {
            song: '1000 Kosmoi',
            singer: 'Dani Gambino',
            image: '1000kosmoi.jpg',
            mp3: '1000KOSMOI.mp3'
        },
        {
          song: '1000 Blunts',
          singer: '$uicideboy$',
          image: '1000BLUNTS.jpg',
          mp3: '1000BLUNTS.mp3'
        },
        {
          song: 'Escapism',
          singer: 'RAYE',
          image: 'ESCAPISM.jpg',
          mp3: 'ESCAPISM.mp3'
        }
    ];
      
  
  window.addEventListener('load', async function () {
    var pH = document.getElementById('pH');
    var vH = document.getElementById('vH');
    var sname = document.getElementById('sname');    
    var singer = document.getElementById('artistname');    
    var song = document.getElementById('songname');    
    var image = document.getElementById('image');    

    var clk;
    var token;
    var rtoken;
    var uid;
    var uauth;
    var dtype;
    var did;
    var dname;
    var vol;
    var inter=0;
    var formData = new FormData();
     formData.append('act',3);
     const response = await fetch('./tokens.php',{ method: 'POST', body: formData });
     var data = await response.json();
     if(data.length>0){
      token=data[0];
      rtoken=data[1];
      uid=data[2];
      uauth=data[3];
      dtype=data[4];
      did=data[5];
      dname=data[6];
     }     sname.innerHTML=dname;
     var url="http://localhost:8080/api/plugins/telemetry/DEVICE/"+did+"/values/attributes";
     const response1 = await  fetch(url, {method: 'GET', headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'X-Authorization': 'Bearer '+ token
         }
    })
    var obj = await response1.json();
    for(var i=0;i<obj.length;i++){
      if(obj[i].key=='currentSong'){
        var cs= document.getElementById('mp3c');
        cs.src=obj[i].value;
        }
        if(obj[i].key=='volume'){
          vol=parseInt(obj[i].value);
            vH.innerHTML=obj[i].value;
        }
        if(obj[i].key=='singer'){
          singer.innerHTML=obj[i].value;
      }
      if(obj[i].key=='song'){
        song.innerHTML=obj[i].value;
    }
      if(obj[i].key=='image'){
       image.src=obj[i].value;
     }
        if(obj[i].key=='active'){
        if(obj[i].value=='false'){
        pH.innerHTML="OFF";
        }
        else{
        pH.innerHTML="ON";
        cs.play();
        }
      }
      }

const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  )
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU"
    },
    runningMode: runningMode
  })
}
createGestureRecognizer()

const video = document.getElementById("video")
const canvasElement = document.getElementById("output_canvas")
const canvasCtx = canvasElement.getContext("2d")
const gestureOutput = document.getElementById("gesture_output")

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  document.getElementById('pH').addEventListener('click', () => {
    clk=1;
    if(webcamRunning===false){
    enableCam();
    }
});
  document.getElementById('vH').addEventListener('click', () => {
    clk=2;
    if(webcamRunning===false){
      enableCam();
      }
});
  if(uauth=='TENANT_ADMIN'){
  document.getElementById('cH').addEventListener('click', () => {
    clk=3;
    setInterval(function() {
      if(inter==1){
      var smp,ss,ssi,si;
      var index = songList.findIndex(item => item.song == song.innerHTML);
      if(songList.length>index+1){
      smp=songList[index+1].mp3;
      ss=songList[index+1].song;
      ssi=songList[index+1].singer;
      si=songList[index+1].image;
        }
        else{
          smp=songList[0].mp3;
          ss=songList[0].song;
          ssi=songList[0].singer;
          si=songList[0].image;       
         }
      if(changeS(did,token,'image','song','singer','currentSong',si,ss,ssi,smp)){
      cs.src=smp;
      song.innerHTML=ss;
      singer.innerHTML=ssi;
      image.src=si;
    
      if(pH.innerHTML=="ON"){
        cs.play();
        }
        else{
        cs.pause();
        }
    }
  }
    inter=0;
  }, 2000);
    if(webcamRunning===false){
      enableCam();
      }
});
  }

} else {
  console.warn("getUserMedia() is not supported by your browser")
}

// Enable the live webcam view and start detection.
function enableCam() {
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load")
    return
  }

    webcamRunning = true


  // getUsermedia parameters.
  const constraints = {
    video: true
  }

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.srcObject = stream
    video.addEventListener("loadeddata", predictWebcam)
  })
}

let lastVideoTime = -1
let results = undefined
async function predictWebcam() {
  const webcamElement = document.getElementById("video")
  // Now let's start detecting the stream.

  let nowInMs = Date.now()
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime
    results = gestureRecognizer.recognizeForVideo(video, nowInMs)
  }

  canvasCtx.save()
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)

  canvasElement.style.height = videoHeight
  webcamElement.style.height = videoHeight
  canvasElement.style.width = videoWidth
  webcamElement.style.width = videoWidth
  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5
      })
      drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 })
    }
  }
  canvasCtx.restore()
  if (results.gestures.length > 0) {
    gestureOutput.style.display = "inline-block"
    gestureOutput.style.width = videoWidth
    const categoryName = results.gestures[0][0].categoryName
    gMovement(categoryName,did,token);
    const categoryScore = parseFloat(
      results.gestures[0][0].score * 100
    ).toFixed(2)
    gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %`
  } else {
    gestureOutput.style.display = "none"
  }
  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam)
  }
}

function gMovement(categoryName,deviceId,token){
  if(clk==1){
    if(categoryName=="Open_Palm"){
      if(changeT(deviceId,token,'active','true',0)){
        pH.innerHTML="ON";
        cs.play();
      }
    }
    if(categoryName=="Closed_Fist"){
      if(changeT(deviceId,token,'active','false',0)){
      pH.innerHTML="OFF";
      cs.pause();
      }
    }
  }
  if(clk==2){
    if(categoryName=="Thumb_Up"){
      if(vol<100){
        vol=vol+1;
        if(changeT(deviceId,token,'volume',vol,1)){
      vH.innerHTML=vol.toString();
        }
      }
    }
    if(categoryName=="Thumb_Down"){
      if(vol>0){
        vol=vol-1;
        if(changeT(deviceId,token,'volume',vol,1)){
      vH.innerHTML=vol.toString();
        }
      }
    }
  }
  if(clk==3){
    if(categoryName=="Victory"){
      inter=1;
    }
  }
}
  })

  async function changeT(deviceId,token,key,value,ios){
    var data;
    if(ios==0){
      data="{\""+key+"\":\""+value+"\"}";
    }
    else{
      data="{\""+key+"\":"+value+"}";
    }
    var url="http://localhost:8080/api/plugins/telemetry/"+deviceId+"/SERVER_SCOPE";
     const response = await  fetch(url, {method: 'POST', headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'X-Authorization': 'Bearer '+ token
         },body:data
    })
    if(response.status==200){
      return true;
       }
       else{
        return false;
       }
  }

  async function changeS(deviceId,token,key1,key2,key3,key4,value1,value2,value3,value4){
    var  data="{\""+key1+"\":\""+value1+"\",\""+key2+"\":\""+value2+"\",\""+key3+"\":\""+value3+"\",\""+key4+"\":\""+value4+"\"}";

    var url="http://localhost:8080/api/plugins/telemetry/"+deviceId+"/SERVER_SCOPE";
     const response = await  fetch(url, {method: 'POST', headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'X-Authorization': 'Bearer '+ token
         },body:data
    })
    if(response.status==200){
      return true;
       }
       else{
        return false;
       }
  }