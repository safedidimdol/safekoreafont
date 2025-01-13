$(document).on('click','#url1',function(){
	if(!confirm("꼭 필요한 경우를 제외하고 정상페이지는 사용 자제 바랍니다.\n정말 국민재난안전포털로 접속 하시겠습니까?")) return false;
	sessionStorage.setItem('safepass', 'true');
	location.href = '/idsiSFK/neo/main/main.html';
});

$(document).on('click','#url2',function(){		
	sessionStorage.setItem('safemode', 'df');
	location.href = '/idsiSFK/neo/emp/df/emergency_dfm.html';
});
