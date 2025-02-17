/****************************************************************/
/** distanceMap 공통*/
/****************************************************************/


// >> marker 숨김
function hideMarker(seq) {
	var marker = markers[seq],
		infoWindow = infoWindows[seq];

	if (infoWindow.getMap()) {
		infoWindow.close();
		//센터 줌 변경 
		nowCenterZoom()

	}
}
/**
 * 위 경도 기준 센터 줌 설정
*/
function setLatLonCenterZoom() {
	if (flgCurrentMap == NAVER) {//네이버 지도일 경우
		latlon = new naver.maps.LatLng(latitude, longitude);
		naverMap.setCenter(latlon);
		naverMap.setZoom(nowZoom);

	} else if (flgCurrentMap == KAKAO) {
		latlon = new kakao.maps.LatLng(latitude, longitude);
		kakaoMap.setLevel(nowLevel);
		kakaoMap.setCenter(latlon);
	}
}
/**
 * 위 경도 기준 설정
*/
function setLatLon(lat, lon) {
	if (flgCurrentMap == NAVER) {//네이버 지도일 경우
		if (naver.maps.LatLng != null)
			latlon = new naver.maps.LatLng(lat, lon);

	} else if (flgCurrentMap == KAKAO) {
		if (kakao.maps.LatLng != null)
			latlon = new kakao.maps.LatLng(lat, lon);
	}
}

/**
 * 센터 줌 설정
*/
function nowCenterZoom() {
	if (flgCurrentMap == NAVER && nowCenter != null) {
		naverMap.setCenter(nowCenter);
		naverMap.setZoom(nowZoom);
	} else if (flgCurrentMap == KAKAO && nowCenter != null) {
		kakaoMap.setCenter(nowCenter);
		kakaoMap.setLevel(nowLevel);
	}
}
/**
 마커 초기화
*/
function cleareMarkers() {

	var marker;

	for (var i = 0; i < markers.length; i++) {
		marker = markers[i];
		if (marker && marker != undefined) marker.setMap(null);
		//	        console.log("markers.length=="+i);
		var infoWindow = infoWindows[i];

		if (infoWindow.getMap()) {
			infoWindow.close();
		}
	}
	markers = [];
	infoWindows = [];
}

function closeInfoWindows() {
	for (var i = 0; i < infoWindows.length; i++) {

		var infoWindow = infoWindows[i];

		if (infoWindow.getMap()) {
			infoWindow.close();
		}
	}
}
/**원 초기화*/
function clearCircle() {
	if (circleK != null && circleK != undefined) {
		circleK.setMap(null);
		circleK = null;
	}
	if (circleN != null && circleN != undefined) {
		circleN.setMap(null);
		circleN = null;
	}
}


/****************************************************************/
/** 대피소 관련*/
/****************************************************************/
/*
 * 내 위치 정보 
*/
function startMyPositionInfo() {
	var mobileKeyWords = new Array('iPhone');

	if (appversion == "") {
		appversion = getCookie('appversion');
	}

	for (var word in mobileKeyWords) {
		if (navigator.userAgent.match(mobileKeyWords[word]) != null && navigator.userAgent.match(mobileKeyWords[word]) == 'iPhone') {
			//iPhone 10 이상
			var iosVer = iOSversion();

			if (iosVer[0] >= 10 && appversion <= '3.2.07') {		//ios 10이상 버전용  2017.08.16
				jAlert('iPhone OS 10 이상의 현재브라우저에서는  현위치를 가져올 수 없습니다.', '');
				return false;
			}
		}
	}
	//ios 10이상 버전용  2017.08.16
	if (appversion > '3.2.07') {
		if (latitude == undefined || latitude == '' ||latitude <= 0 || longitude <= 0) {
			latitude = getCookie("cookieLan");
			longitude = getCookie("cookieLon");
		}
	
		
		var cookieLat = aesDecryptToJson(latitude);
		var cookieLon = aesDecryptToJson(longitude);
		// 쿠키에 위경도 없을 시
		if (cookieLat == undefined || !cookieLat.includes(".") ||cookieLon == undefined || !cookieLon.includes(".") ) {
			latitude = '';
			longitude = '';
			jAlert(MSG_POSITIONINFO_ERR, '');
			return false;
		}
		setLatLon(cookieLat, cookieLon);
		return true;
	} else if (navigator.geolocation) {//안드로이드일 경우

		if (latitude != undefined && latitude > 0 && longitude > 0) {
			setLatLon(latitude, longitude);
			return true;
		} else {
			startNavigatorGeolocation();
		}
	}
	else {
		jAlert(MSG_POSITIONINFO_ERR, '');
	}

	return false;

}

