if(!document.getElementById("COMMON_MSG")) {
	//document.writeln('<script id="COMMON_MSG" type="text/javascript" src="/common/getCommonMessageJS.do"></script>');

}

/**
 * 현재 지역 정보를 가져온다.
 * url의 종류 : getAddrCode.do, getAddrCodeOrNeighborhood.do, getGoogleAddressData.do
 */
var targetUrl;
var targetFunction;

var defaultLatitude = '37.5714569';
var defaultLongitude = '126.9733856';
/*
var defaultLatitude = '37.571008';
var defaultLongitude = '129.0632169';
*/

// 서울특별시 종로구 세종로 1-75 (이순신 장군 동상)
// 37.571008, 126.976943

// 암호화 키값
var key = '';
var iv  = '';

var JsonFormatter = {
        stringify: function (cipherParams) {
            // create json object with ciphertext
            var jsonObj = {
                ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };

            // optionally add iv and salt
            if (cipherParams.iv) {
                jsonObj.iv = cipherParams.iv.toString();
            }
            if (cipherParams.salt) {
                jsonObj.s = cipherParams.salt.toString();
            }

            // stringify json object
            return JSON.stringify(jsonObj);
        },

        parse: function (jsonStr) {
            // parse json string
            var jsonObj = JSON.parse(jsonStr);

            // extract ciphertext from json object, and create cipher params object
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
            });

            // optionally extract iv and salt
            if (jsonObj.iv) {
                cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
            }
            if (jsonObj.s) {
                cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
            }

            return cipherParams;
        }
    };

/**
 * @brief 암호화 키 설정
 */
function initCryptoJS() {
	if (key == '' || iv == '') {
		// 암호화 키값 설정
		key = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
		iv  = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
	}
}

/**key값에 map에 opercity값 적용 되는거 수정  */
function getKeyCryptoJS() {
	return CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
}
function getIvCryptoJS() {
	return CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
}
function showDim() {

    if (!navigator.userAgent.match('iPhone')) {
    	// iPhone에서는 미적용
    	$('[data-role=page]').wrap('<div style="display:none;" />');
    }

	dim = $("<div/>", {"class" : "dim", "id" : "COMMON_DIM"}).html("&nbsp;");
	$("body").append(dim);

	/*$("html").css({overflow: "hidden"});
	$("body").css({overflow: "hidden"});*/
}

function hideDim() {
	/*$("html").css({overflow: ""});
	$("body").css({overflow: ""});*/

	$("#COMMON_DIM").remove();

	if (!navigator.userAgent.match('iPhone')) {
		// iPhone에서는 미적용
		$('[data-role=page]').unwrap('<div style="display:none;" />');
    }
}

function showLoading(index) {
	var htmlText;

	switch(index) {
	case 1 :
		htmlText = "데이터를 업로드 중입니다...";
		break;
	default :
		//htmlText = "GPS를 이용한<br>현재위치 조회중 입니다...";
		break;
	}

	showDim();

	loading = $("<div/>", {"id" : "COMMON_LD"}).css({
		"position" : "absolute" ,
		"left" : "50%" ,
		"top" : (window.innerHeight / 2) + "px" ,
		"-webkit-transform" : "translate(-50%, -50%)" ,
		"font-size" : "25px" ,
		"line-height" : "30px" ,
		"text-align" : "center" ,
		"width" : window.innerWidth + "px" ,
		"color" : "white" ,
		"z-index" : "10001" ,
		"text-shadow" : "0px 0px 10px rgb(20, 0, 255)" ,
		"font-weight" : "bold" ,
	}).html(htmlText);
	$("body").append(loading);
}

function hideLoading() {
	hideDim();
	$("#COMMON_LD").remove();
}

/**
 * @brief 타겟태그를 받아 위경도를 저장한다 (전국이 기본값인 CCTV 목록 검색에 적용)
 * @param targetLatTag
 * @param targetLonTag
 */
function getGeoLocationCurrentPosition(targetLatTag, targetLonTag) {
	var cookieLat = getCookie("cookieLan");
	var cookieLon = getCookie("cookieLon");

	cookieLat = aesDecryptToJson(cookieLat);
	cookieLon = aesDecryptToJson(cookieLon);

	if( !isEmptyString(cookieLat) && !isEmptyString(cookieLon) ) {
		$('#' + targetLatTag).val(cookieLat);
		$('#' + targetLonTag).val(cookieLon);
	}
	else if (navigator.geolocation) {
		if(document.cookie.split("; ").indexOf("platformId=1") > -1||
				getCookie("platformId").indexOf("encry_2beee3") > -1) { // 안드로이드
			navigator.geolocation.getCurrentPosition(function(position){
				$('#' + targetLatTag).val(position.coords.latitude);
				$('#' + targetLonTag).val(position.coords.longitude);
			}, geoCodeError, { timeout : 5000});
		}
		else { // 아이폰
			navigator.geolocation.getCurrentPosition(function(position){
				$('#' + targetLatTag).val(position.coords.latitude);
				$('#' + targetLonTag).val(position.coords.longitude);});
		}
	}
	else {
		$('#' + targetLatTag).val(defaultLatitude);
		$('#' + targetLonTag).val(defaultLongitude);
		//alert(getCommonMSG("GET_GPS_FAIL"));
	}
}

//====================== google API(위경도로 주소 가져오기) 관련 함수 start ==============================//
/**
 * <pre>
 * @brief
 * <strong>1step -> 위경도 조회</strong>
 * 2step -> 위경도 값으로 한글 주소 명칭 조회
 * 3step -> 한글 주소 명칭을 정의된 afterFunction에 의해 저장한다.
 *
 * url type : getAddrCode.do / getGoogleAddressData.do
 * afterFunction : 주로 리턴받은 값을 원하는곳에 저장하는 기능을 정의한다.
 * </pre>
 * @param url
 * @param afterFunction
 */
