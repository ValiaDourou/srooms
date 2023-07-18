var form = document.getElementById('logInUser');

form.onsubmit = async function(event) {

   var user=document.getElementById('user').value;
   var pswrd=document.getElementById('pass').value;
   var statusDiv = document.getElementById('status');
   var uploadButton = document.getElementById('logg');

   var data= '{\"username\":\"'+user+'\",\"password\":\"'+pswrd+'\"}';

   event.preventDefault();

   const response = await  fetch('http://localhost:8080/api/auth/login', {method: 'POST', headers:{
      'Content-Type': 'application/json',
      'Accept':'application/json'
       }, 
       body:data
     })
        
   var obj = await response.json();

   console.log(obj);

   if(obj.hasOwnProperty('status')){
      statusDiv.textContent="Authentication failed. Please check your credentials.";
   }
   else{
   var token = obj.token;
   var rtoken = obj.refreshToken;
   statusDiv.textContent="";

   const response2 = await  fetch('http://localhost:8080/api/users?pageSize=10&page=0', {method: 'GET', headers:{
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'X-Authorization': 'Bearer '+ token
       }
     })
   var obju = await response2.json();
   var obj = Object.keys(obju.data).map((key) => [key, obju.data[key]]);
   var uid;
   var uauth;
   for(var i=0;i<obj.length;i++){
      if(obj[i][1].email==user){
      uid=obj[i][1].id.id;
      uauth=obj[i][1].authority;
      }
   }

   var formData = new FormData();
   formData.append('token', token);
   formData.append('rtoken', rtoken);
   formData.append('act',0);
   formData.append('uid',uid);
   formData.append('uauth',uauth);
   const response1 = await fetch('./tokens.php',{ method: 'POST', body: formData });
   document.location.href = 'homepage.html';
   }

}

