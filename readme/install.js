var figlet = require('figlet');
 
figlet.text('Welcome To \n PassUp \nInstallation!', {
   // font: 'Alphabet',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});