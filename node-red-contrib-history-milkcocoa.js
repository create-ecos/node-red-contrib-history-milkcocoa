module.exports = function(RED) {
	
    function HISTROY_MILKCOCOA_NODE(config) {
    	
        RED.nodes.createNode(this,config);
        var node = this;
        
        this.on('input', function(msg) {
        	
        	var MilkCocoa = require('milkcocoa');
        	var milkcocoa = new MilkCocoa(msg.mlkcca.app_id+'mlkcca.com');
        	var ds = milkcocoa.dataStore(msg.mlkcca.data_store);
        	var history = ds.history();
        	history.sort(msg.mlkcca.sort);
        	history.size(msg.mlkcca.size);
        	history.limit(msg.mlkcca.limit);
			history.on('data', function(data) {
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
