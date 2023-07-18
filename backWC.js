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
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserQRCodeReader()
  console.log('ZXing code reader initialized')
  var token;
  var rtoken;
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