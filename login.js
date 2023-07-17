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
   const response2 = await  fetch('http://localhost:8080/api/users?pageSize=10&page=0', {method: 'GET', headers:{
      'Content-Type': 'application/json',
      'Accept':'application/json',
      'X-Authorization': 'Bearer '+ token
       }
     })
   var obju = await response2.json();
   var obj = JSON.stringify(obju);
   const myArray = obj.split("\"name\":");
   for(var i=0;i<myArray.length;i++){
      var mys=myArray[i].split("\"id\":");
     console.log(mys);
   }
   var formData = new FormData();
   formData.append('token', token);
   formData.append('rtoken', rtoken);
   formData.append('act',0);
   const response1 = await fetch('./tokens.php',{ method: 'POST', body: formData });
   }

}