function getGeoLocation(url, afterFunction) {
	var cookieLat = getCookie("cookieLan");
	var cookieLon = getCookie("cookieLon");

	// url 및 afterFunction을 전역변수에 저장한다.
	targetUrl = url;
	targetFunction = afterFunction;

	if( !isEmptyString(cookieLat) && !isEmptyString(cookieLon) ) {
		currentGeoData2(cookieLat, cookieLon);
	}
	else if (navigator.geolocation) {
		if(document.cookie.split("; ").indexOf("platformId=1") > -1||
				getCookie("platformId").indexOf("encry_2beee3") > -1) { // 안드로이드
			navigator.geolocation.getCurrentPosition(currentGeoData, geoCodeError, { timeout : 5000});
		}
		else { // 아이폰
			navigator.geolocation.getCurrentPosition(currentGeoData);
		}
	}
	else {
		alert(getCommonMSG("GET_GPS_FAIL"));
	}
}

/**
 * <pre>
 * @brief
 * 1step -> 위경도 조회
 * <strong>2step -> 위경도 값으로 한글 주소 명칭 조회</strong>
 * 3step -> 한글 주소 명칭을 정의된 afterFunction에 의해 저장한다.
 *
 * </pre>
 * @param position
 */
function currentGeoData(position) {
	$.ajax({
		type : 'get' ,
		dataType : "json" ,
		url : "http://maps.googleapis.com/maps/api/geocode/json" ,
		data : "latlng="+position.coords.latitude+","+position.coords.longitude+"&sensor=false&language=ko" ,
		success : function(DATA) {
			if(DATA) {
				getResult({
					url : targetUrl ,
					latitude : position.coords.latitude ,
					longitude : position.coords.longitude ,
					afterFunction : targetFunction ,
					data : DATA
				});
			}
		},
		error : function(xhr, status, error) { /* 실패시 */
		}
	});
}


/**
 * <pre>
 * @brief
 * 쿠키에 값이 있을 시 호출된다.
 * 1step -> 위경도 조회
 * <strong>2step -> 위경도 값으로 한글 주소 명칭 조회</strong>
 * 3step -> 한글 주소 명칭을 정의된 afterFunction에 의해 저장한다.
 *
 * </pre>
 * @param position
 */
function currentGeoData2(latitude, longitude) {
	$.ajax({
		type : 'get' ,
		dataType : "json" ,
		url : "http://maps.googleapis.com/maps/api/geocode/json" ,
		data : "latlng="+latitude+","+longitude+"&sensor=false&language=ko" ,
		success : function(DATA) {
			if(DATA) {
				getResult({
					url : targetUrl ,
					latitude : latitude ,
					longitude : longitude ,
					afterFunction : targetFunction ,
					data : DATA
				});
			}
		},
		error : function(xhr, status, error) { /* 실패시 */
		}
	});
}

/**
 * @brief GPS 수신 에러
 * @param error
 */
function geoCodeError(page, error) {
	currentGeoDataByNotGPS();
}

/**
 * <pre>
 * @brief
 * 전역변수에 저장된 url을 호출하여 값을 가져온 후 최종 afterFunction을 호출한다.
 * 1step -> 위경도 조회
 * 2step -> 위경도 값으로 한글 주소 명칭 조회
 * <strong>3step -> 한글 주소 명칭을 정의된 afterFunction에 의해 저장한다.</strong>
 *
 * </pre>
 * @param position
 */
function getResult(data) {
	if(data.data.results) {
		if(data.url == "getGoogleAddressData.do") {
			if(typeof data.afterFunction == "function") {
				data.afterFunction({
					data : data.data.results ,
					latitude : data.latitude ,
					longitude : data.longitude
				});

				hideLoading();
			}
		}
		else {
			$.ajax({
				type : 'post' ,
				dataType : "json" ,
				url : "/common/" + data.url ,
				data : { "addressName" : data.data.results[0].formatted_address.substring(5) } ,
				success : function(json) {
					if(json) {
						if(typeof data.afterFunction == "function") {
							data.afterFunction({
								data : json ,
								latitude : data.latitude ,
								longitude : data.longitude
							});

							hideLoading();
						}
					}
				},
				error : function(xhr, status, error) { /* 실패시 */
					hideLoading();
				}
			});
		}
	}
}
//====================== google API(위경도로 주소 가져오기) 관련 함수 end ==============================//

//====================== 국토부 API(위경도로 주소 가져오기) 관련 함수 start ==============================//
/**
 * <pre>
 * @brief
 * <strong>1step -> 위경도 조회</strong>
 * 2step -> 위경도 값으로 한글 주소 명칭 조회
 * 3step -> 한글 주소 명칭을 정의된 afterFunction에 의해 저장한다.
 *
 * url type : getAddrCode.do / getGoogleAddressData.do
 * afterFunction : 주로 리턴받은 값을 원하는곳에 저장하는 기능을 정의한다.
 * </pre>
 * @param url
 * @param afterFunction
 */
function getGeoLocationByGPS(url, afterFunction) {
	var cookieLat = getCookie("cookieLan");
	var cookieLon = getCookie("cookieLon");

	cookieLat = aesDecryptToJson(cookieLat);
	cookieLon = aesDecryptToJson(cookieLon);

	// url 및 afterFunction을 전역변수에 저장한다.
	targetUrl = url;
	targetFunction = afterFunction;

	if( !isEmptyString(cookieLat) && !isEmptyString(cookieLon) ) {
		currentGeoDataByCookie(cookieLat, cookieLon);
	}
	else if (navigator.geolocation) {
		if(document.cookie.split("; ").indexOf("platformId=1") > -1 ||
				getCookie("platformId").indexOf("encry_2beee3") > -1) { // 안드로이드
			navigator.geolocation.getCurrentPosition(currentGeoDataByGPS, geoCodeErrorByGPS, { timeout : 5000});
		}
		else { // 아이폰
			navigator.geolocation.getCurrentPosition(currentGeoDataByGPS);
		}
	}
	else {
		currentGeoDataByNotGPS();
		//alert(getCommonMSG("GET_GPS_FAIL"));
	}
}

