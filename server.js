/*
* @Author: Sijan
* @Date:   2017-12-10 21:48:43
* @Last Modified by:   leapfrong
* @Last Modified time: 2017-12-10 22:27:24
*/

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

// Array of Mime Types
var mimeTypes = {
	"html" : "text/html",
	"jpeg" : "image/jpeg",
	"jpg"  : "image/jpeg",
	"png"  : "image/png",
	"js"   : "text/javascript",
	"css"  : "text/css"
};

// Create Server

http.createServer(function(req, res){
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log('Loading ' + uri);
	var stats;

	try{
		// look for the filename
		stats = fs.lstatSync(fileName);

	} catch(e) {
		res.writeHead(404, {'Content-type': 'text/plain'});
		res.write('404 Not Found\n');
		res.end();
		return
	}
	// Check if file/directory
	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200, {'Content-type': mimeType});

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	} else if (stats.isDirectory()){
		// redirect to home
		res.writeHead(302, {
			'Location' : 'index.html'
		});
		res.end();

	} else {
		// raise 500 internal error
		res.writeHead(500, {'Content-type': 'text/plain'});
		res.write('500 Internal Error\n');
		res.end();
	}
}).listen(3010);