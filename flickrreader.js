var sys = require("sys"),
    http = require("http"),
    fs = require("fs"),
    libxmljs = require("libxmljs");

exports.fetch = function (options) {
    var connection = http.createClient(80, "api.flickr.com"),
        request = connection.request("GET", "/services/feeds/photos_public.gne?id=" + options.userId + "@N08&lang=en-us&format=rss_200", { host: "api.flickr.com" });

    request.addListener("response", function (response) {
        var resp = "";
        response.addListener("data", function (chunk) {
            resp += chunk;
        });

        response.addListener("end", function () {
            var xmlDoc = libxmljs.parseXmlString(resp),
                match = xmlDoc.find("//*[local-name()='content']//@url"),
                data = { images: [] }, stringData;

            for (var key in match) {
                data.images.push(match[key].text());
            }

            stringData = JSON.stringify(data);
            sys.puts(stringData);
            
            fs.writeFile("images_" + options.userId + ".json", stringData, function (err) {
                if (err) {
                    if (options.error) {
                        options.error(err);
                    }
                } else {
                    if (options.success) {
                        options.success(data);
                    }
                }
            });
        });
    });
    
    request.end();
};


exports.read = function (options) {
    fs.readFile("images_" + options.userId + ".json", "utf-8", function (err, data) {
        if (err) {
            if (options.error) {
                options.error(err);
            }
        } else {
            if (options.success) {
                options.success(data);
            }
        }
    });
};
