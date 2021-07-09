const http = require("http");
const fs = require("fs");
const port = 3000;

const server = http.createServer(function(req, res) { 
    res.writeHead(200, {"Content-Type": "text/html"})
    if(req.url == "/gLog"){
        fs.readFile("Pages/goodLogin.html", function(error, data){
            if(error){ 
                res.writeHead(404);
                res.write("Error: file not found");
            } else {
                res.write(data);
            }
            res.end();
        });
    } else {
        fs.readFile("Pages/index.html", function(error, data){
            if(error){ 
                res.writeHead(404);
                res.write("Error: file not found");
            } else {
                res.write(data);
            }
            res.end();
        });
    }
});

server.listen(port, function(error){
    if(error){
        console.log("Something went wrong " + error);
    } else {
        console.log("Server listening on port " + port);
    }
});