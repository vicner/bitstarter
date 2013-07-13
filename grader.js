#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "file:///index.html";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(input, checksfile) {
    $ = cheerio.load(input);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var outJson = function(inputJson) {
return console.log(JSON.stringify(inputJson, null, 4));
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to local index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url_index>', 'Path to http://index.html')
        .parse(process.argv);
if (program.url) {
rest.get(program.url).on('complete', function(result) {
     var checkJson = checkHtmlFile(result, program.checks);
outJson(checkJson);
});
} else if (program.file) {
     var checkJson = checkHtmlFile(fs.readFileSync(program.file), program.checks);
outJsonConsole(checkJson);
};
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