/**
 * <pre>
 * @brief
 * 위치 정보를 암호화하여 쿠키에 저장한다.
 * </pre>
 * @param position
 */
function setPositionToCookie(position) {
	var latByEncryptToJson = '';
	var lonByEncryptToJson = '';

	// 쿠키에 저장된 값은 json값으로 저장되게 한다.
	latByEncryptToJson = aesEncryptToJson(position.coords.latitude);
	lonByEncryptToJson = aesEncryptToJson(position.coords.longitude);

	// 위경도 값을 가져올 시 쿠키에 저장한다 (암호화된값)
	setCookie('cookieLan', latByEncryptToJson, 10 * 60 * 1000); // 10분 (600000)
	setCookie('cookieLon', lonByEncryptToJson, 10 * 60 * 1000); // 10분
}
//ios 10이상 버전용  2017.08.16
function setPositionToCookie(latitude,longitude,appversion) {
	var latByEncryptToJson = '';
	var lonByEncryptToJson = '';

	// 쿠키에 저장된 값은 json값으로 저장되게 한다.
	latByEncryptToJson = aesEncryptToJson(latitude);
	lonByEncryptToJson = aesEncryptToJson(longitude);

	// 위경도 값을 가져올 시 쿠키에 저장한다 (암호화된값)
	setCookie('cookieLan', latByEncryptToJson, 10 * 60 * 1000); // 10분 (600000)
	setCookie('cookieLon', lonByEncryptToJson, 10 * 60 * 1000); // 10분
	setCookie('appversion', appversion, 10 * 60 * 1000);


}



/**
 * <pre>
 * @brief
 * 1step -> 위경도 조회
 * <strong>2step -> 위경도 값으로 한글 주소 명칭 조회</strong>
 * 3step -> 한글 주소 명칭을 정의된 afterFunction에 의해 저장한다.
 *
 * </pre>
 * @param position
 */
function currentGeoDataByGPS(position) {
	var lat = '';
	var lon = '';

	var latByEncryptToJson = '';
	var lonByEncryptToJson = '';

	// 쿠키에 저장된 값은 json값으로 저장되게 한다.
	latByEncryptToJson = aesEncryptToJson(position.coords.latitude);
	lonByEncryptToJson = aesEncryptToJson(position.coords.longitude);

	// 서버 API쪽은 Aes 암호화 한다.
	lat = aesEncryptToValue(position.coords.latitude);
	lon = aesEncryptToValue(position.coords.longitude);

	// 위경도 값을 가져올 시 쿠키에 저장한다 (암호화된값)
	setCookie('cookieLan', latByEncryptToJson, 10 * 60 * 1000); // 10분 (600000)
	setCookie('cookieLon', lonByEncryptToJson, 10 * 60 * 1000); // 10분

	$.ajax({
		type : 'POST' ,
		dataType : 'JSON' ,
		url : 'http://mepv2.safekorea.go.kr/API/getAddrCodeByVworld.do' ,
//		url : 'http://localhost:8080/API/getAddrCodeByVworld.do' ,
//		url : 'http://125.60.33.132:8080/MOBILE/API/getAddrCodeByVworld.do' ,
		data : {'latitude' : lat, 'longitude' : lon},
		success : function(DATA) {
			if(DATA.ADDR.length > 0) {
				getResultByGPS({
					url : targetUrl ,
					latitude : position.coords.latitude ,
					longitude : position.coords.longitude ,
					afterFunction : targetFunction ,
					data : DATA
				});
			} else {
			}
		},
		error : function(xhr, status, error) {  // 실패시
		}
	});
}

/**
 * <pre>
 * @brief
 * 1step -> 위경도 조회
 * <strong>2step -> 위경도 값으로 한글 주소 명칭 조회</strong>
 * 3step -> 한글 주소 명칭을 정의된 afterFunction에 의해 저장한다.
 *
 * </pre>
 * @param position
 */
function currentGeoDataByNotGPS() {
	var lat = '';
	var lon = '';

	var latByEncryptToJson = '';
	var lonByEncryptToJson = '';

	// 쿠키에 저장된 값은 json값으로 저장되게 한다.
	latByEncryptToJson = aesEncryptToJson(defaultLatitude);
	lonByEncryptToJson = aesEncryptToJson(defaultLongitude);

	// 서버 API쪽은 Aes 암호화 한다.
	lat = aesEncryptToValue(defaultLatitude);
	lon = aesEncryptToValue(defaultLongitude);

	// 위경도 값을 가져올 시 쿠키에 저장한다 (암호화된값)
	setCookie('cookieLan', latByEncryptToJson, 10 * 60 * 1000); // 10분 (600000)
	setCookie('cookieLon', lonByEncryptToJson, 10 * 60 * 1000); // 10분

	$.ajax({
		type : 'POST' ,
		dataType : 'JSON' ,
		url : 'http://mepv2.safekorea.go.kr/API/getAddrCodeByVworld.do' ,
//		url : 'http://localhost:8080/API/getAddrCodeByVworld.do' ,
//		url : 'http://125.60.33.132:8080/MOBILE/API/getAddrCodeByVworld.do' ,
		data : {'latitude' : lat, 'longitude' : lon},
		success : function(DATA) {
			if(DATA.ADDR.length > 0) {
				getResultByGPS({
					url : targetUrl ,
					latitude : defaultLatitude ,
					longitude : defaultLongitude ,
					afterFunction : targetFunction ,
					data : DATA
				});
			} else {
			}
		},
		error : function(xhr, status, error) {  // 실패시
		}
	});
}

/**
 * <pre>
 * @brief
 * 쿠키에 값이 있을 시 호출된다.
 * 1step -> 위경도 조회
 * <strong>2step -> 위경도 값으로 한글 주소 명칭 조회</strong>
 * 3step -> 한글 주소 명칭을 정의된 afterFunction에 의해 저장한다.
 *
 * </pre>
 * @param position
 */
