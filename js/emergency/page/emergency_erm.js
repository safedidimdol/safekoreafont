$.ajaxSetup({ cache: false });
sessionStorage.setItem('safemode','er');

//메인버튼 누를때 평상시 메인 화면으로
$(document).on('click','#mainLogo',function(){
	sessionStorage.setItem('safepass', 'true');
	location.href = '/idsiSFK/neo/main/main.html';
});

$(function(){
		
	    
	    var safetab = sessionStorage.getItem('safetab');	    
	    if(!_.isEmpty(safetab)){
			var el = $('[data-tab=' + safetab +']');
			loadTab(el);
		}
		else{
			var el = $('[data-tab="tab-cont1"]');
			loadTab(el);
		}
	    
		//긴급재난문자
		var url = "/idsiSFK/neo/ext/json/main/main.json";
		url = "/idsiSFK/neo/ext/json/emergency/emrAllList.json";
		/*$.getJSON(url,function(data){
			_.forEach(data,function(v,i){					
				  var $li = $( '<li>'
								+'<a href="#emp" class="sms-box">'
								+'<div class="sms-label"><span class="label-tit"></span></div>'
								+'<strong class="sms-tit">'
								+'<span></span>'
								+'</strong>'
								+'</a>'
								+'</li>');
							
							
					 var locArr = v.MSG_CN.match(/\[(.*?)\]/);
					 //지역
				     $li.find('.label-tit').html(locArr[1]);			
				     
				    const date = moment(v.CREAT_DT, "YYYYMMDDHHmmss");					  
				  	const formattedDate = date.format("YYYY-MM-DD HH:mm:ss");		 
					 //메세지
					 $li.find('span').eq(1).html(formattedDate + ' '+ v.MSG_CN.replace(locArr[0],''));
					 $li.find('a').attr('href','/idsiSFK/neo/emp/er/emergency_er1_d.html?bbsOrdr=' + v.MD101_SN + '')
					 //$div.find('span').eq(0).html(loc);
					 
					  $('#sms-list').append($li);		
			  });
		});*/
		
		$.getJSON(url,function(data){
		
			_.forEach(data,function(v,i){
				if(v.DSSTR_SE_ID == '6' || v.DSSTR_SE_ID == '40')
				 	v.DSSTR_SE_ID = '1';
				 else v.DSSTR_SE_ID = '2';
			});		
			
			data = _.orderBy(data,['DSSTR_SE_ID','MD101_SN'],['asc','desc'])
			
			data = _.take(data,5);	
			_.forEach(data,function(v,i){					
				  var $li = $( '<li>'
								+'<a href="#emp" class="sms-box">'
								+'<div class="sms-label"><span class="label-tit"></span></div>'
								+'<strong class="sms-tit">'
								+'<span></span>'
								+'</strong>'
								+'</a>'
								+'</li>');
							
							
					 var locArr = v.MSG_CN.match(/\[(.*?)\]/);
					 //지역
				     $li.find('.label-tit').html(locArr[1]);			
				     
				    const date = moment(v.CREAT_DT, "YYYYMMDDHHmmss");					  
				  	const formattedDate = date.format("YYYY-MM-DD HH:mm:ss");		 
					 //메세지
					 $li.find('span').eq(1).html(formattedDate + ' '+ v.MSG_CN.replace(locArr[0],''));
					 $li.find('a').attr('href','/idsiSFK/neo/emp/er/emergency_er1_d.html?bbsOrdr=' + v.MD101_SN + '')
					 //$div.find('span').eq(0).html(loc);
					 
					  $('#sms-list').append($li);		
			  });
		});
		
		//탭조작
		$('.tab-group .tab-box').click(function() {
			loadTab($(this));
			sessionStorage.setItem('safetab',$(this).data('tab'));
		});
		
	
});

var loadTab = function(el){
	var activeTab = el.attr('data-tab');
	$('.tab-group .tab-box').removeClass('active');
	$('.tab-group .tab-cont').removeClass('active');
	el.addClass('active');
	$('#' + activeTab).addClass('active');
};