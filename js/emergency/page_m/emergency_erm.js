$.ajaxSetup({ cache: false });
sessionStorage.setItem('safemmode','er');	    

//메인버튼 누를때 평상시 메인 화면으로
$(document).on('click','#mainLogo',function(){
	sessionStorage.setItem('safepass_m', 'true');
	location.href = '/idsiSFK/neo/main_m/main.html';
});

$(function(){
	    	 
		//긴급재난문자
		var url = "/idsiSFK/neo/ext/json/main/main.json";
		url = "/idsiSFK/neo/ext/json/emergency/emrAllList.json";
		$.getJSON(url,function(data){
			
			_.forEach(data,function(v,i){
				if(v.DSSTR_SE_ID == '6' || v.DSSTR_SE_ID == '40')
				 	v.DSSTR_SE_ID = '1';
				 else v.DSSTR_SE_ID = '2';
			});		
			
			data = _.orderBy(data,['DSSTR_SE_ID','MD101_SN'],['asc','desc'])
		
			_.forEach(_.take(data,2),function(v,i){					
				  var $div = $( '<div class="sms-box">'								
								+'<div class="sms-place"><strong class="place">지역</strong></div>'
								+'<div class="sms-info">'
								+'<span>날짜</span>'
                                +'<span>내용</span>'
								+'</div>'
								+'</div>');
							
							
					 var locArr = v.MSG_CN.match(/\[(.*?)\]/);
					 //지역
				     $div.find('.place').html(locArr[1]);			
				     
				    const date = moment(v.CREAT_DT, "YYYYMMDDHHmmss");					  
				  	const formattedDate = date.format("YYYY-MM-DD HH:mm:ss");		 
					 //메세지
					 $div.find('span').eq(0).html(formattedDate);
					 $div.find('span').eq(1).html( v.MSG_CN.replace(locArr[0],''));
					 //$div.find('a').attr('href','/idsiSFK/neo/emp/er/emergency_er1_d.html?bbsOrdr=' + v.MD101_SN + '')
					 //$div.find('span').eq(0).html(loc);
					 
					  $('#sms-list').append($div);		
			  });
		});
		
});