function currentGeoDataByCookie(latitude, longitude) {
	// 쿠키에 저장된 값은 json값으로 저장되게 되어있어 읽어들일때는 다시 json값을 풀어야 평문이 나온다.
	var latByDecryptToJson = aesDecryptToJson(latitude);
	var lonByDecryptToJson = aesDecryptToJson(longitude);

	try {
		if (isNaN(latByDecryptToJson)) {
			latByDecryptToJson = defaultLatitude;
			lonByDecryptToJson = defaultLongitude;
		}
	} catch ( e ) {
		latByDecryptToJson = defaultLatitude;
		lonByDecryptToJson = defaultLongitude;
	}

	// 서버 API쪽은 Aes 암호화 한값으로 넘기며 현재 페이지는 암호화 하지 않은 값을 넘겨준다.
	var lat = aesEncryptToValue(latByDecryptToJson);
	var lon = aesEncryptToValue(lonByDecryptToJson);

	$.ajax({
		type : 'POST' ,
		dataType : 'JSON' ,
		url : 'http://mepv2.safekorea.go.kr/API/getAddrCodeByVworld.do' ,
//		url : 'http://localhost:8080/API/getAddrCodeByVworld.do' ,
//		url : 'http://125.60.33.132:8080/MOBILE/API/getAddrCodeByVworld.do' ,
		data : {'latitude' : lat, 'longitude' : lon},
		success : function(DATA) {
			if(DATA.ADDR.length > 0) {
				getResultByGPS({
					url : targetUrl ,
					latitude : latByDecryptToJson ,
					longitude : lonByDecryptToJson ,
					afterFunction : targetFunction ,
					data : DATA
				});
			}
		},
		error : function(xhr, status, error) {  // 실패시
		}
	});
}

/**
 * @brief GPS 수신 에러
 * @param error
 */
function geoCodeErrorByGPS(error) {
	currentGeoDataByNotGPS();
}

/**
 * <pre>
 * @brief
 * 전역변수에 저장된 url을 호출하여 값을 가져온 후 최종 afterFunction을 호출한다.
 * 1step -> 위경도 조회
 * 2step -> 위경도 값으로 한글 주소 명칭 조회
 * <strong>3step -> 한글 주소 명칭을 정의된 afterFunction에 의해 저장한다.</strong>
 *
 * </pre>
 * @param position
 */
function getResultByGPS(data) {
	if(data.data.ADDR.length > 0) {
		if(data.url == "getGoogleAddressData.do") {
			if(typeof data.afterFunction == "function") {
				data.afterFunction({
					data : data.data.results ,
					latitude : data.latitude ,
					longitude : data.longitude
				});

				hideLoading();
			}
		} else if(data.url == "getAddrCode.do") {
			$.ajax({
				type : 'post' ,
				dataType : "json" ,
				url : "/common/" + data.url ,
				data : { "addressName" : data.data.ADDR } ,
				success : function(json) {
					if(json) {
						if(typeof data.afterFunction == "function") {
							data.afterFunction({
								data : json ,
								latitude : data.latitude ,
								longitude : data.longitude
							});

							hideLoading();
						}
					}
				},
				error : function(xhr, status, error) { /* 실패시 */
					hideLoading();
				}
			});
		} else { // 빈 값일때 data 그대로 리턴
			if(typeof data.afterFunction == "function") {
				data.afterFunction({
					data : data.data.ADDR,
					latitude : data.latitude ,
					longitude : data.longitude
				});

				hideLoading();
			}
		}
	}
}
//====================== 국토부 API(위경도로 주소 가져오기) 관련 함수 end ==============================//

/**
 * 문서의 사이즈를 조절한다.(행동요령버전)
 * @param targetArea
 * @param includeTag
 * @param plus
 */
var thisPageFirstFontSize = 0;;
var thisPageSizeStep = 0;
function changeTextSize(targetArea, includeTag, plus, sizeStep) {
	var doYn = false;
	var step = sizeStep||1;

	if( thisPageFirstFontSize == 0 ) {
		thisPageFirstFontSize = parseInt($(targetArea).css("font-size"), 10);
	}

	if(targetArea && includeTag && includeTag.length > 0 ) {
		if(plus) {
			if(thisPageSizeStep < 15) {
				doYn = true;
				thisPageFirstFontSize += step;
			}
		}
		else {
			if(thisPageSizeStep > 0) {
				doYn = true;
				thisPageFirstFontSize += (-1*step);
			}
		}

		if(doYn) {
			thisPageSizeStep += (plus?1:-1);

			for(var a = 0 ; a < includeTag.length ; a++) {
				$(targetArea).find(includeTag[a]).each(function(idx, obj) {
					$(obj).css({
						"font-size" : thisPageFirstFontSize + "px" ,
						"line-height" : (thisPageFirstFontSize+2) + "px"
					});

					if($(obj).prop("tagName").toUpperCase() == "BUTTON") {
						$(obj).css({
							"height" : (thisPageFirstFontSize+2) + "px"
						});
					}
				});
			}
		}
	}
}

function drawTextAlongArc(context, str, centerX, centerY, radius, angle) {
	var len = str.length, s;
	context.save();
	context.translate(centerX, centerY);
	context.rotate(-1 * angle / 2);
	context.rotate(-1 * (angle / len) / 2);
	for ( var n = 0; n < len; n++) {
		context.rotate(angle / len);
		context.save();
		context.translate(0, -1 * radius);
		s = str[n];
		context.fillText(s, 0, 0);
		context.restore();
	}
	context.restore();
}

