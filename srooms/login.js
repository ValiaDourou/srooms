var form = document.getElementById('logInUser');

form.onsubmit = async function(event) {

   var user=document.getElementById('user').value;
   var pswrd=document.getElementById('pass').value;
   var statusDiv = document.getElementById('status');
   var uploadButton = document.getElementById('logg');

   var data= '{\"username\":\"'+user+'\",\"password\":\"'+pswrd+'\"}';

   event.preventDefault();
   
   try{
   const response = await  fetch('http://localhost:8080/api/auth/login', {method: 'POST', headers:{
      'Content-Type': 'application/json',
      'Accept':'application/json'
       }, 
       body:data
     })
   var obj = await response.json();
   if(obj.hasOwnProperty('status')){
      statusDiv.textContent="Authentication failed. Please check your credentials.";
   }
   else{
   var token = obj.token;
   var rtoken = obj.refreshToken;
   statusDiv.textContent="";

   const response2 = await  fetch('http://localhost:8080/api/auth/user', {method: 'GET', headers:{
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'X-Authorization': 'Bearer '+ token
       }
     })

   var obj = await response2.json();
   var uid;
   var uauth;
      if(obj.email==user){
      uid=obj.id.id;
      uauth=obj.authority;
      }
   if(uauth=='SYS_ADMIN'){
      statusDiv.textContent="Due to your authority, you can't alter the state of the devices.";
   }
   else{
   var formData = new FormData();
   formData.append('token', token);
   formData.append('rtoken', rtoken);
   formData.append('act',0);
   formData.append('uid',uid);
   formData.append('uauth',uauth);
   formData.append('user',user);
   formData.append('pswrd',pswrd);
   const response1 = await fetch('./tokens.php',{ method: 'POST', body: formData });
   document.location.href = 'homepage.html';
   }
}
   }
   catch (e){
      statusDiv.textContent="The server is unavailable, please try again later.";
   }

}

