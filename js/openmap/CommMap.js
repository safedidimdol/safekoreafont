/***
 * @utf-8 
 */
/****************************************************************/
/** MapDefine  공통 변수 선언*/
/****************************************************************/

//지도 페이지 구분 상수
const CivilDefenseEducation = "/civilDefenseEducation/showMap.do";
const DisasterShowAccident = "disasterShowAccident";
const FacilityShow = "/facility/showMap.do";
const FacilityDistance = "/facility/showDistanceMap.do";
const FacilityColdWave = "/facility/showMapForColdwaveRestarea.do";
const FacilityHeatWave = "/facility/showMapForHeatwaveRestarea.do";
const FireInfoDistance = "fireInfoDistance";
const FireInfoShow = "fireInfoShow";
const ForestFires = "forestFires";
const NationalParkShow = "nationalParkShow";
const RadiationShow = "radiationShow";
const SteepInclineShow = "/steepIncline/showInclineInfoMap.do";
const TrafficShow = "/traffic/showMap.do";
const WaterRainInfoShow = "/water/showRainInfoList.do";
const WaterRiverStageShow = "/water/showRiverStageList.do";
const WeatherFineDustShow = "/weather/showFineDust.do";


//카카오톡지도 네이버 지도 구분 
const NAVER = "N";
const KAKAO = "K";


var flgCurrentPage = location.pathname; // 현재 페이지 정보
var flgCurrentMap = NAVER;//현재 실행 맵
var mapContainer, kakaoContainer, naverContainer;// 지도를 표시할 div 

//서울 중심(37.5665350, 126.9779690);  
//대한민국 중심(36.582061, 127.90053); 
var initCenterLat = 36.582061;
var initCenterLng = 127.90053;

var circleN = null;
var circleK = null;
var nowZoom, nowCenter, nowLevel;
var initZoom = 7, initLevel = 13;



var l_distance = 500;

var facility_type = "";
var facilityName;

var traffic_type, traffic_typeOther;

var inclineCode, inclineName;
// 주소값
var address = "";
var addressCode;
var latitude;
var longitude;
var latlon;

var naverErr = false; //네이버 에러 발생 체크
var kakaoErr = false;



var openFacilityCode;
var jisgunderse;

var markers = [], infoWindows = [], markerLat = [], markerLon = [];

//에러 메시지
const MSG_POSITIONINFO_ERR = "위치정보를 사용할 수 없습니다. 위치정보를 켜신 후, 다시 시도해 주십시오.";
const MSG_ADDRESS_ERR = "주소가 잘못되어 지도위치를 찾을 수 없습니다.";
const MSG_LATLON_ERR = "정확한 위치좌표(위경도)가 입력되어 있지 않아 위치를 표시할 수 없습니다.";
const MSG_NAVER_ERR = "네이버 지도 오류\n (카카오 지도로 이동합니다.)";
const MSG_KAKAO_ERR = "카카오 지도 오류\n (네이버 지도로 이동합니다.)";
const MSG_NAVER_KAKAO_ERR = "지도 서비스가 불안정하여 이전 페이지로 이동합니다.";

// 민방위대피소(FTL_1),  임시주거시설(FTL_5), 경찰서(FTL_6), 소방서(FTL_7), 경찰서(FTL_8), 경찰서(FTL_9), 해양결찰서(FTL_10), 
// 제주도 대피소 (FTL_11), 무더위쉼터(FTL_14), 지진옥외대피장소(FTL_15), 지진해일긴급대피장소(FTL_16),
// 혈액원(FTL_17),  미세먼지쉼터(FTL_18), 한파쉼터(FTL_19), 화학사고대피장소(FTL_20)

var ftlArr = ['FTL_1', 'FTL_5', 'FTL_6', 'FTL_7', 'FTL_8', 'FTL_9', 'FTL_10', 'FTL_11', 'FTL_12', 'FTL_13', 'FTL_14', 'FTL_15', 'FTL_16', 'FTL_18', 'FTL_19', 'FTL_20'];


var appversion = "";

/****************************************************************/
/** Map 전체 공통*/
/****************************************************************/

/**
지도표시하기
@param useMap N:네이버 K:카카오톡

 */
function showMap(useMap) {


	latlon = null;
	closeDistanceMap();//지도 자원 반납
	if (useMap == NAVER) {
		flgCurrentMap = NAVER;
		startNaverMap();
		$(".setMapheader a:nth-child(1)").attr("href", "javascript:showMap('K');");
		$(".setMapheader a:nth-child(1) img").attr("src", "/idsiSFK/neo/ext/img/common/icon_kakao_map.png");
		$(".setMapheader a:nth-child(1) img").attr("alt", "카카오톡");

	} else if (useMap == KAKAO) {
		flgCurrentMap = KAKAO;
		startKakaoMap();
		$(".setMapheader a:nth-child(1)").attr("href", "javascript:showMap('N');");
		$(".setMapheader a:nth-child(1) img").attr("src", "/idsiSFK/neo/ext/img/common/icon_naver_map.png");
		$(".setMapheader a:nth-child(1) img").attr("alt", "네이버");
	}
}
/**
 * 지도 화면 표시
*/
function displayMapContainer() {
	if (flgCurrentMap == NAVER) {
		$(".kakao_radius_border").hide();
		if (naverContainer != null)
			naverContainer.style.display = 'block';
		if (kakaoContainer != null)
			kakaoContainer.style.display = 'none';
	} else if (flgCurrentMap == KAKAO) {
		$(".kakao_radius_border").show();
		if (naverContainer != null)
			naverContainer.style.display = 'none';
		if (kakaoContainer != null)
			kakaoContainer.style.display = 'block';

	}
	if (kakaoMap) kakaoMap.relayout();
}