function setPieChart(id, w, statusText, value) {
	var width = w;
	var height = width*0.4;
	var halfR = width/4;
	var context, startAngle, endAngle;
	var targetValue = value > 600 ? 600 : value;
	var targetDegree = -1 * (180 / 600 * targetValue);

	var x = width / 2;
	var y = height;
	var counterClockwise = false;
	var colors = ["#D7D9DE", "#74CE07", "#2455D0", "#F8DA11", "#FF8A00", "#D22800"];

	$("#head").css({
		"width" : "0px" ,
		"height" : "0px" ,
		"float" : "right" ,
		"border-left" : "20px solid black" ,
		"border-right" : "0px solid transparent" ,
		"border-bottom" : "8px solid transparent" ,
		"border-top" : "8px solid transparent" ,
		"-webkit-transform" : "translate(33%, -35%)" ,
	});

	$("#tail").css({
		"width" : "6px" ,
		"height" : "6px" ,
		"background-color" : "white" ,
		"border-radius" : "5px" ,
		"border" : "2px solid black" ,
		"-webkit-transform" : "translate(-3px, -3px)" ,
	});

	$("#needle").css({
		"width" : width/4.6 + "px" ,
		"left" : width/2 + "px" ,
		"height" : "5px" ,
		"background-color" : "black" ,
		"position" : "absolute" ,
		"bottom" : "0px" ,
		"border-radius" : "3px" ,
		"-webkit-transform-origin" : "2.5px 2.3px" ,
	});
	$("#"+id).attr({
		"width" : width + "px" ,
		"height" : height + "px"
	});

	context = document.getElementById(id).getContext("2d");

	for(var a = 1 ; a <= 6 ; a++) {
		context.save();
		startAngle = (1 + ((1 / 6) * (a-1))) * Math.PI;
		endAngle = (1 + ((1 / 6) * a)) * Math.PI;
		context.beginPath();
		context.arc(x, y, halfR, startAngle, endAngle, counterClockwise);
		context.lineWidth = width/10;
		context.strokeStyle = colors[a-1];
		context.stroke();
		context.restore();
	}

	// 안쪽 반원
	context.save();
	context.beginPath();
	context.arc(x, y, width/7, 0, Math.PI, 2*Math.PI, false);
    context.fillStyle = '#383838';
    context.fill();
    context.restore();

    context.save();
	context.beginPath();
    context.arc(x, y, width/7, 0, Math.PI, 2*Math.PI, false);
    var grd = context.createLinearGradient(x , y, x, y/2);
    grd.addColorStop(0, '#333333');
    grd.addColorStop(1, '#676767');
    context.fillStyle = grd;
    context.fill();
    context.restore();

    context.save();
	context.textAlign = 'center';
	context.font = 'bold '+(width * 0.05)+'px Tahoma';
	context.fillStyle = 'white';

	drawTextAlongArc(context, ' 정상  준비  관심  주의  경계  심각 ', x, y, halfR-(halfR * 0.03), Math.PI * 1);

	context.font = (width * 0.03)+'px Tahoma';
	context.fillStyle = 'black';

	context.fillText('단위 : 만kW', width - (width*0.1), (height * 0.1));

	context.save();
	context.font = (width * 0.05)+'px Tahoma';
	context.fillStyle = 'white';
	context.fillText(statusText, x, y-y/8);
	context.restore();

	drawTextAlongArc(context, '         500       400       300       200       100       0', x, y, halfR+(halfR * 0.3), Math.PI * 1);
	context.restore();

	window.setTimeout('eval($("#needle").css({"-webkit-transition" : "1s" , "-webkit-transform" : "rotate('+targetDegree+'deg)"}))', 500);
}

function setCookie(key, value, expires) {
	delCookie(key);

	var stringCokie = '';
	var date = new Date();

	stringCokie = key + '=' + escape(value);
	if(!isNaN(parseInt(expires, 10))) {
		date.setTime(date.getTime() + expires);
		stringCokie += ';path=/;expires=' + date.toGMTString() + ';';
	}

	document.cookie = stringCokie;


}

function delCookie(key) {
	var date = new Date();
	var validity = -1;
	date.setDate(date.getDate() + validity);
	document.cookie = key + "=;expires=" + date.toGMTString();
}

function getCookie(key) {
	var allcookies = document.cookie;
	var cookies = allcookies.split("; ");
	for ( var i = 0; i < cookies.length; i++) {
		var keyValues = cookies[i].split("=");
		if (keyValues[0] == key) {
			return unescape(keyValues[1]);
		}
	}
	return "";
}

function isEmptyString(str) {
	if(str == "") {
		return true;
	}
	else if(str == null) {
		return true;
	}
	else if(str == "undefined") {
		return true;
	}
	else {
		return false;
	}
}

function getAndroidMasterVersion() {
	return parseInt(navigator.userAgent.toUpperCase().substring(navigator.userAgent.toUpperCase().indexOf("ANDROID") + 8, navigator.userAgent.toUpperCase().indexOf("ANDROID") + 9), 10);
}

function getCommonMSG(CODE) {
	var msg = "";
	var tmp;
	for(var a = 0 ; a < commonCodeList.length ; a++) {
		tmp = commonCodeList[a];

		if(tmp["CD"] == CODE) {
			msg = tmp["CDNM"];
			break;
		}
	}

	return msg;
}

//<!-- 기상청 정보 조회를 X, Y값으로 조회하기 위해 필요한 기능
//
// LCC DFS 좌표변환을 위한 기초 자료
//
var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0;      // 격자 간격(km)
var SLAT1 = 30.0;    // 투영 위도1(degree)
var SLAT2 = 60.0;    // 투영 위도2(degree)
var OLON = 126.0;    // 기준점 경도(degree)
var OLAT = 38.0;     // 기준점 위도(degree)
var XO = 43;         // 기준점 X좌표(GRID)
var YO = 136;        // 기1준점 Y좌표(GRID)

