module.exports = function(RED) {
    
    function HISTROY_MILKCOCOA_NODE(config) {
        
        RED.nodes.createNode(this,config);
        var node = this;
        
        this.on('input', function(msg) {
           	
           	var app_id;
           	var api_key;
           	var api_secret;
           	var data_store;
           	var span_start;
           	var span_end;
           	
            if(msg.mlkcca === undefined) {
            	app_id = config.app_id;
            	api_key = config.api_key;
            	api_secret = config.api_secret;
            	data_store = config.data_store;
            	span_start = config.span_start;
            	span_end = config.span_end;
        	} else {
        	    app_id = msg.mlkcca.app_id;
            	api_key = msg.mlkcca.api_key;
            	api_secret = msg.mlkcca.api_secret;
            	data_store = msg.mlkcca.data_store;
            	span_start = msg.mlkcca.span_start;
            	span_end = msg.mlkcca.span_end;
        	}
            
            var tsStart = new Date(Date.parse(msg.span_start, 'YYYY-MM-DD hh:mm:ss')).getTime();
            var tsEnd = new Date(Date.parse(msg.span_end, 'YYYY-MM-DD hh:mm:ss')).getTime();
            
            var MilkCocoa = require('milkcocoa');
            var milkcocoa = MilkCocoa.connectWithApiKey(msg.mlkcca.app_id+'.mlkcca.com', msg.mlkcca.api_key, msg.mlkcca.api_secret);
            var ds = milkcocoa.dataStore(msg.mlkcca.data_store);
            var history = ds.history();
            history.span(tsStart, tsEnd);
            history.on('data', function(data) {
            	msg.payload = data;
                node.send(msg);
            });
            history.on('end', function() {
                node.log('end');
            });
            history.on('error', function(err) {
                node.error(err);
            });
            history.run();
        });
    }
    
    RED.nodes.registerType('node-red-contrib-history-milkcocoa', HISTROY_MILKCOCOA_NODE);
}
