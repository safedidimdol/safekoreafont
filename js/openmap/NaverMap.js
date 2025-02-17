
/****************************************************************/
/** MapDefine  변수 선언*/
/****************************************************************/


var naverMap;

/****************************************************************/
/** commonMap*/
/****************************************************************/

/* [주소 -> 좌표 변환]
 * 주소 좌표 변환은 다음 순서로 진행한다.
 *
 * STEP1. 지도보기 페이지로 최초 진입 시 대한민국 전체 지도를 출력한다.
 * STEP2. DB에서 조회한 주소에 콤마가 들어있는 경우 API 요청이 실패하기 때문에 ','를 기준으로 문자열을 자른다.
 * STEP3. 파싱한 문자열을 이용하여 '주소->좌표 변환 API'를 요청한다.
 * STEP4. STEP3에서 API 요청 결과 status 값이 'OK'인 경우(변환성공) 얻은 좌표값으로 이동하여 마커를 찍고 지도 확대 레벨을 3으로 변경한다.
 *        STEP3에서 API 요청 결과 status 값이 'OK'가 아닌 경우 대한민국 전체 지도가 출력된 상태를 유지한다.
 *
 */

var mapOption;
function createMapOption() {
	latlon = new naver.maps.LatLng(initCenterLat, initCenterLng);
	mapOption = {
		useStyleMap: true,
		center: latlon, // 지도의 중심좌표
		level: 15, // 지도의 확대 레벨
		zoom: initZoom,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: naver.maps.MapTypeControlStyle.BUTTON,
			position: naver.maps.Position.TOP_LEFT
		},
		scaleControl: true,
		scaleControlOptions: {
			position: naver.maps.Position.BUTTON
		},
		zoomControl: true,
		zoomControlOptions: {
			style: naver.maps.ZoomControlStyle.SMALL,
			position: naver.maps.Position.TOP_RIGHT
		},
		logoControl: false,
		logoControlOptions: {
			position: naver.maps.Position.BOTTOM_RIGHT
		}
	};
}


/***
 * 네이버 지도 생성
*/

function initNaverMap() {
	if (naver.maps == undefined || naver.maps == null) return;
	createMapOption();

	naverMap = new naver.maps.Map(naverContainer, mapOption);
}
function createNaverMap() {
	return createNaverMap(null);
}
function createNaverMap(callback) {

	displayMapContainer();


	if (naver.maps == undefined || naver.maps == null) {
		//네이버 오류 발생 
		console.log("네이버 지도 생성 오류 발생!!!!");
		showNaverErrMsg();
		return false;
	}

	if (naverMap) {
		naverMap.destroy();
	}

	initNaverMap();

	if (callback != null) {
		startMapCreateTimeout(callback);
	}
	return true;
}
/**
 * 지도 생성 타임아웃
*/
function startMapCreateTimeout(callback) {
	setTimeout(function() {
		if (naverContainer.innerHTML === '') {
			showNaverErrMsg();//오류 발생
		} else {
			callback();
		}
	}, 300);
}