//
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
//
function dfs_xy_conv(lat, lng) {
	var code = 'toXY';

	var v1 = lat;
	var v2 = lng;

	var DEGRAD = Math.PI / 180.0;
	var RADDEG = 180.0 / Math.PI;

	var re = RE / GRID;
	var slat1 = SLAT1 * DEGRAD;
	var slat2 = SLAT2 * DEGRAD;
	var olon  = OLON  * DEGRAD;
	var olat  = OLAT  * DEGRAD;

	var sn = Math.tan( Math.PI*0.25 + slat2*0.5 ) / Math.tan( Math.PI*0.25 + slat1*0.5 );
	sn = Math.log( Math.cos(slat1) / Math.cos(slat2) ) / Math.log(sn);

	var sf = Math.tan( Math.PI*0.25 + slat1*0.5 );
	sf = Math.pow(sf,sn) * Math.cos(slat1) / sn;

	var ro = Math.tan( Math.PI*0.25 + olat*0.5 );
	ro = re * sf / Math.pow(ro,sn);

	var rs = {};

	if (code == "toXY") {
		rs['lat'] = v1;
		rs['lng'] = v2;

		var ra = Math.tan( Math.PI*0.25 + (v1)*DEGRAD*0.5 );
		ra = re * sf / Math.pow(ra,sn);

		var theta = v2 * DEGRAD - olon;
		if (theta >  Math.PI) theta -= 2.0 * Math.PI;
		if (theta < -Math.PI) theta += 2.0 * Math.PI;
		theta *= sn;
		rs['x'] = Math.floor( ra*Math.sin(theta) + XO + 0.5 );
		rs['y'] = Math.floor( ro - ra*Math.cos(theta) + YO + 0.5 );

	} else {
		rs['x'] = v1;
		rs['y'] = v2;

		var xn = v1 - XO;
		var yn = ro - v2 + YO;

		ra = Math.sqrt( xn*xn+yn*yn );
		if (sn < 0.0) -ra;
		var alat = Math.pow( (re*sf/ra),(1.0/sn) );
		alat = 2.0*Math.atan(alat) - Math.PI*0.5;

		if (Math.abs(xn) <= 0.0) {
			theta = 0.0;
		} else {
			if (Math.abs(yn) <= 0.0) {
				theta = Math.PI*0.5;
				if( xn < 0.0 ) -theta;
			} else
				theta = Math.atan2(xn,yn);
		}

		var alon = theta/sn + olon;
		rs['lat'] = alat*RADDEG;
		rs['lng'] = alon*RADDEG;
	}

	return rs;
}

/**
 * @brief 앱실행 호출
 * @param urlScheme
 * @param packageName
 * <pre>
 * android : packageName 을 넘김
 * iPhone : urlScheme 을 넘김
 * </pre>
 */
function goApp(urlScheme, packageName) {
	var mobileKeyWords = new Array('iPhone', 'Android');

	for (var word in mobileKeyWords) {
	    if (navigator.userAgent.match(mobileKeyWords[word]) != null && navigator.userAgent.match(mobileKeyWords[word]) == 'iPhone') {
			location.href = urlScheme + packageName; // 아이폰은 설치 안되어 있을시 id 값이 필요
			break;
	    } else if (navigator.userAgent.match(mobileKeyWords[word]) != null && navigator.userAgent.match(mobileKeyWords[word]) == 'Android') {
	    	location.href = 'applink://' + packageName;
			break;
	    }
	}
}

function goAppReady(androidUrlScheme, packageName, iPhoneUrlScheme, appId){
	var mobileKeyWords = new Array('iPhone', 'Android');

	for (var word in mobileKeyWords) {
	    if (navigator.userAgent.match(mobileKeyWords[word]) != null && navigator.userAgent.match(mobileKeyWords[word]) == 'iPhone') {
	    	goApp(iPhoneUrlScheme, appId);
			break;
	    } else if (navigator.userAgent.match(mobileKeyWords[word]) != null && navigator.userAgent.match(mobileKeyWords[word]) == 'Android') {
	    	goApp(androidUrlScheme, packageName);
			break;
	    }
	}
}

/**
 * @brief Aes Encrypt 암호화하여 해당 태그에 저장
 * @param targetElementLat
 * @param targetElementLon
 */
function aesEncrypt(targetElementLat, targetElementLon){
	// 암호화 키값 설정
	initCryptoJS();

	$(targetElementLat).val(CryptoJS.AES.encrypt($(targetElementLat).val(), key, {iv: iv}).ciphertext);
	$(targetElementLon).val(CryptoJS.AES.encrypt($(targetElementLon).val(), key, {iv: iv}).ciphertext);
}

/**
 * @brief Aes Encrypt 암호화하기
 * @param value
 * @returns
 */
function aesEncryptToValue(value) {
	// 암호화 키값 설정
	initCryptoJS();

	// 문자열 형변환
	if (typeof value != 'string') {
		value = value.toString();
	}

	// 암호화
	//value = CryptoJS.AES.encrypt(value, key, {iv: iv}).ciphertext;
	//박미영 임시
	value = CryptoJS.AES.encrypt(value, getKeyCryptoJS(), { iv: getIvCryptoJS() }).ciphertext;
	
	return value.toString();
}

/**
 * @brief Aes Encrypt 암호화 하기(json)
 * @param value
 * @returns
 */
function aesEncryptToJson(value) {
	// 암호화 키값 설정
	initCryptoJS();

	// 문자열 형변환
	if (typeof value != 'string') {
		value = value.toString();
	}

	// 암호화
	value = CryptoJS.AES.encrypt(value, "Secret Passphrase", { format: JsonFormatter });
	return value.toString();
}

/**
 * @brief Aes Encrypt 암호화 풀기(json)
 * @param value
 * @returns
 */
function aesDecryptToJson(value) {
	var pos = value.indexOf("ct");
	if(pos > -1) {
		// 암호화 됨.

		// 암호화 키값 설정
		initCryptoJS();

		var decrypted = CryptoJS.AES.decrypt(value, "Secret Passphrase", { format: JsonFormatter });
		return decrypted.toString(CryptoJS.enc.Utf8);
	} else {
		// 암호화 되지 않음.
		return value;
	}
}

