const b = document.getElementById("add");
var formf = document.getElementById('addF');
var statusF = document.getElementById('statusr');
const regc=document.getElementById('cr');

var mp3k=0,imk=0;

formf.onsubmit = async function(event) {
    event.preventDefault();
    
    var fileSelect = document.getElementById('mymp3file');
    var statusDiv = document.getElementById('statusm');
    var mp;
    var im;

    statusDiv.innerHTML = 'Uploading . . . ';
  if(!(document.getElementById("mymp3file") && document.getElementById("mymp3file").value)) {
    statusDiv.innerHTML = "You must select a file first!";
  }else{
    var files = fileSelect.files;

    var formData = new FormData();

    var file = files[0]; 
    if (!file.type.match('audio.*')) {
        statusDiv.innerHTML = 'You cannot upload this file because it’s not an MP3 file.';
    }
    else{
    formData.append('mymp3file', file, file.name);

    const response = await fetch('./uploadmp3file.php',{ method: 'POST', body: formData });
  
    var ndata = await response.json();
    if(ndata.length===0)
    {
      statusDiv.innerHTML = "An error occured please try again!";

    }
    else{
    for (let i = 0; i < ndata.length; i++) {
        mp=ndata[0];
        statusDiv.innerHTML = "You have successfully uploaded the file!";
        mp3k=1;
      }
  }
}
}

var fileSelectim = document.getElementById('myimfile');
    var statusDivim = document.getElementById('statusi');

    statusDivim.innerHTML = 'Uploading . . . ';
  if(!(document.getElementById("myimfile") && document.getElementById("myimfile").value)) {
    statusDivim.innerHTML = "You must select a file first!";
  }else{
    var files = fileSelectim.files;

    var formData = new FormData();

    var file = files[0]; 
    if (!file.type.match('jpg.*') && !file.type.match('png.*') && !file.type.match('jpeg.*')) {
        statusDivim.innerHTML = 'You cannot upload this file because it’s not a JPG, PNG or JPEG file.';
    }
    else{
    formData.append('mymimfile', file, file.name);

    const response = await fetch('./uploadimfile.php',{ method: 'POST', body: formData });
  
    var ndata = await response.json();
    if(ndata.length===0)
    {
      statusDivim.innerHTML = "An error occured please try again!";

    }
    else{
    for (let i = 0; i < ndata.length; i++) {
        im=ndata[0];
        statusDivim.innerHTML = "You have successfully uploaded the file!";
        imk=1;
      }
  }
}
  }

if(imk==1 && mp3k==1){
    var s=document.getElementById('asong').value;
    var a=document.getElementById('aartist').value;
    console.log(mp);
    console.log(im);
    var formData = new FormData();
   formData.append('s', s);
   formData.append('a', a);
   formData.append('mp', mp);
   formData.append('im', im);
   const response = await fetch('./addsong.php',{ method: 'POST', body: formData });
   
   var data = await response.json();
   if (data.length==0) {
       statusF.innerHTML = 'Something went wrong, please try again.';
   }
   else{
    statusF.innerHTML = 'You have successfully added the song!';
   }
}
else{
    statusF.innerHTML = "An error occured please try again!";
}
}

regc.onclick= async function(){
    var token;
var rtoken;
var uid;
var uauth;
var dtype;
var did;
var dname;
var user;
var pswrd;
var pid;
     var formData = new FormData();
     formData.append('act',3);
     const r = await fetch('./tokens.php',{ method: 'POST', body: formData });
     var data = await r.json();
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
     var url="http://localhost:8080/api/plugins/telemetry/DEVICE/"+did+"/values/attributes";
     try{
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
        if(obj[i].key=='sid'){
            pid=obj[i].value;
            }
  }    
  const response = await fetch('./songs.php');
 var data = await response.json();
  if(pid==0){
    changeS(did,token,'sid','image','song','singer','currentSong',data[0].id,data[0].image,data[0].song,data[0].singer,data[0].mp3,user,pswrd);
  }
}
catch (e){
  const response5 = await fetch('./logout.php');
      document.location.href = 'login.html';
}
    var s=document.getElementById('asong');
    var a=document.getElementById('aartist');
    var mp=document.getElementById('mymp3file');
    var im=document.getElementById('myimfile');
    var statusDiv = document.getElementById('statusr');
    var statusDivm = document.getElementById('statusm');
    var statusDivim = document.getElementById('statusi');

    s.value='';
    a.value='';
    mp.value='';
    im.value='';
    statusDiv.innerHTML='';
    statusDivm.innerHTML='';
    statusDivim.innerHTML='';
    document.location.href = 'playlist.html';
    async function changeS(deviceId,token,key0,key1,key2,key3,key4,value0,value1,value2,value3,value4,user,pswrd){
        var  data="{\""+key0+"\":\""+value0+"\",\""+key1+"\":\""+value1+"\""+",\""+key2+"\":\""+value2+"\",\""+key3+"\":\""+value3+"\",\""+key4+"\":\""+value4+"\"}";
      
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
            getNewToken(user,pswrd);
            changeS(deviceId,token,key0,key1,key2,key3,key4,value0,value1,value2,value3,value4,user,pswrd);
           }
           else{
            return false;
           }
          }
          catch (e){
            document.location.href = 'login.html';
         }
      }
}

