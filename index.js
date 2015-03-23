var mdns=require('mdns');
var browser=mdns.createBrowser(mdns.tcp('http'));

browser.on('serviceUp', function(service){
    if(service.host.startsWith('sq-blaster'))
    {
        console.log(service);
        $.device({type:'.sq-blaster', category:'sq-blaster', name:service.host, ip:service.addresses});
    }
});
browser.start();