function startNavigatorGeolocation() {
	navigator.geolocation.getCurrentPosition(function(position) {

		// 맵의 센터를 설정
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		setLatLon(latitude, longitude);

		if (flgCurrentMap == NAVER) {//네이버 지도일 경우
			displayMyPositonN(latlon);

		} else if (flgCurrentMap == KAKAO) {
			displayMyPositonK(latlon);
		}
	
	},
		function(error) {
			jAlert(MSG_POSITIONINFO_ERR + error.code, '');

		},
		{ timeout: 20000 });
}


function setFacility(distance) {

	$(".custom_mapViewing").show();

	var addressName = "";

	//박미영 임시 주석처리
	//getGeoLocationByGPS("getAddrCode.do", function(data) {
	//addressName = data.data.addressName;
	addressName = '';
	ajaxFacilityList(addressName, latlon, distance);

	//});

}

/** 
 * 드래그이벤트 발생
 * */
function moveLatLng() {
	$(".custom_mapViewing").show();

	var addressName = "";
	// 반경표시
	if (flgCurrentMap == NAVER) { //네이버
		latlon = naverMap.getCenter();
		showMapCircleN(latlon, l_distance);
	} else if (flgCurrentMap == KAKAO) { //카카오톡
		latlon = kakaoMap.getCenter();
		showMapCircleK(latlon, l_distance);
	}

	// 반경내 시설물 표시 (기존 소스는 둘다 호출하게 되어있어서 확인 필요)
	//setFacility(useMap, l_distance);
	ajaxFacilityList(addressName, latlon, l_distance);

}

