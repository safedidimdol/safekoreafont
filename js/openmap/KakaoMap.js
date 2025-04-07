
/****************************************************************/
/** MapDefine  변수 선언*/
/****************************************************************/

var kakaoMap;
var kMarker;
var kInfowindow;

/****************************************************************/
/** commonMap*/
/****************************************************************/
/**
 * 카카오맵 생성
 */
function createKakaoMap() {
	
	displayMapContainer();
	
	if (!window.kakao || !kakao ||!kakao.maps) {
		console.log("카카오 지도 생성 오류 발생!!!!");
		callbackKakaoMapHandler();
		//카카오 오류 발생 
		return false;
	}
	latlon = new kakao.maps.LatLng(initCenterLat, initCenterLng);
	if (kakaoMap!=null) { //지도 존재할 경우
		clearMarkerK();
		kakaoMap.setLevel(initLevel);
    	setKakaoMapType('roadmap');   
		kakaoMap.setCenter(latlon);
		setTimeout(function() {
			kakaoMap.relayout();
		}, 0);
	
	} else {
		//지도 신규 생성
		var mapOption = {
			center: latlon, //서울 지도
			level: initLevel// 지도의 확대 레벨 
		};
		//지도 신규 생성
		kakaoMap = new kakao.maps.Map(kakaoContainer, mapOption);
		
	}

	return true;
}


/***
 *  이미지 마커 표시
 * @param posi = marker position 
 * @param imageSrc 이미지
 * 
*/
function createImageMarkerK(posi, imageSrc) {

	var markerImage = new kakao.maps.MarkerImage(imageSrc, getImageInfoSize(), { offset: new kakao.maps.Point(11, 35) });

	// 마커를 생성합니다
	var marker = new kakao.maps.Marker({
		map: kakaoMap,
		position: posi,
		title: key,
		image: markerImage,
		zIndex: 100
	});
	return marker;
}

/**
 *  인포윈도우 생성
 * @param posi = marker position  (이동 필요할 경우)
 * @param html 인포윈도우 표시 내용
 * @param borderWidth 
*/
function createInfowindowK(posi, html, width) {
	var infowindow = new kakao.maps.InfoWindow({
		content: html,
		borderWidth: width
		//,removable: true;
	});
	if (posi != undefined) {
		kakaoMap.setLevel(3);
		kakaoMap.panTo(posi);
		// 지도 중심좌표를 접속위치로 변경합니다
		kakaoMap.setCenter(posi);
	}
	infoWindows.push(infowindow);
	return infowindow;

}
/**
 * 지도 원 그리기
 * @param latlon 위경도
 * @param  distance  원 반경
 * **/
function showMapCircleK(latlon, distance) {
	if (circleK) {//존재시 위치 이동
		circleK.setMap(null);
	}
	circleK = new kakao.maps.Circle({
		//center: new kakao.maps.LatLng(X, Y),  // 원의 중심좌표 입니다 
		center: latlon,
		radius: distance, // 미터 단위의 원의 반지름입니다 
		strokeWeight: 3, // 선의 두께입니다 
		strokeColor: '#75B8FA', // 선의 색깔입니다
		strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
		strokeStyle: 'dashed', // 선의 스타일 입니다
		fillColor: '#CFE7FF', // 채우기 색깔입니다
		fillOpacity: 0.4  // 채우기 불투명도 입니다   
	});

	circleK.setMap(kakaoMap);
}


function zoomInK() {
	if(kakaoMap==null)return;
	// 현재 지도의 레벨을 얻어옵니다
	var level = kakaoMap.getLevel();

	// 지도를 1레벨 내립니다 (지도가 확대됩니다)
	kakaoMap.setLevel(level - 1);

	// 지도 레벨을 표시합니다
}

function zoomOutK() {
	if(kakaoMap==null)return;
	// 현재 지도의 레벨을 얻어옵니다
	var level = kakaoMap.getLevel();

	// 지도를 1레벨 올립니다 (지도가 축소됩니다)
	kakaoMap.setLevel(level + 1);
	// 지도 레벨을 표시합니다
}
/**
 * 지도 일반/위성
 * 
*/

function setKakaoMapType(maptype) { 
    var roadmapControl = document.getElementById('btnRoadmap');
    var skyviewControl = document.getElementById('btnSkyview'); 
    if(roadmapControl ==undefined ||skyviewControl==roadmapControl)return;
    if (maptype === 'roadmap') {
    	if (kakaoMap!=null)
    		kakaoMap.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);    
        roadmapControl.className = 'selected_btn';
        skyviewControl.className = 'btn';
    } else {
    	if (kakaoMap!=null)
    		kakaoMap.setMapTypeId(kakao.maps.MapTypeId.HYBRID);    
        skyviewControl.className = 'selected_btn';
        roadmapControl.className = 'btn';
    }
}



/**카카오 지도 생성 후 콜백 함수 */
function callbackKakaoMapHandler() {


	//alert(mapContainer.innerHTML);
	showKakaoErrMsg();

}



/****************************************************************/
/** showMap*/
/****************************************************************/
/**
 * 카카오 지도 생성 
 */
function showKakaoMap() {
	//카카오맵 생성
	if (!createKakaoMap()) return;
	if (ftlArr.includes(facility_type)) {
		goLatlonMoveK();
	} else if (address != "") {
		var parsingAddress = address.split(',');
		goAddressMoveK(parsingAddress[0]);
	} else {
		goLatlonMoveK();
	}
}
/***
 * 위경도 값으로 지도 이동
 */
function goLatlonMoveK() {
	if (latitude != '' && latitude > 0 && longitude > 0) {
		showKaKaoInfoWindow(latitude, longitude);
		setEventListener();
	} else {
		alert(MSG_LATLON_ERR);
	}
}


