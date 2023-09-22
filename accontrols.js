import {
  GestureRecognizer,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0"
let gestureRecognizer
      let runningMode = "VIDEO"
      let webcamRunning = false
      const videoHeight = "360px"
      const videoWidth = "480px"  
      var flist = ["low","mid","high"];
      var mlist = ["dry","cool","heat"];
      var token;
      var rtoken;
  
  window.addEventListener('load', async function () {
    var pH = document.getElementById('pH');
    var tH = document.getElementById('tH');
    var sname = document.getElementById('sname');    
    
    var clk;
    var uid;
    var uauth;
    var dtype;
    var did;
    var dname;
    var mi=0;
    var fi=0;
    var tu=0;
    var td=0;
    var temp;
    var user;
    var pswrd;
    var times=0;
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
      user=data[7];
      pswrd=data[8];
     }
     sname.innerHTML=dname;
     try{
     var url="http://localhost:8080/api/plugins/telemetry/DEVICE/"+did+"/values/attributes";
     const response1 = await  fetch(url, {method: 'GET', headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'X-Authorization': 'Bearer '+ token
         }
    })
    if(response1.status==401){
      var data= '{\"username\":\"'+user+'\",\"password\":\"'+pswrd+'\"}';
  const response3 = await  fetch('http://localhost:8080/api/auth/login', {method: 'POST', headers:{
  'Content-Type': 'application/json',
  'Accept':'application/json'
   }, 
   body:data
 })
    
   var obj1 = await response3.json();
   token = obj1.token;
   rtoken = obj1.refreshToken;
   var formData = new FormData();
   formData.append('token', token);
   formData.append('rtoken', rtoken);
   formData.append('act',4);
   const response4 = await fetch('./tokens.php',{ method: 'POST', body: formData });
      var url="http://localhost:8080/api/plugins/telemetry/DEVICE/"+did+"/values/attributes";
     const response2 = await  fetch(url, {method: 'GET', headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'X-Authorization': 'Bearer '+ token
         }
    })
    var obj = await response2.json();
    }
    else{
    var obj = await response1.json();
    }
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
        if(obj[i].value=='false'){
        pH.innerHTML="OFF";
        }
        else{
        pH.innerHTML="ON";
        }
      }
      }
    }
    catch (e){
      const response5 = await fetch('./logout.php');
      document.location.href = 'login.html';
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
          setInterval(function() {
            if(tu==1){
              if(temp<35){
                temp=temp+1;
                let promise = Promise.resolve(changeT(did,token,'temperature',temp,1,user,pswrd));
            promise.then(function (val){
              if(val===true){
                tH.innerHTML=temp.toString();
            }
          });
                }
                tu=0;
          }
          if(td==1){
            if(temp>14){
              temp=temp-1;
              let promise = Promise.resolve(changeT(did,token,'temperature',temp,1,user,pswrd));
          promise.then(function (val){
            if(val===true){
              tH.innerHTML=temp.toString();
          }
        });
              }
              td=0;
          }
        }, 500);
          if(webcamRunning===false){
            enableCam();
            }
      });
        if(uauth=='TENANT_ADMIN'){
        document.getElementById('fH').addEventListener('click', () => {
          clk=3;
          setInterval(function() {
            if(fi==1){
              var t;
              var index = flist.indexOf(fH.innerHTML);
              if(flist.length>index+1){
                t=flist[index+1];
                }
                else{
                  t=flist[0];
                }
                let promise = Promise.resolve(changeT(did,token,'fan',t,0,user,pswrd));
                promise.then(function (val){
                if(val===true){
                  fH.innerHTML=t;
                }
                });
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
            var m;
            var index = mlist.indexOf(mH.innerHTML);
            if(mlist.length>index+1){
            m=mlist[index+1];
            }
            else{
              m=mlist[0];
            }
            let promise = Promise.resolve(changeT(did,token,'mode',m,0,user,pswrd));
                promise.then(function (val){
                if(val===true){
                  mH.innerHTML=m;
                }
                });
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
          gMovement(categoryName,did,token,user,pswrd);
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
      
      function gMovement(categoryName,deviceId,token,user,pswrd){
        if(clk==1){
          if(categoryName=="Open_Palm"){
            let promise = Promise.resolve(changeT(deviceId,token,'active','true',0,user,pswrd));
            promise.then(function (val) {
              if(val===true){
                pH.innerHTML="ON";
                }
            });
          }
          if(categoryName=="Closed_Fist"){
            let promise = Promise.resolve(changeT(deviceId,token,'active','false',0,user,pswrd));
            promise.then(function (val) {
              if(val===true){
            pH.innerHTML="OFF";
            }
          });
        }
      }
        if(clk==2){
          if(categoryName=="Thumb_Up"){
            tu=1;
          }
          if(categoryName=="Thumb_Down"){
            td=1;
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
    
      async function changeT(deviceId,token,key,value,ios,user,pswrd){
        var data;
        if(ios==0){
          data="{\""+key+"\":\""+value+"\"}";
        }
        else{
          data="{\""+key+"\":"+value+"}";
        }
        var url="http://localhost:8080/api/plugins/telemetry/"+deviceId+"/SERVER_SCOPE";
        try{
         const response = await  fetch(url, {method: 'POST', headers:{
            'Content-Type': 'application/json',
            'Accept':'application/json',
            'X-Authorization': 'Bearer '+ token
             },body:data
        })
        if(response.status==200){
          return true;
           }
           else if(response.status==401){
            times++;
        if(times==1){
        webcamRunning = false;
            getNewToken(user,pswrd);
            changeT(deviceId,token,key,value,ios,user,pswrd);
        }
        else{
          return false;
        }
           }
           else{
            return false;
           }
          }
          catch (e){
            const response5 = await fetch('./logout.php');
            document.location.href = 'login.html';
          }
      }
    
      async function getNewToken(user,pswrd){
        var data= '{\"username\":\"'+user+'\",\"password\":\"'+pswrd+'\"}';
        try{
        const response1 = await  fetch('http://localhost:8080/api/auth/login', {method: 'POST', headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json'
         }, 
         body:data
       })
          
         var obj = await response1.json();
         token = obj.token;
         rtoken = obj.refreshToken;
         var formData = new FormData();
         formData.append('token', token);
         formData.append('rtoken', rtoken);
         formData.append('act',4);
         times=0;
         enableCam();
         const response2 = await fetch('./tokens.php',{ method: 'POST', body: formData });
      }
      catch (e){
        const response5 = await fetch('./logout.php');
      document.location.href = 'login.html';
      }
      }
  })

  