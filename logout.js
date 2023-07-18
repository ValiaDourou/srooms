async function logout() {

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
    const response1 = await  fetch('http://localhost:8080/api/auth/logout', {method: 'POST', headers:{
       'Accept':'*/*',
       'X-Authorization': 'Bearer '+ token
        }
      })
      document.location.href = 'login.html';
    }
 
 
 