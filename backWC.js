var token;
var rtoken;
var user;
var pswrd;
function decodeContinuously(codeReader, selectedDeviceId,token,rtoken,uid,uauth) {
  codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', async (result, err) => {
    var statusDiv = document.getElementById('result');

    if (result) {
      try{
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
     formData.append('dname', obj.name);
     formData.append('did', qr);
     formData.append('act',2);
     const response1 = await fetch('./tokens.php',{ method: 'POST', body: formData });
     if(obj.type=='light'){
      if(uauth=='TENANT_ADMIN'){
     document.location.href = 'lightcontrols.html';
      }
      else{
        document.location.href = 'lightcontrolsC.html';
      }
     }
     else if(obj.type=='a/c'){
      if(uauth=='TENANT_ADMIN'){
        document.location.href = 'accontrols.html';
         }
         else{
           document.location.href = 'accontrolsC.html';
         }    
        }
     else if(obj.type=='speakers'){
      if(uauth=='TENANT_ADMIN'){
        document.location.href = 'speakercontrols.html';
         }
         else{
           document.location.href = 'speakercontrolsC.html';
         }    
    }
     }
     else if(response.status==403){
      statusDiv.textContent="You don't have permission to control this device.";
     }
     else if(response.status==401){
      var data= '{\"username\":\"'+user+'\",\"password\":\"'+pswrd+'\"}';
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
       const response2 = await fetch('./tokens.php',{ method: 'POST', body: formData });
       const response3 = await  fetch(url, {method: 'GET', headers:{
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'X-Authorization': 'Bearer '+ token
         }
       })
       var obj1 = await response3.json();
     var formData = new FormData();
     formData.append('dtype', obj1.type);
     formData.append('dname', obj1.name);
     formData.append('did', qr);
     formData.append('act',2);
     const response4 = await fetch('./tokens.php',{ method: 'POST', body: formData });
     if(obj1.type=='light'){
      if(uauth=='TENANT_ADMIN'){
     document.location.href = 'lightcontrols.html';
      }
      else{
        document.location.href = 'lightcontrolsC.html';
      }
     }
     else if(obj1.type=='a/c'){
      if(uauth=='TENANT_ADMIN'){
        document.location.href = 'accontrols.html';
         }
         else{
           document.location.href = 'accontrolsC.html';
         }    
        }
     else if(obj1.type=='speakers'){
      if(uauth=='TENANT_ADMIN'){
        document.location.href = 'speakercontrols.html';
         }
         else{
           document.location.href = 'speakercontrolsC.html';
         }    
    }
     }
    }
    catch (e){
      const response5 = await fetch('./logout.php');
      document.location.href = 'login.html';
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
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserQRCodeReader()
  console.log('ZXing code reader initialized')
  var uid;
  var uauth;

  var formData = new FormData();
   formData.append('act',1);
   const response = await fetch('./tokens.php',{ method: 'POST', body: formData });
   var data = await response.json();
   if(data.length>0){
    token=data[0];
    rtoken=data[1];
    uid=data[2];
    uauth=data[3];
    user=data[4];
    pswrd=data[5];
   }

  codeReader.getVideoInputDevices()
    .then((videoInputDevices) => {
      selectedDeviceId = videoInputDevices[0].deviceId

      document.getElementById('startButton').addEventListener('click', () => {
          decodeContinuously(codeReader, selectedDeviceId,token,rtoken,uid,uauth);

        console.log(`Started decode from camera with id ${selectedDeviceId}`)
      })
    })
    .catch((err) => {
      console.error(err)
    })
})