/***
 * 이미지 마커 표시
 * @param posi = marker position 
 * @param imageSrc 이미지
 * 
*/
function createImageMarkerN(posi, imageSrc) {
	var marker = new naver.maps.Marker({
		map: naverMap,
		position: posi,
		//title: key,
		icon: {
			url: imageSrc,
			size: getImageInfoSize(),
			anchor: new naver.maps.Point(11, 35),
			origin: new naver.maps.Point(0, 0)
		},
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
function createInfowindowN(posi, html, width) {
	var infoWindow = new naver.maps.InfoWindow({
		content: html,
		borderWidth: width
	});
	if (posi != undefined) {

	}
	infoWindows.push(infoWindow);
	return infoWindow;
}

/**
 * 지도 원 그리기
 * @param latlon 위경도
 * @param  distance  원 반경
 * **/
function showMapCircleN(latlon, distance) {
	if (circleN) {
		circleN.setMap(null);
	}
	circleN = new naver.maps.Circle({
		center: latlon, // 원 중심
		radius: distance, // 미터 단위 원 반지름
		strokeWeight: 3, // 선 두께
		strokeColor: '#75B8FA',
		strokeOpacity: 1, // 선 불투명도
		strokeStyle: 'dashdot', // 선의 스타일
		fillColor: '#CFE7FF', // 채우기 색깔
		fillOpacity: 0.4 // 채우기 불투명도
	});

	if (circleN)
		circleN.setMap(naverMap);
}


/**네이버 지도 생성 후 콜백 함수 */
function callbackNaverMapHandler() {
	console.log("callbackNaverMapHandler");


	//alert(mapContainer.innerHTML);

	//	if (naverContainer==null||naverContainer.innerHTML === '') {
	/***
	 * 
	naverErr = true; //에러발생 여부 플래그
	jAlert(MSG_NAVER_ERR, "", function() {
		showMap(KAKAO);
	});
	 */
	//}else{
	/**네이버 자바스크립트 읽어오기 성공*/

	//}
}

/****************************************************************/
/** showMap*/
/****************************************************************/

/**
 * showMap 지도 실행 함수
 * @param 
 * @param errHandler 에러발생시 호출 
 */

function showNaverMap() {
	if (facility_type != "") {//대피소일 경우
		if (ftlArr.includes(facility_type)) {//latitude != '' && latitude > 0 && longitude > 0
			goLatlonMoveN();
			return;
		}
	} else {
		if (latitude != '' && latitude > 0 && longitude > 0) {
			goLatlonMoveN();
			return;
		}
	}
	//주소 값 으로 조회
	if (address != "") {
		var parsingAddress = address.split(',');
		goAddressMoveN(parsingAddress[0]);
	}


}
/***
 * 위경도 값으로 지도 이동
 */
function goLatlonMoveN() {
	if (latitude != '' && latitude > 0 && longitude > 0) {
		showNaverInfoWindow(latitude, longitude);
	} else {
		var locPosition = new naver.maps.LatLng(initCenterLat, initCenterLng); //
		if (locPosition != undefined) {
			naverMap.setZoom(8);
			naverMap.panTo(locPosition);
		}
		// 2019.10.31 위경도 좌표가 없으면 안내 문구를 표시하고 이동되지 않도록 수정
		// alert(MSG_LATLON_ERR);
		
		goAddressMoveN(address); // 지도가 있는 상태에서 주소 정보로 이동되도록 해준다.
	}
}

// 주소를 이용해 좌표 이동
function goAddressMoveN(addr) {
	naver.maps.Service.geocode({
		query: addr
	}, function(status, response) {
		console.log(status);
		console.log(response);
		if (status !== naver.maps.Service.Status.OK) {


			return jAlert(MSG_ADDRESS_ERR, '');
		}
		var result = response.v2; // 검색 결과의 배열
		console.log(result.addresses.length);
		if (result.addresses.length > 0) {
			var item = result.addresses; // 검색 결과의 배열
			console.log(item[0].y);
			console.log(item[0].x);
			latitude = item[0].y;
			longitude = item[0].x;
			showNaverInfoWindow(latitude, longitude);
		} else {
			return jAlert(MSG_ADDRESS_ERR, '');
		}
	});
}

// 위경도 값으로 마커와 인포윈도우를 표시합니다
function showNaverInfoWindow(latitude, longitude) {

	var locPosition = new naver.maps.LatLng(latitude, longitude);

	if (locPosition != undefined) {
		naverMap.setZoom(17);
		naverMap.panTo(locPosition);

		var imageSrc = "http://static.naver.net/maps/mantle/1x/marker-default.png"; // 마커이미지의 주소입니다
/*		var imageSrc = getMarkerImageSrc(); // 마커이미지의 주소입니다
*/
		var marker = createImageMarkerN(locPosition, imageSrc);
		var infowindow = createInfowindowN(null, getAddressInfoWindowHtml(), 1);
		
		infowindow.open(naverMap, marker);
		setMarkerClickListenerN(infowindow, marker);
	}
}

/**
 * 클릭시 인포윈도우 표시 숨기기
*/
function setMarkerClickListenerN(win, m) {
	naver.maps.Event.addListener(m, 'click', function(e) {

		if (win.getMap()) {
			win.close();
		} else {
			win.open(naverMap, m);
		}
	});

}

/****************************************************************/
/** distanceMap*/
/****************************************************************/
function showDistanceNaverMap() {
	if (naver.maps == null) {
		console.log("showDistanceNaverMap >>> naver.maps==null");
		return;
	}
	if(startMyPositionInfo()){
		//내위치 확인 불가
		displayMyPositonN(latlon);
	}

	naver.maps.Event.addListener(naverMap, 'dragend', function() {

		moveLatLng();
	});
}
/**
 * 하천 강우 
*/
function showRainInfoNaverMap() {
	//지도 생성
	if (!createNaverMap()) return;
	showRainInfo();
	naver.maps.Event.addListener(naverMap, 'dragend', function() {
		moveLatLngWaterRain();
	});

}
/**
 * 미세먼지
*/
function showFineDustNaverMap() {
	//지도 생성
	if (!createNaverMap()) return;


	naver.maps.Event.addListener(naverMap, 'dragend', function() {
		//	moveLatLngWaterRain();
	});

}

/**
내 위치 표시
@param latlon 위경도
*/
function displayMyPositonN(latlon) {
	if (naverContainer.innerHTML === '') return;
	
	naverMap.setZoom(15);
	naverMap.setCenter(latlon);

	showMapCircleN(latlon, 500);

	var marker = new naver.maps.Marker({
		map: naverMap,
		position: latlon
	});
	setFacility(500);

}


// >> marker 생성(네이버)
function setMarkerPushN(idx, JSON) {
	if (naverContainer.innerHTML === '') return;

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

		var position = new naver.maps.LatLng(lat, lon);

		var marker = createImageMarkerN(position, "http://static.naver.net/maps/mantle/1x/marker-default.png");


		createInfowindowN(null, getMarkerWindowHtml(idx, JSON), 0);

		markers.push(marker);

		naver.maps.Event.addListener(marker, 'click', getClickHandlerN(idx));
	} catch (e) {
		console.log("::setMarkerPushN err::" + e);
	}
}




// >> 해당 마커의 인덱스를 seq라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
function getClickHandlerN(seq) {
	return function(e) {
		closeInfoWindows();

		var marker = markers[seq],
			infoWindow = infoWindows[seq];

		if (infoWindow.getMap()) {
			infoWindow.close();
			naverMap.setCenter(nowCenter);
			naverMap.setZoom(nowZoom);
		} else {
			infoWindow.open(naverMap, marker);
			nowZoom = naverMap.getZoom();
			nowCenter = naverMap.getCenter();
			naverMap.setZoom(16);


			var centerlatlon = new naver.maps.LatLng(marker.getPosition().lat() + 0.003, marker.getPosition().lng());
			naverMap.setCenter(centerlatlon);
		}

	}
}



