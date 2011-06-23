var sys = require("sys"),  
    http = require("http"),
    libxmljs = require("libxmljs"),
    fs = require("fs"),
    flickr = require("./flickrreader");

var users = {
    alina: "9724292@N06",
    timo: "64366387@N08"
};

http.createServer(function(request, response) {  
    var pageNotFound = function (msg) {
        response.writeHead(404, "Page not found.");
        response.write(msg);
        response.end();
    };
    var path = request.url.split("/");
    sys.puts("Got request: " + path.join(","));

    if (path.length !== 3) {
        pageNotFound("Wrong number of arguments");
        return;
    }

    var userId = users[path[1]];
    var method = path[2];

    if (method === "update") {
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
    } else if(method === "read") {
        flickr.read({
            userId: userId,
            success: function (data) {
                response.writeHead(200);
                response.write("var loaded_flickr_data = " + data + ";");
                response.end();
            },
            error: function (err) {
                response.writeHead(500, err.toString());
                response.end();
            }
        });
    } else {
        pageNotFound("Method not found.");
    }

}).listen(80);  

sys.puts("Server running at http://localhost:80/");
