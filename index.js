var mdns=require('mdns');
var browser=mdns.createBrowser(mdns.tcp('http'));

browser.on('serviceUp', function(service){
    if(service.host.startsWith('sq-blaster'))
    {
        console.log(service);
        $.device({type:'.sq-blaster', category:'sq-blaster', name:service.host});
    }
});
browser.start();

exports.init=function(config)
{
    $.each($('./modules/sq-blaster/devices.json'), function(index, device){
        $.device(device);
    });
};