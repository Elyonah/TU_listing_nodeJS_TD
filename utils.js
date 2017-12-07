function parts_uuid (){
	var table = [];
	for(var i = 0; i < 8; i++){
		table[i] = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return table;
}

module.exports.uuid = function(){
	uuid_table = parts_uuid()
	return uuid_table[0] + uuid_table[1] + '-' + uuid_table[2] + '-' + uuid_table[3] + '-' + uuid_table[4] + '-' + uuid_table[5] + uuid_table[6] + uuid_table[7];
}