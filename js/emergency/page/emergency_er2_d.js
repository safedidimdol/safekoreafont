//목록보기 버튼
function fn_retrieve() {
	if (document.referrer.includes('/emergency_er2.html')) {
		history.back();
	}
	else{
	location.href = "/idsiSFK/neo/emp/er/emergency_er2.html";
	}
}

$(function(){	
	fn_search();
});

//조회 함수
var urlParams = new URL(location.href).searchParams;	
var bbsOrdr = urlParams.get('bbsOrdr'); 

function fn_search() {
		var url = "";
		url = "/idsiSFK/neo/ext/json/disasterNewsList/disasterNews_" + bbsOrdr + ".json";
		
		$.getJSON(url, function(data) {
			data = data[0];
			
			$('#tit').html(data.SJ);
		
			
			//data.CN = _.replace(data.CN,'-송출지역-', '<br>-송출지역-<br>');
			data.CN = data.CN.replace(/(\n|\r\n)/g, '<br>');
			
			$('#msg').html(data.CN);
			
			
			//$('#msg_cn').html(data.FRST_REGIST_DT);
		});
		//var dt = jdata[0].FRST_REGIST_DT;
};

		