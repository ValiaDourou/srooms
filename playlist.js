async function allof(){
    const so = document.getElementById("containerbWC");
    
    const response = await fetch('./songs.php');
        
    var data = await response.json();
  if (data.length===0){
    const st = document.createElement('h3');
      st.textContent='You have no songs in your playlist!';
      so.appendChild(st);
  }else{
    
    for (let j = 0; j < data.length; j++) {
      const v = document.createElement('div');
      v.classList.add('pmc');
      const mc = document.createElement('div');
      mc.classList.add('pmusicgridcontainer');
      const im = document.createElement('img');
      im.classList.add('pim');
      im.src=data[j].image;
      const tg = document.createElement('div');
      tg.classList.add('textgridcontainer');
      const sn = document.createElement('div');
      sn.classList.add('songname');
      sn.textContent=data[j].song;
      const an = document.createElement('div');
      an.classList.add('artistname');
      an.textContent=data[j].singer;

      const buttoni=document.createElement('button');
      buttoni.textContent='Delete';
      buttoni.type='button';
      buttoni.addEventListener("click", function(){
        del(data[j].id);
    });

      so.appendChild(v);
      v.appendChild(mc);
      mc.appendChild(im);
      mc.appendChild(tg);
      tg.appendChild(sn);
      tg.appendChild(an);
      mc.appendChild(buttoni);
    }
    
}
}

async function del(wp){
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
    const rr=document.getElementById('containerbWC');
    var nformData = new FormData();
     nformData.append('s', wp);
     const rresponse = await fetch('./deletesong.php',{ method: 'POST', body: nformData });
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
     rr.innerHTML='';    
    var data = await response.json();

     if (data.length===0){
    const st = document.createElement('h2');
      st.textContent='You have no songs in your playlist!';
      rr.appendChild(st);
      changeS(did,token,'sid','image','song','singer','currentSong',0,'-','-','-','-',user,pswrd);
  }else{
    if(pid==wp){
        changeS(did,token,'sid','image','song','singer','currentSong',data[0].id,data[0].image,data[0].song,data[0].singer,data[0].mp3,user,pswrd);
    }
    for (let j = 0; j < data.length; j++) {
      const v = document.createElement('div');
      v.classList.add('pmc');
      const mc = document.createElement('div');
      mc.classList.add('pmusicgridcontainer');
      const im = document.createElement('img');
      im.classList.add('pim');
      im.src=data[j].image;
      const tg = document.createElement('div');
      tg.classList.add('textgridcontainer');
      const sn = document.createElement('div');
      sn.classList.add('songname');
      sn.textContent=data[j].song;
      const an = document.createElement('div');
      an.classList.add('artistname');
      an.textContent=data[j].singer;

      const buttoni=document.createElement('button');
      buttoni.textContent='Delete';
      buttoni.type='button';
      buttoni.addEventListener("click", function(){
        del(data[j].id);
    });

      rr.appendChild(v);
      v.appendChild(mc);
      mc.appendChild(im);
      mc.appendChild(tg);
      tg.appendChild(sn);
      tg.appendChild(an);
      mc.appendChild(buttoni);
    }
    
}
}
catch (e){
  const response5 = await fetch('./logout.php');
      document.location.href = 'login.html';
}
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
        times++;
          if(times==1){
          webcamRunning = false;
        getNewToken(user,pswrd);
        changeS(deviceId,token,key0,key1,key2,key3,key4,value0,value1,value2,value3,value4,user,pswrd);
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
        document.location.href = 'login.html';
     }
  }
 }