/**
 * 폰트 사이즈를 조절한다.(리스트 화면에서 확대축소 버튼을 이용할 경우)
 * @param targetArea
 * @param includeTag
 * @param plus
 */
var thisPageFirstFontSize = 0;;
var thisPageSizeStep = 0;
function chgFontSizeNew(targetArea, includeTag, plus, sizeStep) {
	var doYn = false;
	var step = sizeStep||1;

	if( thisPageFirstFontSize == 0 ) {
		thisPageFirstFontSize = parseInt($(targetArea).css("font-size"), 13);
	}

	if(targetArea && includeTag && includeTag.length > 0 ) {
		if(plus) {
			if(thisPageSizeStep < 15) {
				doYn = true;
				thisPageFirstFontSize += step;
			}
		}
		else {
			if(thisPageSizeStep > 0) {
				doYn = true;
				thisPageFirstFontSize += (-1*step);
			}
		}

		if(doYn) {
			thisPageSizeStep += (plus?1:-1);

			for(var a = 0 ; a < includeTag.length ; a++) {
				$(targetArea).find(includeTag[a]).each(function(idx, obj) {
					$(obj).css({
						"font-size" : thisPageFirstFontSize + "px" ,
						"line-height" : "1.5"
					});

					/*if($(obj).prop("tagName").toUpperCase() == "BUTTON") {
						$(obj).css({
							"height" : (thisPageFirstFontSize+2) + "px"
						});
					}*/
				});
			}
		}
	}
}

/**
 * 폰트 사이즈를 4단계로 조절한다.(리스트 화면에서 확대축소 버튼을 이용할 경우)
 * @param targetArea
 * @param includeTag
 * @param plus
 */
function chgFontSizeV2(targetArea, includeTag, plus, sizeStep) {
	var doYn = false;
	var step = sizeStep||1;

	if( thisPageFirstFontSize == 0 ) {
		thisPageFirstFontSize = parseInt($(targetArea).css("font-size"), 15);
	}

	if(targetArea && includeTag && includeTag.length > 0 ) {
		if(plus==0) {

				doYn = true;
				thisPageFirstFontSize =15;

		}
		else if(plus==1) {

			doYn = true;
			thisPageFirstFontSize  = 16;

		}else if(plus==2) {

			doYn = true;
			thisPageFirstFontSize = 17;

		}else if(plus==3) {

			doYn = true;
			thisPageFirstFontSize = 18;

		}

		if(doYn) {
			thisPageSizeStep += (plus?1:-1);

			for(var a = 0 ; a < includeTag.length ; a++) {
				$(targetArea).find(includeTag[a]).each(function(idx, obj) {
					$(obj).css({
						"font-size" : thisPageFirstFontSize + "px" ,
						"line-height" : "1.5"
					});

					/*if($(obj).prop("tagName").toUpperCase() == "BUTTON") {
						$(obj).css({
							"height" : (thisPageFirstFontSize+2) + "px"
						});
					}*/
				});
			}
		}
	}
}





function setTypeHeadInBtn(pageName) {

	  // h1 태그 선택
	  var h1Tag = document.querySelector('.setTypehead h1');

	  // 새로운 태그 생성
	  var newTag = document.createElement('div');
	  newTag.className = 'text';
	  newTag.innerHTML = '<button type="button" onclick="fontSetting(\''+pageName+'\')"><img src="../images/common/bt_text_01.gif" alt="글씨 조절"/></button>';

	  // h1 태그 뒤에 새로운 태그 추가
	  h1Tag.insertAdjacentElement('afterend', newTag);
}

function fontSetting(pageName) {
	var temp ='<div class="text" style="display:flex; justify-content:center; align-items:center;">'+
			'<button type="button" onclick="large(\''+pageName+'\')">'+
				'<img src="../images/common/bt_text_01.gif" alt="글씨 작게" />'+
	    	'</button>'+
	    	'<button type="button" onclick="large1(\''+pageName+'\')">'+
				'<img src="../images/common/bt_text_02.gif" alt="글씨 작게" />'+
	    	'</button>'+
	    	'<button type="button" onclick="large2(\''+pageName+'\')">'+
				'<img src="../images/common/bt_text_03.gif" alt="글씨 크게" />'+
	    	'</button>'+
	    	'<button type="button" onclick="large3(\''+pageName+'\')">'+
				'<img src="../images/common/bt_text_04.gif" alt="글씨 크게" />'+
			'</button>'+
		'</div>';

	jAlert(temp,"글자크기 설정");
	var jPosition = document.getElementById("popup_container");
	jPosition.style.top ="50px";
	jPosition.style.right ="5px";
	jPosition.style.left ="";
	jPosition.style.minWidth ="250px";
	jPosition.style.maxWidth ="250px";
	jPosition.style.minHeight ="100px";
	jPosition.style.maxHeight ="100px";


    //1.패널 삭제하기
    $("#popup_panel").remove();
    //2. 이미지 태그로 변경하여 생성다시하기
    $("#popup_message").after('<div id="popup_panel"><img id="popup_ok" style="width:30px; height:30px; background-color:transparent; box-shadow:none; position:absolute; top:0%; right:0%;" src="../images/common/cancel_font.png" /></div>');

    $("#popup_ok").click( function() {
        $.alerts._hide();
  	});

  	$("#popup_title").css('line-height','1.85rem');


}