/**지도 전환 시 자원 반납*/
function closeDistanceMap() {
	initDistanceBtn(500);
	cleareMarkers();
	clearCircle();

}


//범례 
function showInfo() {
	showDim();
	$("#info").css({
		"display": "block",
		"width": Math.round(window.innerWidth * 0.8) + "px",
		"left": "50%",
		"top": "50%",
		"-webkit-transform": "translate(-50%, -50%)",
		"-webkit-transform-origin": "0 0",
		"transform": "translate(-50%, -50%)",
		"transform-origin": "0 0",
		"margin-top": "0",
		"padding-bottom": "0"
	});
}

function hideInfo() {
	hideDim();
	$('#info').css('display', 'none');
}


/***
 * 네이버 에러 메시지 표시
 * 
*/
function showNaverErrMsg() {

	if (naverContainer == undefined) {
		//자바스크립트 로딩 전 발생
		console.log("네이버 지도 스크립트 로딩 전 오류!");
		return;
	}
	if (naverContainer.innerHTML === '') {
		naverErr = true; //에러발생 여부 플래그
		jAlert(MSG_NAVER_ERR, "", function() {
			if (checkAllErrNaverKaKao()) return;
			showMap(KAKAO);
		});
	}
}
/***
 * 네이버 에러 메시지 표시
 * 
*/
function showKakaoErrMsg() {

	if (kakaoContainer == undefined) {
		//자바스크립트 로딩 전 발생
		console.log("카카오 지도 스크립트 로딩 전 오류!");
		return;
	}

	if (kakaoContainer.innerHTML === '') {
		kakaoErr = true;
		jAlert(MSG_KAKAO_ERR, "", function() {
			if (checkAllErrNaverKaKao()) return;
			showMap(NAVER);
		});
	}
}
/**
 * 네이버 지도 카카오 지도 둘다 에러발생 여부
*/
function checkAllErrNaverKaKao() {
	var result = (naverErr && kakaoErr);
	if (result) {
		jAlert(MSG_NAVER_KAKAO_ERR, "", function() {
			//둘다 오류 일 경우 종료 처리
			history.back(-1);
		});

	}
	return result;
}


/**
 * 지도 위경도 줌 초기값 셋팅
*/
function initMapOption() {
	switch (flgCurrentPage) {
		case FacilityShow:
		case FacilityDistance:
		case FacilityHeatWave:
		case FacilityColdWave:
			initZoom = 15; //기존 설정 값
			initLevel = 5;
			initCenterLatLngToSeoul();
			break;
		case TrafficShow:
		case WaterRiverStageShow:
		case WaterRainInfoShow:
			initZoom = 10; //기존 설정 값
			initLevel = 10;
			initCenterLatLngToSeoul();
			break;
		case CivilDefenseEducation:
		case SteepInclineShow:
			initZoom = 9; //기존 설정 값
			initLevel = 11;
			break;

	}
}
/**
 * 위경도 서울 중심으로 설정
*/
function initCenterLatLngToSeoul() {
	initCenterLat = 37.5665350; //서울 중심 표기
	initCenterLng = 126.9779690;//서울 중심 표기
}

initMapOption();

/**지도 공통 
 * 맵 사이즈**/

$(function() {
	var width = window.innerWidth + "px";
	var height = (window.innerHeight - parseInt($("header").css("height"), 10)) + "px";

	switch (flgCurrentPage) {
		case WaterRainInfoShow:
		case WaterRiverStageShow:
			height = (window.innerHeight - ($("header").prop("scrollHeight")
				+ $("ul.tabSt03").prop("scrollHeight") + $(
					"div.iposition").prop("scrollHeight")))
				+ "px";
			break;
	}
	// 맵 영역의 가로세로 설정
	$("#mapLocation").css(
		{
			"width": width,
			"height": height,
		});

	//	var mapHtml = '<div id="naver" style="'+width+'; height:'+height+'; display:none;"></div>';
	//	mapHtml += '<div id="kakao" style="'+width+'; height:'+height+'; display:none;"></div>';

	mapContainer = document.getElementById('mapLocation');
	//mapContainer.innerHTML = mapHtml;
	naverContainer = document.getElementById('naver');
	kakaoContainer = document.getElementById('kakao');

	if (kakaoContainer) {
		kakaoContainer.style.width = width;
		kakaoContainer.style.height = height;
	}
	if (naverContainer) {
		naverContainer.style.width = width;
		naverContainer.style.height = height;
	}

});