/**
대피소 리스트 조회
*/
function ajaxFacilityList(addressName, latlon, distance) {

	// 마커와 정보창 지움
	cleareMarkers();
	if (latlon == null) {
		console.log(" latlon 정보 없음");
		return;
	}


	var lat, lng;
	if (flgCurrentMap == NAVER) { //네이버일 경우
		lat = latlon.lat();
		lng = latlon.lng();
	} else if (flgCurrentMap == KAKAO) { //카카오톡일 경우
		lat = latlon.Ma;
		lng = latlon.La;
	}

	//lat = 36.4893842;
	//lng = 127.2570026;
	console.log("move lat=" + lat);
	console.log("move lng=" + lng);
	var Enlat = aesEncryptToValue(lat);
	var Enlng = aesEncryptToValue(lng);

	$.ajax({
		type: 'POST',
		dataType: "JSON",
		url: "/facility/facilityListAjax.do",
		data: { "latitude": Enlat, "longitude": Enlng, "distance": distance, "facilityType": facility_type, "addressName": addressName, "openFacilityCode": openFacilityCode },
		success: function(JSON) {
			console.log("JSON:::" + JSON);
			if (JSON && JSON.length > 0) {
				for (var a = 0; a < JSON.length; a++) {
					if (flgCurrentMap == NAVER) {
						setMarkerPushN(a, JSON);
					} else if (flgCurrentMap == KAKAO) {
						setMarkerPushK(a, JSON);
					}
				}
			}

			$(".custom_mapViewing").hide();

		},
		error: function(request, status, error) {
			$(".custom_mapViewing").hide();
			console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});

}
/**거리 선택*/
function changeDistance(distance) {
	initDistanceBtn(distance);// on 버튼 초기화


	$("#" + distance).addClass("on");
	var k_level = 5; //카카오 레벨
	var n_zoom = 3; //네이버 줌

	if (distance == 500) {
		n_zoom = 15;
		k_level = 5;
	}
	else if (distance == 1000) {
		n_zoom = 14;
		k_level = 6;
	}
	else if (distance == 1500) {
		n_zoom = 13;
		k_level = 7;
	}
	else if (distance == 2000) {
		n_zoom = 13;
		k_level = 7;
	}
	else if (distance == 2500) {
		n_zoom = 13;
		k_level = 7;
	}

	if (flgCurrentMap == NAVER) {//네이버 지도일 경우
		if (naverMap == null || naverErr) return;
		naverMap.setZoom(n_zoom);
		naverMap.setCenter(latlon);
		//지도 원 그리기
		showMapCircleN(latlon, distance);

	} else if (flgCurrentMap == KAKAO) {
		if (kakaoMap == null || kakaoErr) return;
		kakaoMap.setLevel(k_level);
		kakaoMap.setCenter(latlon);
		//지도 원 그리기
		showMapCircleK(latlon, distance);
	}
	setFacility(distance);

}

/**거리 선택 버튼 초기화**/
function initDistanceBtn(distance) {
	l_distance = distance;
	var btn = $("ul.distanceList button[type='button']");
	if (btn) {
		btn.removeClass("on");
	}
	$("#" + distance).addClass("on");
}

/****************************************************************/
/** 하천강우 관련*/
/****************************************************************/
/**
 * 하천 강우 표시
*/
function showRainInfo() {

	if ($("#addressName").val() == "") {
		// 지역코드와 지역명을 가져온다.
		getGeoLocationByGPS("getAddrCode.do",
			function(data) {
				address = data.data.addressName.split(" ")[0];
				addressCode = data.data.addressCode.substring(0, 2) + "00000000";
				$("#addressName").val(address);
				$("#addressCode").val(addressCode);
				rainInfoRequestAjaxList();
			});
	} else {
		rainInfoRequestAjaxList();
	}

}
/**
 * 비동기 통신
*/
function rainInfoRequestAjaxList() {
	switch (flgCurrentPage) {
		case WaterRainInfoShow:
			ajaxWaterRainInfoList();
			break;
		case WaterRiverStageShow:
			ajaxWaterRiverStageList();
			break;
	}
}

/**
 하천 강우 리스트 조회
*/
function ajaxWaterRainInfoList() {
	if ($.trim($("#addressName").val()) == "") {
		jAlert('지역을 선택해 주세요.', '');
		return false;
	}

	// 마커와 정보창 지움
	cleareMarkers();

	addressCode = $("#addressCode").val().substring(0, 2) + "00000000";;



	var rain_info = sidoLatLon_rainInfo[addressCode];
	if (rain_info != undefined) {
		latitude = sidoLatLon_rainInfo[addressCode].latitude;
		longitude = sidoLatLon_rainInfo[addressCode].longitude;
		nowZoom = sidoLatLon_rainInfo[addressCode].zoom;
		nowLevel = sidoLatLon_rainInfo[addressCode].level;
	}
	//위경도 기준 센터 설정 줌 적용
	setLatLonCenterZoom();

	$.ajax({
		type: 'POST',
		dataType: "JSON",
		url: "/water/showRainInfoList.do",
		data: {
			"viewType": "asd",
			"addressName": $("#addressName").val().replace(/[ ]{0,1}전(체|국){1}/g, "")
		},
		success: function(JSON) {
			console.log(JSON);
			// 데이터가 있다면 마커와 정보창을 셋팅한다.
			if (JSON && JSON.length > 0) {
				for (var a = 0; a < JSON.length; a++) {
					if (flgCurrentMap == NAVER) {
						setMarkerPushN(a, JSON);
					} else if (flgCurrentMap == KAKAO) {
						setMarkerPushK(a, JSON);
					}

				}
			}
		},
		error: function(xhr, status, error) { /* 실패시 */
		}
	});
}

/**
 하천 수위 리스트 조회
*/
function ajaxWaterRiverStageList() {
	if ($.trim($("#addressName").val()) == "") {
		jAlert('지역을 선택해 주세요.', '');
		return false;
	}

	// 마커와 정보창 지움
	cleareMarkers();

	addressCode = $("#addressCode").val().substring(0, 2) + "00000000";;


	var rain_info = sidoLatLon_RiverStage[addressCode];
	if (rain_info != undefined) {
		latitude = sidoLatLon_RiverStage[addressCode].latitude;
		longitude = sidoLatLon_RiverStage[addressCode].longitude;
		nowZoom = sidoLatLon_RiverStage[addressCode].zoom;
		nowLevel = sidoLatLon_RiverStage[addressCode].level;
	}

	//위경도 기준 센터 설정 줌 적용
	setLatLonCenterZoom();

	$.ajax({
		type: 'POST',
		dataType: "JSON",
		url: "/water/showRiverStageList.do",
		data: {
			"viewType": "asd",
			"addressName": $("#addressName").val().replace(/[ ]{0,1}전(체|국){1}/g, ""),
			"addressCode": $("#addressCode").val()
		},
		success: function(JSON) {
			console.log(JSON);
			// 데이터가 있다면 마커와 정보창을 셋팅한다.
			if (JSON && JSON.length > 0) {
				for (var a = 0; a < JSON.length; a++) {
					if (flgCurrentMap == NAVER) {
						setMarkerPushN(a, JSON);
					} else if (flgCurrentMap == KAKAO) {
						setMarkerPushK(a, JSON);
					}

				}
			}
		},
		error: function(xhr, status, error) { /* 실패시 */
		}
	});
}
/** 
 * 하천 강우 이동
 * */
function moveLatLngWaterRain() {
	// 반경표시
	if (flgCurrentMap == NAVER) { //네이버
		latlon = naverMap.getCenter();
	} else if (flgCurrentMap == KAKAO) { //카카오톡
		latlon = kakaoMap.getCenter();
	}


}

