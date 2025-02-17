
/****************************************************************/
/** showMap 공통*/
/****************************************************************/


/**위경도 표시 메시지*/
function getLatlngMessage(useMap, latlng) {
	var lat, lng, level;
	if (useMap == NAVER) { //네이버일 경우
		lat = latlng.lat();
		lng = latlng.lng();
	} else if (useMap == KAKAO) { //카카오톡일 경우
		level = kakaoMap.getLevel();
		lat = latlng.Ma;
		lng = latlng.La;
	}

	var message = '<p>지도 레벨은 ' + level + ' 이고</p>';
	message += '<p>중심 좌표는 위도 ' + lat + ', 경도 ' + lng + '입니다</p>';
	return message;
}
