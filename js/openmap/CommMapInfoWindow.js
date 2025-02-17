/****************************************************************/
/** Marker 아이콘 Infowindow 그리는 공통*/
/****************************************************************/
const urlParams = new URL(location.href).searchParams;
var facilityDtl = decodeURIComponent(urlParams.get('facilDtl')); 

/**대피소 관련 아이콘*/
var iconData = {
	"FTL_1": "/images/common/marker_defense.png",
	"FTL_2": "/images/common/marker_emergency.png",
	"FTL_3": "/images/common/marker_hospital.png",
	"FTL_4": "/images/common/marker_pharmacy.png",
	"FTL_5": "/images/common/marker_victim.png",
	"FTL_6": "/images/common/marker_police.png",
	"FTL_7": "/images/common/marker_firehouse.png",
	"FTL_8": "/images/common/marker_police.png", //경찰서
	"FTL_9": "/images/common/marker_police.png", //경찰서
	"FTL_10": "/images/common/marker_kcg.png",
	"FTL_11": "/images/common/marker_defense.png",
	"FTL_12": "/images/common/marker_kcg.png",
	"FTL_13": "/images/common/marker_kcg.png",
	"FTL_14": "/images/marker/marker3_2.png",
	"FTL_15": "/images/common/marker_shelter.png",
	"FTL_16": "/images/common/marker_tsunami.png",
	"FTL_17": "/images/common/marker_blood.png",
	"FTL_18": "/images/common/marker_fineDust.png",
	"FTL_19": "/images/common/marker_coldwave.png",
	"FTL_20": "/images/common/marker_chemical.png"

};

var iconName = {
	"FTL_1": "민방위대피소",
	"FTL_2": "응급의료센터",
	"FTL_3": "병원",
	"FTL_4": "약국",
	"FTL_5": "임시주거시설",
	"FTL_6": "경찰서",
	"FTL_7": "소방서",
	"FTL_10": "해양경찰서",
	"FTL_14": "무더위쉼터",
	"FTL_15": "지진옥외대피소",
	"FTL_16": "지진해일대피소",
	"FTL_17": "혈액원",
	"FTL_18": "미세먼지쉼터",
	"FTL_19": "한파쉼터",
	"FTL_20": "화학사고대피장소"
};
/**경사지 아이콘*/
var inclineIconData = {
	"FTL_1": "/images/marker/marker4_1.png",
	"FTL_2": "/images/marker/marker4_2.png",
	"FTL_3": "/images/marker/marker4_3.png",
	"FTL_4": "/images/marker/marker4_4.png",
	"FTL_5": "/images/marker/marker4_5.png",
};


const mat10Tag = "<p class='inpad textStpop mat10'>";

