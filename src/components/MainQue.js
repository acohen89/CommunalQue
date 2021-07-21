import React from 'react'


function makeHash(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function MainQue() {
  return (
    <body>
       <p> Que With Id: {makeHash(6)} </p>
    </body >
  );
}

export default MainQue;

