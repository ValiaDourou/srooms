import {
  GestureRecognizer,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0"
let gestureRecognizer
      let runningMode = "VIDEO"
      let webcamRunning = false
      const videoHeight = "360px"
      const videoWidth = "480px"  
  
  window.addEventListener('load', async function () {
    var pH = document.getElementById('pH');
    var tH = document.getElementById('tH');
    var sname = document.getElementById('sname');    
    
    var clk;
    var token;
    var rtoken;
    var uid;
    var uauth;
    var dtype;
    var did;
    var dname;
    var mi=0;
    var fi=0;
    var temp;
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
     }
     sname.innerHTML=dname;
     var url="http://localhost:8080/api/plugins/telemetry/DEVICE/"+did+"/values/attributes";
     const response1 = await  fetch(url, {method: 'GET', headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'X-Authorization': 'Bearer '+ token
         }
    })
    var obj = await response1.json();
    for(var i=0;i<obj.length;i++){
        if(uauth!='CUSTOMER_USER' && obj[i].key=='fan'){
            var fH = document.getElementById('fH');
            fH.innerHTML=obj[i].value;
        }
        if(uauth!='CUSTOMER_USER' && obj[i].key=='mode'){
            var mH = document.getElementById('mH');

            mH.innerHTML=obj[i].value;
        }
        if(obj[i].key=='temperature'){
          temp=parseInt(obj[i].value);
            tH.innerHTML=obj[i].value;
        }
        if(obj[i].key=='active'){
        if(obj[i].value==false){
        pH.innerHTML="OFF";
        }
        else{
        pH.innerHTML="ON";
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
        document.getElementById('tH').addEventListener('click', () => {
          clk=2;
          if(webcamRunning===false){
            enableCam();
            }
      });
        if(uauth=='TENANT_ADMIN'){
        document.getElementById('fH').addEventListener('click', () => {
          clk=3;
          setInterval(function() {
            if(fi==1){
            if(fH.innerHTML=="low"){
              fH.innerHTML="mid";
            }
            else if(fH.innerHTML=="mid")
            {
              fH.innerHTML="high";
            }
            else{
              fH.innerHTML="low";
            }
          }
          fi=0;
        }, 2000);
          if(webcamRunning===false){
            enableCam();
            }
      });
      document.getElementById('mH').addEventListener('click', () => {
        clk=4;
        setInterval(function() {
          if(mi==1){
          if(mH.innerHTML=="dry"){
            mH.innerHTML="cool";
          }
          else if(mH.innerHTML=="cool")
          {
            mH.innerHTML="heat";
          }
          else{
            mH.innerHTML="dry";
          }
        }
        mi=0;
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
          gMovement(categoryName);
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
      
      function gMovement(categoryName){
        if(clk==1){
          if(categoryName=="Open_Palm"){
            pH.innerHTML="ON";
          }
          if(categoryName=="Closed_Fist"){
            pH.innerHTML="OFF";
          }
        }
        if(clk==2){
          if(categoryName=="Thumb_Up"){
            if(temp<35){
            temp=temp+1;
            tH.innerHTML=temp.toString();
            }
          }
          if(categoryName=="Thumb_Down"){
            if(temp>14){
            temp=temp-1;
            tH.innerHTML=temp.toString();
            }
          }
        }
        if(clk==3){
          if(categoryName=="Victory"){
            fi=1;
          }
        }
        if(clk==4){
          if(categoryName=="ILoveYou"){
            mi=1;
          }
        }
      }
    
  })