$.ajaxSetup({ cache: false });
sessionStorage.setItem('safemmode','eq');

//메인버튼 누를때 평상시 메인 화면으로
$(document).on('click','#mainLogo',function(){
	sessionStorage.setItem('safepass_m', 'true');
	location.href = '/idsiSFK/neo/main_m/main.html';
});

$(function(){
	
	$.getJSON('/idsiSFK/neo/ext/json/earthquake/earthquake.do',function(data){
		
		var data = _.filter(data, (v) => {			
			  return  moment().diff(moment(v.DT_STFC, "YYYYMMDDHHmmss"), 'days') <= 1;
		});
		
		// 지역 배열
		var regions = ['일본', '북한','충남', '충북', '경남', '경북', '전남', '전북', '서울', '대전', '부산', '대구', '인천', '광주', '울산', '세종', '경기', '강원', '제주'];

		// LOC_LOC에 regions 배열의 값이 포함된 항목만 필터링
		var filteredData = _.filter(data, (item) => {
		  //return _.some(regions, (region) => _.includes(item.LOC_LOC, region));
		    return _.some(regions, (region) =>  item.LOC_LOC.substring(0,2) == region) && !_.includes(item.STAT_OTHER,'국내영향없음');
		});
		
		/*
			var filteredData = _.filter(filteredData, (item) => {
			var rtn = false;
			if( (item.LOC_LOC.substring(0,2) == '일본' || item.LOC_LOC.substring(0,2) == '북한') && Number(item.SECT_SCLE) >= 4.5 )
				rtn = true
		    if( Number(item.SECT_SCLE) >= 4.5 &&  _.includes(item.LOC_LOC,'해역'))
				rtn = true				
			if( Number(item.SECT_SCLE) >= 4.0 &&  _.includes(item.LOC_LOC,'지역'))
				rtn = true
			return rtn;	
		});
		*/

			
		  _.forEach(_.take(filteredData,3),function(v,i){
			
				var $div = $('<div class="status-box">'
							+'<div class="status-num"><strong class="num"></strong></div>'
							+'<div class="status-info">'
							+	'<span></span>'
							+	'<span></span>'
							+'</div>'
							+'</div>');
							 
			   	 //진도
			     $div.find('.num').html(v.SECT_SCLE);
			      const date = moment(v.DT_STFC, "YYYYMMDDHHmmss");					  
				  const formattedDate = date.format("YYYY-MM-DD HH:mm:ss");
				 
				 //일시
				 $div.find('span').eq(0).html(formattedDate);
				 //지역
				 $div.find('span').eq(1).html(v.LOC_LOC);
				 
				  $('#status-cont').append($div);			  
		  });
		  
	 });
});