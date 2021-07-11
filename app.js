const express = require('express');
const app = express();
const path = require('path');
const port = 3000;



app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, '/dist/index.html'))
    console.log(req.url);
});
app.get("/gLog", function(req, res){
    res.sendFile(path.join(__dirname, '/dist/goodLogin.html'))
    console.log(req.url);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
// const server = http.createServer(function(req, res) { 
//     res.writeHead(200, {"Content-Type": "text/html"})
//     if(req.url == "/gLog"){
//         fs.readFile("dist/goodLogin.html", function(error, data){
//             if(error){ 
//                 res.writeHead(404);
//                 res.write("Error: file not found");
//             } else {
//                 res.write(data);
//             }
//             res.end();
//         });
//     } else {
//         fs.readFile("dist/index.html", function(error, data){
//             if(error){ 
//                 res.writeHead(404);
//                 res.write("Error: file not found");
//             } else {
//                 res.write(data);
//             }
//             res.end();
//         });
//     }
// });

// server.listen(port, function(error){
//     if(error){
//         console.log("Something went wrong " + error);
//     } else {
//         console.log("Server listening on port " + port);
//     }
// });