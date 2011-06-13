var http = require("http"),
    sys = require("sys"),
    fs = require("fs");

http.get({host: "redis.io", path: "/commands.json"}, function(res) {
    console.log("Response from redis.io/commands.json: " + res.statusCode);
  
    var commandString = "";
    res.on('data', function(chunk) {
        commandString += chunk;
    });

    res.on('end', function() {
        var commands = JSON.parse(commandString);
        writeCommandsToFile(commands, "lib/commands.js");
    })
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});

function writeCommandsToFile(commands, path) {
    console.log("Writing " + path);
    
    var fileContents = "// This file was generated by ./generate_commands.js on " + prettyCurrentTime() + "\n";
  
    var lowerCommands = [];
    for (var command in commands) {
        lowerCommands.push(command.toLowerCase());
    }
  
    fileContents += "exports.Commands = " + JSON.stringify(lowerCommands, null, "    ") + ";\n";
    
    fs.writeFile(path, fileContents);
}

function prettyCurrentTime() {
  var date = new Date();
  return date.toLocaleString();
}