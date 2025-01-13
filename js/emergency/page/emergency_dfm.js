$.ajaxSetup({ cache: false });
sessionStorage.setItem('safemode','df');

//메인버튼 누를때 평상시 메인 화면으로
$(document).on('click','#mainLogo',function(){
	sessionStorage.setItem('safepass', 'true');
	location.href = '/idsiSFK/neo/main/main.html';
});


$(function(){	
	
	var dfArr = [];
	
	$.getJSON('/idsiSFK/neo/ext/json/emergency/emrList.json',function(data){
		
		var data = _.filter(data, (v) => {			
			  return  moment().diff(moment(v.CREAT_DT, "YYYY/MM/DD HH:mm:ss"), 'days') <= 7;
		});
			
		  _.forEach(data,function(v,i){	
			  if(v.DSSTR_SE_ID == '40'){
					var isDf = false;
					var regex = /(훈련)/g;										
					var ex = v.MSG_CN.match(regex);
						regex = /(공습경보|경계경보|핵경보|화생방경보|경보)/g;
						//regex = /(경보)/g; 
					var alram =	v.MSG_CN.match(regex);		
					var msg = v.MSG_CN;	
					if(alram != null){
						//예외
						if(ex == null){
							isDf = true;
						}
					};
					
				  if(isDf){
					  	 var $div = $('<div class="status-box">'
								+'<div class="status-num"><strong class="num"></strong></div>'
								+'<div class="status-info">'
								+	'<span></span>'
								+	'<span></span>'
								+'</div>'
								+'</div>');
								
								
						 var preText = '' 
						  if(_.includes(msg,'오발령')){
							 preText = '오발령';
						  }	
						  else if(_.includes(msg,'해제')){
							 preText = '해제';
						  }	
						  else if(_.includes(msg,'발령')){
							 preText = '발령';
						  }		  
						
						 var preText =	alram + ' ' + preText;
						 var loc = v.MSG_CN.match(/\[(.*?)\]/)[1];
						 //구분
					     $div.find('.num').html(preText);					 
						 //일시
						 $div.find('span').eq(0).html(v.CREAT_DT);
						 //지역
						 $div.find('span').eq(1).html(loc);
						 console.log(msg);
						 dfArr.push($div);
						
				  }
			  }
			  
		  });
		  
		  //전체 문자중 3개만
		  _.forEach(_.take(dfArr,3),function(v,i){			
				$('#status-cont').append(v);		
		  });		    
		  
	 });
			
});