function large(pageName) {
	if(pageName =="showBreakingDetail"){
		console.log(pageName);
		chgFontSizeV2("div.viewSt01", ["h2", "h1", "span"],0, 1);
	}else if (pageName=="normal"){
		console.log(pageName);
		chgFontSizeV2("div.lineBox", [ "li", "div", "strong.water", "span" ],0, 1);
	}else if(pageName =="facilityDetail"){
		chgFontSizeV2("div.tableSt01", ["li", "div", "a", "strong", "p"],0, 1);
	}


}
function large1(pageName) {
	if(pageName =="showBreakingDetail"){
		console.log(pageName);
		chgFontSizeV2("div.viewSt01", ["h2", "h1", "span"],1, 1);
	}else if (pageName== "normal"){
		console.log(pageName);
		chgFontSizeV2("div.lineBox", [ "li", "div", "strong.water", "span" ],1, 1);
	}else if(pageName =="facilityDetail"){
		chgFontSizeV2("div.tableSt01", ["li", "div", "a", "strong", "p"],1, 1);
	}

}
function large2(pageName) {
	if(pageName =="showBreakingDetail"){
		console.log(pageName);
		chgFontSizeV2("div.viewSt01", ["h2", "h1", "span"],2, 1);
	}else if (pageName== "normal"){
		chgFontSizeV2("div.lineBox", [ "li", "div", "strong.water", "span" ],2, 1);
	}else if(pageName =="facilityDetail"){
		chgFontSizeV2("div.tableSt01", ["li", "div", "a", "strong", "p"],2, 1);
	}

}
function large3(pageName) {
	if(pageName =="showBreakingDetail"){
		console.log(pageName);
	chgFontSizeV2("div.viewSt01", ["h2", "h1", "span"],3, 1);
	}else if (pageName== "normal"){
		chgFontSizeV2("div.lineBox", [ "li", "div", "strong.water", "span" ],3, 1);
	}else if(pageName =="facilityDetail"){
		chgFontSizeV2("div.tableSt01", ["li", "div", "a", "strong", "p"],3, 1);
	}


}





// 환경설정에 따른 폰트 사이즈 조절
function chgMTextSize(targetArea, includeTag) {

	var mTxtSize = 0;
	mTxtSize = getMobileNativeTextSize();

	if (mTxtSize == 1) {
		SetMTextSize(targetArea, includeTag, true, 20);
	} else if (mTxtSize == 2) {
		SetMTextSize(targetArea, includeTag, true, 28);
	}

}

//안드로이드 ios 설정 폰트 사이즈
function getMobileNativeTextSize(){
	var mTxtSize = 0;
	try {
		  mTxtSize = runNative.getTextSize(); // Android
	} catch ( e ) {
		if (getCookie("fontSizeType") != null && getCookie("fontSizeType") != '') {
			mTxtSize = getCookie("fontSizeType");
		}
		$("#fonttest").html("/"+getCookie("fontSizeType"));
		//mTxtSize = "jscall://getTextSize";
		//$("#fonttest").html("|"+mTxtSize);
	}
	return mTxtSize;
	
}
//환경설정에 따른 폰트 사이즈 조절
function chgMTextSizeER(targetArea, includeTag) {

	var mTxtSize = 0;
	try {
		  mTxtSize = runNative.getTextSize(); // Android
  	} catch ( e ) {
  		try {
  			if (getCookie("fontSizeTypeER") != null && getCookie("fontSizeTypeER") != '') {
  				mTxtSize = getCookie("fontSizeTypeER");
  			}
  			$("#fonttest").html("/"+getCookie("fontSizeTypeER"));
  			//mTxtSize = "jscall://getTextSize";
  			//$("#fonttest").html("|"+mTxtSize);
    	} catch ( e ) {
    		console.log("font size change error! - ER");
    		//$("#fonttest").html(".");
    	}
  	}

	if (mTxtSize == 1) {
		SetMTextSize(targetArea, includeTag, true, 20);
	} else if (mTxtSize == 2) {
		SetMTextSize(targetArea, includeTag, true, 28);
	}

}

function SetMTextSize(targetArea, includeTag, plus, mFontSize) {

	var defaultFontSize = 13;
	thisPageFirstFontSize = mFontSize;

	if(targetArea && includeTag && includeTag.length > 0 ) {

		for(var a = 0 ; a < includeTag.length ; a++) {
			$(targetArea).find(includeTag[a]).each(function(idx, obj) {

				var className = $(obj).attr('class');
				//console.log(obj+":::"+className);
				if (className != null && className != "undefined" &&
						className.indexOf('noFontSize') >= 0) {
					console.log("...");
				} else {
					$(obj).css({
						"font-size" : thisPageFirstFontSize + "px" ,
						"line-height" : "1.5"
					});
				}

				/*if($(obj).prop("tagName").toUpperCase() == "BUTTON") {
					$(obj).css({
						"height" : (thisPageFirstFontSize+2) + "px"
					});
				}*/
			});
		}
	}
}

//ios 10이상 버전용  2017.08.16
function setIosFontSizeToCookie(mFontSize) {

	alert(mFontSize);
	/*var latByEncryptToJson = '';
	var lonByEncryptToJson = '';

	// 쿠키에 저장된 값은 json값으로 저장되게 한다.
	latByEncryptToJson = aesEncryptToJson(latitude);
	lonByEncryptToJson = aesEncryptToJson(longitude);

	// 위경도 값을 가져올 시 쿠키에 저장한다 (암호화된값)
	setCookie('cookieLan', latByEncryptToJson, 10 * 60 * 1000); // 10분 (600000)
	setCookie('cookieLon', lonByEncryptToJson, 10 * 60 * 1000); // 10분
	setCookie('appversion', appversion, 10 * 60 * 1000);*/


}

function goSafeGuidePage(no) {
	location.href='/safety_guide/safeGuide/showList_'+no+'.html';
}


/**
 * 23.07.26 박미영
 * 네이버 지도, 카카오지도 IOS 버전 확인
*/
function iOSversion() {
	if (/iP(hone|od|ad)/.test(navigator.platform)) {
		// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
		var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
		return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
	}
	return -1;
}
/**
 * 23.08.03 박미영
 * 널 체크 기존 함수 - 공통
*/
function fIsNullChk(val) {
	if (val == null || val == '' || val == undefined) {
		val = '0';
	}
	return val;
}

//-->
