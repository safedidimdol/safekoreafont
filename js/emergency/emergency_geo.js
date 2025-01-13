var getGeolocation = function(){
		
		if('geolocation' in navigator) {
		    /* 위치정보 사용 가능 */
		} else {
		   alert('위치정보사용불가');
		}
		
	    var startPos;
	  
	    var geoSuccess = function (position) {
	        
	        // Do magic with location
	        startPos = position;
	        
	        var obj = {};
	        obj.lat = startPos.coords.latitude;
	        obj.lon = startPos.coords.longitude;
/*
			obj.lat = '36.477051';
			obj.lon = '127.264493';
			obj.lat = '35.85485';
			obj.lon = '128.4909';
			
			
*/
	        reverseGeocode(obj)
	        
	    };
	    var geoError = function (error) {
	        console.log('Error occurred. Error code: ' + error.code);
	        // error.code can be:
	        //   0: unknown error
	        //   1: permission denied
	        //   2: position unavailable (error response from location provider)
	        //   3: timed out
	        switch (error.code) {
	            case error.PERMISSION_DENIED:
	                // The user didn't accept the callout
	                alert('위치정보 허용 권한이 없습니다');
	                break;
	            case error.POSITION_UNAVAILABLE:
	                // The user didn't accept the callout
	                alert('위치 정보를 가져오지 못했습니다 ');
	                break;
	            case error.TIMEOUT:
	                // The user didn't accept the callout
	                alert('시간 초과');
	                break;
	        };
	    };

	    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	};

	var reverseGeocode = function(obj){
		
		naver.maps.Service.reverseGeocode({
		    coords: new naver.maps.LatLng(obj.lat, obj.lon),
		}, function(status, response) {
		    if (status !== naver.maps.Service.Status.OK) {
		        return console.log('Something wrong!');
		    }
		
		    var result = response.v2, // 검색 결과의 컨테이너
		        items = result.results, // 검색 결과의 배열
		        address = result.address; // 검색 결과로 만든 주소
		        
		        if(items[0].region.area1.name == '세종특별자치시')
		        	items[0].region.area2.name = '세종시';
		        
		        var area1 = items[0].region.area1.name;
		        var area2 = items[0].region.area2.name;
		        var area3 = items[0].region.area3.name;
		   
				$sbLawArea1 = $("#sbLawArea1 option:contains('" + area1 + "')");
		    	
		    	if($sbLawArea1.length == 0){  
					alert('일치하는 시도가 없습니다');
					return false;  
				}
		    	else{
					$sbLawArea1.prop("selected", "selected");
					
				}   
		    	if(typeof setArcd2Select != 'undefined') setArcd2Select();
		    	if(typeof sbLawArea1_onchange != 'undefined') {
					sbLawArea1_onchange();
				}
		    			    			      	
		    	setTimeout(function(){
		    		$("#sbLawArea2 option:contains('" + area2 + "')").prop("selected", "selected");	
			    	if(typeof sbLawArea2_onchange != 'undefined') {
						sbLawArea2_onchange();
						if(typeof dm_searchInfo != 'undefined')	dm_searchInfo.set( "q_area_cd_2", $("#sbLawArea2 option:selected").val() );
					}
					if(typeof setArcd3SelectStr != 'undefined') setArcd3SelectStr();
					else if(typeof setArcd3Select != 'undefined') setArcd3Select();
		    		setTimeout(function(){
						//var admcode = items[0].code.id.substring(0,8);
						//$("#sbLawArea3").val(items[0].code.id.substring(0,8));
					
							
							_.forEach(result.results,function(v,i){
								$sbLawArea3 = $("#sbLawArea3 option:contains('" + v.region.area3.name + "')");
				    			if($sbLawArea3.length > 0){
									$sbLawArea3.prop("selected", "selected");	
									if(typeof dm_searchInfo != 'undefined')	dm_searchInfo.set( "q_area_cd_3", $("#sbLawArea3 option:selected").val() );
									
								}
							});
						
		    		}, 500);
		    	}, 500);
		
		        
		    // do Something
		});
	}
