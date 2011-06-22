var sys = require("sys"),  
    http = require("http"),
    libxmljs = require("libxmljs"),
    fs = require("fs"),
    flickr = require("./flickrreader");

var userId = "64366387";

http.createServer(function(request, response) {  
    sys.puts("Got request: " + request.url);

    if (request.url === "/update") {
        flickr.fetch({
            userId: userId,
            success: function (data) {
                response.writeHead(200);
                for (var i = 0; i < data.images.length; i++) {
                    response.write("<a href='" + data.images[i] + "'>" + data.images[i] + "</a><br />");
                }
                response.write(data.images.length + " images read!");
                response.end();
            },
            error: function (err) {
                response.writeHead(500, err.toString());
                response.end();
            }
        });
    } else if(request.url === "/read") {
        flickr.read({
            userId: userId,
            success: function (data) {
                response.writeHead(200);
                response.write(data);
                response.end();
            },
            error: function (err) {
                response.writeHead(500, err.toString());
                response.end();
            }
        });
    } else {
        response.writeHead(404, "Page not found.");
        response.end();
    }

}).listen(80);  

sys.puts("Server running at http://localhost:80/");