/***
 * distance map 
 * 대피소 주소표시 윈도우 생성
 * 
*/
function getMarkerWindowHtml(idx, JSON) {

	var htmlTmp = '<div class="roundWindow" style="display:block; top:200px; width:300px; z-index:150; " onclick="return false;">';
	//무더위쉼터에만 따로 보일수있도록 처리 2017 06 27

	switch (flgCurrentPage) {

		case FacilityShow:
		case FacilityDistance:
		case FacilityHeatWave:
		case FacilityColdWave:
			if (facility_type == "FTL_14" || facility_type == "FTL_19") { //14_무더위 19_한파
				htmlTmp += '<h3 class="text-l">' + JSON[idx].facilityName + '</h3>';
				htmlTmp += mat10Tag + '' + JSON[idx].facilityAddress + '</p>';
				htmlTmp += mat10Tag + '재난담당자명 : ' + JSON[idx].dstrmnmtnm + '</p>';
				htmlTmp += mat10Tag + '연락처 : ' + JSON[idx].dstrmnmttel + '</p>';
				htmlTmp += mat10Tag + '운영시작시간(평일) : ' + JSON[idx].wkdayoperbegintime + '</p>';
				htmlTmp += mat10Tag + '운영종료시간(평일) : ' + JSON[idx].wkdayoperendtime + '</p>';
			} else {
				htmlTmp += '<h3 class="text-l">' + JSON[idx].facilityName + '</h3>';
				htmlTmp += mat10Tag + JSON[idx].facilityAddress + '</p>';
			}
			break;
		case WaterRainInfoShow://하천 강우
			htmlTmp += '<h3 class="text-l">상세정보</h3>';
			htmlTmp += '<div class="inpad textStpop mat10">';
			htmlTmp += '<dl class="st01">';
			htmlTmp += '<dt>관측소명 </dt><dd><strong>' + JSON[idx].obsNm + '</strong></dd>';
			htmlTmp += '<dt>관측일시</dt><dd><strong>' + JSON[idx].ymdHM + '</strong></dd>';
			htmlTmp += '<dt>10분 강우량</dt><dd><strong>' + JSON[idx].rf10m + 'mm</strong></dd>';
			htmlTmp += '</dl>';
			htmlTmp += '</div>';
			break;
		case WaterRiverStageShow:
			htmlTmp += getWaterRiverStageHtml(idx, JSON);
			break;

	}

	htmlTmp += '<button type="button" style="top:5px; right:5px; " class="close" onclick="hideMarker(' + idx + ')">';
	htmlTmp += '<img style="height: 25px;" src="/images/common/bt_close.gif" alt="닫기"></button></div>';

	return htmlTmp;

}

/**
 * 주소 정보 윈도우 마커 생성 html
*/
function getAddressInfoWindowHtml() { 
	var htmlTmp;

	switch (flgCurrentPage) {
		case FacilityShow: //대피소
		
			var underse = ""; //지하여부 
			if (jisgunderse != undefined && jisgunderse == '1') {
				underse = " (지하)";
			}
			htmlTmp = getInfoDtlMessaeHtml(facilityName + underse,facilityDtl,  address);
			break;
		case FacilityHeatWave:
		case FacilityColdWave:
			var underse = ""; //지하여부 
			if (jisgunderse != undefined && jisgunderse == '1') {
				underse = " (지하)";
			}
			htmlTmp = getInfoMessaeHtml(facilityName + underse, address);
			break;
		case CivilDefenseEducation:
			htmlTmp = '<div class="roundWindow" style="display:block; top:200px; width:300px;  " onclick="return false;">';
			htmlTmp += '<h3 class="text-l">정보</h3>';
			htmlTmp += '<div class="inpad textStpop mat10"><dl class="st01">';
			htmlTmp += '<dt>교육장 위치</dt><dd><strong>' + address + '</strong></dd>';
			htmlTmp += '</dl></div>';
			htmlTmp += '<button type="button" style="top:5px; right:5px; " class="close" onclick="hideMarker(0);"><img style="height: 25px;" src="/images/common/bt_close.gif" alt="닫기"></button>';
			htmlTmp += '</div>';
			break;
		case TrafficShow:
			htmlTmp = '<div class="roundWindow" style="display:block; top:200px; width:300px; " onclick="return false;">';
			htmlTmp += '<h3 class="text-l">정보</h3>';
			htmlTmp += '<p class="inpad textStpop mat10">' + traffic_typeOther + '</p>';
			htmlTmp += '<button type="button" style="top:5px; right:5px; " class="close" onclick="hideMarker(0);"><img style="height: 25px;" src="/images/common/bt_close.gif" alt="닫기"></button>';
			htmlTmp += '</div>';
			break;

		case SteepInclineShow:
			htmlTmp = getInfoMessaeHtml(inclineName, address);
			break;
		default:
			break;
	}



	return htmlTmp;
}
/**
 * 하천 수위 
*/
function getWaterRiverStageHtml(idx, JSON) {
	var htmlTmp = '';

	var waterLevel = JSON[idx].waterLevel;
	var almWl = JSON[idx].almWl;
	var wrnWl = JSON[idx].wrnWl;

	if (waterLevel == '' || waterLevel == '0') {
		waterLevel = '-';
	} else if (waterLevel.substring(0, 1) == '.') {
		waterLevel = '0' + waterLevel + 'm';
	} else if (waterLevel.substring(0, 2) == '-.') {
		waterLevel = '-0' + waterLevel.substring(1, waterLevel.length)
			+ 'm';
	} else {
		waterLevel = waterLevel + 'm';
	}

	if (almWl == '' || almWl == '0') {
		almWl = '-';
	} else if (almWl.substring(0, 1) == '.') {
		almWl = '0' + almWl + 'm';
	} else {
		almWl = almWl + 'm';
	}

	if (wrnWl == '' || wrnWl == '0') {
		wrnWl = '-';
	} else if (wrnWl.substring(0, 1) == '.') {
		wrnWl = '0' + wrnWl + 'm';
	} else {
		wrnWl = wrnWl + 'm';
	}

	htmlTmp += '<h3 class="text-l">상세정보</h3>';
	htmlTmp += '<div class="inpad textStpop mat10">'
	htmlTmp += '<dl class="st02"><dt>관측소명 </dt><dd>'
	htmlTmp += '<strong>' + JSON[idx].obsNm + '</strong></dd>'
	htmlTmp += '<dt>관측일시 </dt><dd><strong>' + JSON[idx].ymdHM + '</strong></dd>';
	htmlTmp += '<dt>현재수위 </dt><dd><strong>' + waterLevel + '</strong></dd>';
	htmlTmp += '<dt>주의보수위 </dt><dd><strong>' + wrnWl + '</strong></dd>';
	htmlTmp += '<dt>경보수위 </dt><dd><strong class="red">' + almWl + '</strong></dd>';
	htmlTmp += + '</dl>' + '</dib>';
	return htmlTmp;
}

