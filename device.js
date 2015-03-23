
deviceTypes['sq-blaster']={
    name:'sq-blaster',
    onChange:function(){
        if(!deviceTypes['sq-blaster'] || !deviceTypes['sq-blaster'].devices)
        {
            $.getJSON('/api/device/category/.sq-blaster', function(devices){ 
                deviceTypes['sq-blaster'].devices=devices; 
                $('#commands').empty(); 
                deviceTypes['sq-blaster'].onChange(); 
            });
        }
        var device=$('<li class="form-group">')
            .append('<label class="col-sm-2 control-label" for="blaster">Blast through</label>')
            .append('<div class="col-sm-10"><select class="commandsUrl form-control" placeholder="Url" id="blaster" name="blaster"></select></div>')
            .appendTo('#commands');
        if(deviceTypes['sq-blaster'].devices)
            $.each(deviceTypes['sq-blaster'].devices, function(index,item){
                device.find('select').append('<option>'+item.name+'</option>');
            });
        $('<li class="form-group">')
            .append('<label class="col-sm-2 control-label" for="device">Definition file</label>')
            .append('<div class="col-sm-10"><input type="file" class="form-control" placeholder="Device xml file" name="device" /></div>')
            .appendTo('#commands').find('input').on('change', function(event){
                window.deviceFile=event.target.files[0];
            });
        return 'dynamic';
    },
    onSave:function(data){
        $('form')
            .removeAttr( "enctype", "multipart/form-data" )
            .removeAttr( "encoding", "multipart/form-data" );
        data.append('device', window.deviceFile);
        data.append('blaster', $('#blaster').val())
    },
    onServerSave:function(device, body, callback){
        var xml2js=$('./modules/sq-blaster/node_modules/xml2js');
        body.device=body.device.toString('utf8');
        xml2js.parseString(body.device, function(error, dev){
            if(error)
                return console.log(error);
            $.each(dev.SQCommandInfo.command_info, function(index, item){
                device.commands[item.$.command_name]={
                    type:'POST',
                    contentType:'application/xml',
                    data:'<docommand key="'+device.name+'" repeat= "0" seq="0" command="'+item.$.command_name+'" ir_data="'+item.$.ir_data+'" ch="0" />', 
                    url:'http://'+body.blaster+'/docmnd.xml', crossDomain:true, headers:{'Connection':'close'}
                };
            });
            device.type='remote';
            device.subdevices=[{name:'power', type:'switch', commands:{
                on:function(callback){ device.commands['POWER ON'](callback); }, 
                off:function(callback){ device.commands['POWER OFF'](callback); }, 
                toggle:function(callback){ device.commands['POWER TOGGLE'](callback); }
            }}];
        });
    }
}; 