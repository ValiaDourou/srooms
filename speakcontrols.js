function decodeContinuously(codeReader, selectedDeviceId,token,rtoken,uid,uauth) {
    codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', async (result, err) => {
      var statusDiv = document.getElementById('result');
  
      if (result) {
        statusDiv.textContent=" ";
        var qr=result.text;
      var url= "http://localhost:8080/api/device/info/"+qr;
      const response = await  fetch(url, {method: 'GET', headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'X-Authorization': 'Bearer '+ token
         }
       })
       if(response.status==200){
      var obj = await response.json();
       var formData = new FormData();
       formData.append('dtype', obj.type);
       formData.append('did', qr);
       formData.append('act',2);
       const response1 = await fetch('./tokens.php',{ method: 'POST', body: formData });
       if(obj.type=='light'){
       document.location.href = 'lightcontrols.html';
       }
       else{
        console.log("hi");
       }
       }
  
      }
  
      if (err) {
        if (err instanceof ZXing.NotFoundException) {
        }
        if (err instanceof ZXing.ChecksumException) {
          statusDiv.textContent="Not valid QR code.";
        }
  
        if (err instanceof ZXing.FormatException) {
          statusDiv.textContent='A code was found, but it was in a invalid format.';
        }
      }
    })
  }
  
  window.addEventListener('load', async function () {
    var pH = document.getElementById('pH');
    var vH = document.getElementById('vH');
    var sname = document.getElementById('sname');    
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserQRCodeReader()
    console.log('ZXing code reader initialized')
    var token;
    var rtoken;
    var uid;
    var uauth;
    var dtype;
    var did;
    var dname;
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
      if(obj[i].key=='currentSong'){
        var cs= document.getElementById('mp3c');
        cs.play();
        //cs.src=obj[i].value;
        }
        if(obj[i].key=='volume'){
            vH.innerHTML=obj[i].value;
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
  
    codeReader.getVideoInputDevices()
      .then((videoInputDevices) => {
        selectedDeviceId = videoInputDevices[0].deviceId
  
        document.getElementById('pH').addEventListener('click', () => {
            decodeContinuously(codeReader, selectedDeviceId,token,rtoken,uid,uauth);
  
          console.log(`Started decode from camera with id ${selectedDeviceId}`)
        })
        document.getElementById('vH').addEventListener('click', () => {
            decodeContinuously(codeReader, selectedDeviceId,token,rtoken,uid,uauth);
  
          console.log(`Started decode from camera with id ${selectedDeviceId}`)
        })
        if(uauth=='TENANT_ADMIN'){
        document.getElementById('cH').addEventListener('click', () => {
            decodeContinuously(codeReader, selectedDeviceId,token,rtoken,uid,uauth);
  
          console.log(`Started decode from camera with id ${selectedDeviceId}`)
        })
      }
      })
      .catch((err) => {
        console.error(err)
      })
  })