/**
 * 기본 html 이름과 주소 표시 
 * 
*/
function getInfoMessaeHtml(name, addr) {
	var htmlTmp;
/*	htmlTmp = '<div class="mapInfoWindow" style="display:block; top:200px; width:300px; padding-left:5px;" onclick="return false;">';
	htmlTmp += '<p class="" style="line-height: 10px;"><strong>' + name + '</strong></br></br>';
	htmlTmp += addr +'</p>';
	htmlTmp += '</div>';*/
	
	
	htmlTmp = '<div style="padding:10px;min-width:250px;line-height:40%;">';
	htmlTmp += '<h4 style="overflow: hidden;height: 30px;line-height: 30px;text-overflow: ellipsis;white-space: nowrap;margin: 0px;">'+ name +'</h4><br />';
	htmlTmp += '<input id="findWay" on type="button" onclick="onclickFindWay()" value="길찾기">';
	htmlTmp += '</div>';
	
	return htmlTmp;
}



/**
 * 2024.03.25 대피소 관련 추가 
*/
function getInfoDtlMessaeHtml(name,facilityDtl, addr) {
	var htmlTmp;
/*	htmlTmp = '<div class="mapInfoWindow" style="display:block; top:200px; width:300px; padding-left:5px;" onclick="return false;">';
	htmlTmp += '<p class="" style="line-height: 10px;"><strong>' + name + '</strong></br></br>';
	htmlTmp += addr +'</p>';
	htmlTmp += '</div>';*/
	
	
	htmlTmp = '<div style="padding:10px;min-width:250px;max-width:300px;line-height:100%;">';
    htmlTmp += '<h4 style="overflow: hidden;height: 30px;line-height: 30px;text-overflow: ellipsis;white-space: nowrap;margin: 0px;">'+ name +'</h4><br />';
	
	if (facilityDtl != "null" && facilityDtl != "" && facilityDtl != "undefined" ) {
	    htmlTmp += '<span class="" style="font-weight:bold; color: green;" >-이동약자 접근성 정보-</span>';
	    htmlTmp += '<p class="">' + facilityDtl.replace(/@/gi, ", ") + '</p>';
	}
	htmlTmp += '<input id="findWay" on type="button" onclick="onclickFindWay()" value="길찾기">';
	htmlTmp += '</div>';
	
	return htmlTmp;
}

