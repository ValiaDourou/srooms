const video = document.getElementById("bwcelement");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // camera akse
      navigator.mediaDevices.getUserMedia({ video: true }).then(async function(stream) {
        // balto strim sto video eleme
        video.srcObject = stream;

        // arxinas ton qr code sCane
        const codeReader = new ZXing.BrowserQRCodeReader();
        // scanar gia qr
        codeReader.decodeFromVideoDevice(undefined, "bwcelement", function(result) {
          // to brhke
          console.log('Detected QR code:', result.text);
          alert('Detected QR code: ' + result.text);
        }, function(error) {
          // arxidia brhke
          console.error(error);
        });
      }).catch(function(error) {
        // de brhke th camera
        console.error('Unable to access the camera:', error);
      });
    } else {
      console.error('Media devices are not supported.');
    }