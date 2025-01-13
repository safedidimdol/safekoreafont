$(function(){
	var $headMsg = $('.emp-message');	
	if($headMsg.length > 0){
		var mode = sessionStorage.getItem('safemmode');
		if(mode == 'er'){
			//$('.emp-logo-eq').removeClass('emp-logo-eq').addClass('emp-logo-er');
			//$('.emp-logo-df').removeClass('emp-logo-df').addClass('emp-logo-er');
			    
			$('.emp-logo-eq').find('a').attr('href','/idsiSFK/neo/emp_m/er/emergency_erm.html');
			$('.emp-logo-df').find('a').attr('href','/idsiSFK/neo/emp_m/er/emergency_erm.html');
			$('.emp-logo-er').find('a').attr('href','/idsiSFK/neo/emp_m/er/emergency_erm.html');
			$headMsg.html('<p>현재 재난 상황등의 발생으로 인한 사용자 폭주로 국민재난안전포털 첫 화면을 일시 변경하여 서비스를 제공하고 있습니다.</p>')
		}
		if(mode == 'df'){
			$('.emp-logo-eq').find('a').attr('href','/idsiSFK/neo/emp_m/df/emergency_dfm.html');
			$('.emp-logo-df').find('a').attr('href','/idsiSFK/neo/emp_m/df/emergency_dfm.html');
			$('.emp-logo-er').find('a').attr('href','/idsiSFK/neo/emp_m/df/emergency_dfm.html');			
			$headMsg.html('<p>민방공 경보발령으로 인한 서비스 이용 폭주로 긴급서비스 페이지로 전환 되었습니다.</p><p>상황 해제 또는 사용자가 감소전까지 국민행동요령과 민방위 대피시설 등의 서비스 외에는 이용이 제한됩니다.</p>')
			
		}
		if(mode == 'eq'){
			$('.emp-logo-eq').find('a').attr('href','/idsiSFK/neo/emp_m/eq/emergency_eqm.html');
			$('.emp-logo-df').find('a').attr('href','/idsiSFK/neo/emp_m/eq/emergency_eqm.html');
			$('.emp-logo-er').find('a').attr('href','/idsiSFK/neo/emp_m/eq/emergency_eqm.html');
			$headMsg.html('<p>지진 발생으로 인한 서비스 이용 폭주로 긴급페이지로 전환 되었습니다.</p><p>지진상황 해제 또는 사용자가 감소전까지 국민행동요령과 지진옥외대피장소 등의 서비스 외에는 이용이 제한됩니다.</p>')		
		}
			
	}
});