/***
 * 마커 표시 이미지 반환
*/
function getMarkerImageSrc() {
	var imageSrc = "/images/common/marker_defense.png";
	switch (flgCurrentPage) {
		case FacilityShow:
		case FacilityDistance:
		case FacilityHeatWave:
		case FacilityColdWave:
			imageSrc = getFacilityIconImageSrc();
			break;
		case CivilDefenseEducation:
			imageSrc = "/images/common/marker_defense.png";
			break;
		case TrafficShow:
			imageSrc = getTrafficIconImageSrc();
			break;
		case SteepInclineShow:
			imageSrc = getInclineIconImageSrc();
			break;
		case WaterRainInfoShow://하천 강우
			imageSrc = "/images/marker/marker_rainfall.png";
			break;
		case WaterRiverStageShow://하천 수위
			imageSrc =  "/images/marker/marker_water-level-.png";
			break;
		default:
			break;
	}

	return imageSrc;
}

/***
 * 대피소 표시 아이콘 이미지
 * 
*/
function getFacilityIconImageSrc() {
	if (facility_type == "") return;
	var imageSrc = "http://static.naver.net/maps/mantle/1x/marker-default.png"; // 마커이미지의 주소입니다
//	var imageSrc = iconData[facility_type]; // 마커이미지의 주소입니다

	switch (flgCurrentPage) {
		case FacilityShow:
			if (facility_type == "FTL_1" && openFacilityCode == "E") {
				imageSrc = "/images/common/marker_water.png";
			}
			break;
		case FacilityDistance:
			if (facility_type == "FTL_1" && facility_type == "6") {
				imageSrc = "/images/common/marker_water.png";
			} else if (facility_type == "FTL_1" && openFacilityCode == "5") {
				imageSrc = "/images/common/marker_defense.png";
			}
			break;
	}


	return imageSrc;

}
/***
 * 교통정보 표시 아이콘 이미지
 * 
*/
function getTrafficIconImageSrc() {
	switch (traffic_type) {
		case "TRAFFIC_INFO_ACCIDENT":
			return imageSrc = "/images/marker/marker_accident.png";
		case "TRAFFIC_INFO_CONSTRUCTION":
			return imageSrc = "/images/marker/marker_construction.png";
		default:
			return imageSrc = "/images/marker/marker_event.png";
	}

}

/**
 * 급경사지 아이콘 이미지
 * */
function getInclineIconImageSrc() {
	var imgSrc = inclineIconData['FTL_1'];
	switch (inclineCode) {
		case '01':
			imgSrc = inclineIconData['FTL_1'];
			break;
		case '02':
			imgSrc = inclineIconData['FTL_2'];
			break;
		case '03':
			imgSrc = inclineIconData['FTL_3'];
			break;
		case '04':
			imgSrc = inclineIconData['FTL_4'];
			break;
		case '05':
			imgSrc = inclineIconData['FTL_5'];
			break;
		default:
			break;
	}
	return imgSrc;
}
/**
 * 아이콘 이미지 별 사이즈
*/
function getImageInfoSize() {
	var width = 20, height = 31; //기본 사이즈
	switch (flgCurrentPage) {
		case FacilityShow:
			break;
		case SteepInclineShow:
			width = 27, height = 31;
			break;
		default:
			break;
	}

	if (flgCurrentMap == NAVER) {
		return new naver.maps.Size(width, height);
	} else if (flgCurrentMap == KAKAO) {
		return new kakao.maps.Size(width, height);
	}

}