// 주소를 이용해 좌표 이동 
function goAddressMoveK(addr) {
	var geocoder = new kakao.maps.services.Geocoder();
	// 주소로 좌표를 검색합니다
	geocoder.addressSearch(addr, function(result, status) {

		// 정상적으로 검색이 완료됐으면 
		if (status === kakao.maps.services.Status.OK) {
			var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
			showKaKaoInfoWindow(coords.Ma, coords.La);
			setEventListener();
		} else {
			return jAlert(MSG_ADDRESS_ERR, '');

		}
	});

}
	
// 위경도 값으로 마커와 인포윈도우를 표시합니다
function showKaKaoInfoWindow(lat, lon) {

	var locPosition = new kakao.maps.LatLng(lat, lon); // 인포윈도우에 표시될 내용입니다

	var imageSrc = "https://cdn.jsdelivr.net/gh/safedidimdol/safekoreafont/marker-default.png"; // 마커이미지의 주소입니다
//	var imageSrc = getMarkerImageSrc(); // 마커이미지의 주소입니다
	// 마커를 생성합니다
	kMarker = createImageMarkerK(locPosition, imageSrc);
	/**인포윈도우 생성*/
	kInfowindow = createInfowindowK(locPosition, getAddressInfoWindowHtml(), 1);
	// 인포윈도우를 마커위에 표시합니다 
	kInfowindow.open(kakaoMap, kMarker);
	setMarkerClickListenerK();

}

/**
 * 클릭시 인포윈도우 표시 숨기기
*/
function setMarkerClickListenerK() {
	kakao.maps.event.addListener(kMarker, 'click', clickKakaoMarkerEvent);
}
function clickKakaoMarkerEvent(){
	if (kInfowindow.getMap()) {
			kInfowindow.close();
		} else {
			kInfowindow.open(kakaoMap, kMarker);
	}
}

function clearMarkerK() {
	if(kakao.maps ==null ||kMarker==null)return;
	// 이벤트 리스너 해제
	kakao.maps.event.removeListener(kMarker, 'click', clickKakaoMarkerEvent);
	kMarker.setMap(null);
	if (kInfowindow!=null&&kInfowindow.getMap()) 
		kInfowindow.close();
}

function setEventListener() {
	kakao.maps.event.addListener(kakaoMap, 'center_changed', function() {
		// 지도의 중심좌표를 얻어옵니다 
		var latlng = kakaoMap.getCenter();
		//kakaoMap.setCenter(latlng);
		console.log(getLatlngMessage(KAKAO, latlng));
	});
}




/****************************************************************/
/** distanceMap*/
/****************************************************************/
function showDistanceKaKaoMap() {

	//카카오맵 생성
	if (!createKakaoMap()) return;

	if(startMyPositionInfo()){
		//내위치 확인 불가
		displayMyPositonK(latlon);
	}
	kakao.maps.event.addListener(kakaoMap, 'dragend', function() {
		moveLatLng();

	});
}


/**
 * 하천 강우 
*/
function showRainInfoKakaoMap() {
	//지도 생성
	if (!createKakaoMap()) return;

	showRainInfo();
	
	kakao.maps.event.addListener(kakaoMap, 'dragend', function() {

		moveLatLngWaterRain();
	});

}

/**
 * 미세먼지
*/
function showFineDustKaKaoMap(){
	//지도 생성
	if (!createKakaoMap()) return;
	
	kakao.maps.event.addListener(kakaoMap, 'dragend', function() {

	
	});
}
/**
내 위치 표시
@param latlon 위경도
*/
function displayMyPositonK(latlon) {

	kakaoMap.setLevel(5);
	kakaoMap.setCenter(latlon);

	showMapCircleK(latlon, l_distance);

	kMarker = new kakao.maps.Marker({
		map : kakaoMap,
		position: latlon
	});


	//jAlert('1', '');
	

	setFacility(500);

}



// >> marker 생성(카카오톡)
function setMarkerPushK(idx, JSON) {
	try {

		var lat, lon;
		switch (flgCurrentPage) {
			case FacilityDistance:
				lat = JSON[idx].latitude;
				lon = JSON[idx].longitude;
				break;
			case WaterRainInfoShow:
			case WaterRiverStageShow:
				lat = JSON[idx].lat;
				lon = JSON[idx].lon;
				break;
		}

		var position = new kakao.maps.LatLng(lat, lon);

		var marker = createImageMarkerK(position, "http://static.naver.net/maps/mantle/1x/marker-default.png");

		/**인포윈도우 생성*/
		createInfowindowK(null, getMarkerWindowHtml(idx, JSON), 0);

		markers.push(marker);

		kakao.maps.event.addListener(marker, 'click', getClickHandlerK(idx));
	} catch (e) {
		console.log("::setMarkerPushK err::" + e);
	}
}


// >> 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandlerK(seq) {
	return function(e) {
		
		closeInfoWindows();
		
		var marker = markers[seq],
			infoWindow = infoWindows[seq];

		if (infoWindow.getMap()) {
			infoWindow.close();
			kakaoMap.setCenter(nowCenter);
			kakaoMap.setLevel(nowLevel);
		} else {
			infoWindow.setZIndex(130);
			infoWindow.open(kakaoMap, marker);
			nowLevel = kakaoMap.getLevel();
			nowCenter = kakaoMap.getCenter();
			kakaoMap.setLevel(4);


			var centerlatlon = new kakao.maps.LatLng(marker.getPosition().Ma + 0.003, marker.getPosition().La);
			kakaoMap.setCenter(centerlatlon);
		}
	}
}


