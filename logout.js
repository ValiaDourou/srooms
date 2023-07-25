async function logout() {

  var token;
  var rtoken;
  var uid;
  var uauth;
  var user;
  var pswrd;
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
    const response1 = await  fetch('http://localhost:8080/api/auth/logout', {method: 'POST', headers:{
       'Accept':'*/*',
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
          
         var obj = await response3.json();
         token = obj.token;
         rtoken = obj.refreshToken;
         var formData = new FormData();
         formData.append('token', token);
         formData.append('rtoken', rtoken);
         formData.append('act',4);
         const response2 = await fetch('./tokens.php',{ method: 'POST', body: formData });
         const response4 = await  fetch('http://localhost:8080/api/auth/logout', {method: 'POST', headers:{
       'Accept':'*/*',
       'X-Authorization': 'Bearer '+ token
        }
      })
      const response5 = await fetch('./logout.php');
      document.location.href = 'login.html';
    }
      else if(response1.status==200){
        const response5 = await fetch('./logout.php');
        document.location.href = 'login.html';
      }
    }
 
 
 