var fetch = require('node-fetch');
var EyesImages = require('eyes.images'); // should be replaced to 'eyes.images'
var fs = require('fs');
// Initialize the eyes SDK and set your private API key.
var eyes = new EyesImages.Eyes();
eyes.setApiKey('O4GjwYs66106Ycj0xINUrtv3bwmtcoOP97bprJVCL04XFo110'); // Set APPLITOOLS_API_KEY env variable or uncomment and update this line
eyes.setLogHandler(new EyesImages.ConsoleLogHandler(false));
eyes.setHostOS('Windows 10'); // Define the OS.

return eyes.open('Image test2', 'Javascript screenshot test!', {width: 300, height: 100}).then(function () {
    fs.readFile('C:\\Users\\dk080e\\eclipse-workspace\\my-special-way-portal\\screenshots\\login.png', function(err, data) {  
        if (err) throw err;
        return data.buffer;
    })
}).then(function (img) {
    return eyes.checkImage(img, 'Google Logo');
}).then(function () {
    return eyes.close();
}).catch(function (reason) {
    console.error(reason);
});