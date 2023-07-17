function decodeOnce(codeReader, selectedDeviceId) {
  codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
    console.log(result)
    document.getElementById('result').textContent = result.text
  }).catch((err) => {
    console.error(err)
    document.getElementById('result').textContent = err
  })
}

window.addEventListener('load', function () {
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserQRCodeReader()
  console.log('ZXing code reader initialized')

  codeReader.getVideoInputDevices()
    .then((videoInputDevices) => {
      selectedDeviceId = videoInputDevices[0].deviceId

      document.getElementById('startButton').addEventListener('click', () => {
          decodeOnce(codeReader, selectedDeviceId);

        console.log(`Started decode from camera with id ${selectedDeviceId}`)
      })
    })
    .catch((err) => {
      console.error(err)
    })
})