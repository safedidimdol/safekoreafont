var timeStamp = new Date();

$(function(){
	$.getJSON('/idsiSFK/neo/ext/json/emrInfoList/emrInfoList.do?' + timeStamp.getTime(),function(obj){
		_.forEach(obj,function(v,i){
			$('#' + '' + v.rn).attr('href',v.url);	
		});
	});
});
