
function setIncludeHTML() {
	var includeList = document.querySelectorAll("[data-include]");
	for (i = 0; i < includeList.length; i++) {
		(function (i) {
			var el = includeList.item(i);
			var url;
			if(el.dataset) {
				url = el.dataset.include;
			} else {
				url = el.getAttribute("data-include");
			}
			
			$("#" + el.id).load(url);
		})(i);
	}
}
//Rn : 도로명주소 조회
function readJSONFile(fileName, arcd, Rn) {
	fileReader = new XMLHttpRequest();
	
	if(!isNull(arcd)) {
		if(fileName.indexOf("lecintroFl") == -1) {
			fileName = fileName + "/" + fileName + "_" + arcd;
		} else {
			fileName = "lecintro/lecintro.jsonFlList_" + arcd;
		}
	} else if(fileName.indexOf("/arcd") == -1) {
		fileName = fileName + "/" + fileName;
	}
	
	fileReader.onreadystatechange = function() {
		if (fileReader.readyState == "4" && fileReader.status == "200") {
			var properties = JSON.parse(fileReader.responseText);
			
			if(fileName.indexOf("sido") != -1) {								// 시도 목록 호출 시
				setArcd1Select_callBack(properties);
				if(Rn=='Y'){setArcdRn1Select_callBack(properties);}
					
			} else if(fileName.indexOf("sgg") != -1) {							// 시군구 목록 호출 시
				if(Rn=='Y'){
					if(document.getElementById("sbRnArea2").value != "5690000")	
						setArcdRn2Select_callBack(properties);
						}
				if(isNull(Rn)){
					if(document.getElementById("sbLawArea2").value != "5690000") {
					setArcd2Select_callBack(properties);
				} else {														// 세종시 내의 읍면동 목록 호출 시
					setArcd3Select_callBack(properties);
				}
				}
			} else if(fileName.indexOf("emd") != -1) {							// 읍면동 목록 호출 시
				setArcd3Select_callBack(properties);
			} else if(fileName.indexOf("lecintro_") != -1) {					// 민방위 교육 개요 호출 시
				jdata = properties;
				
				setHTML();
			} else if(fileName.indexOf("main") != -1) {							// 메인 컨텐츠 호출 시
				setHTMLList(properties);
			} else {															// 시설물, 연락처, 재난소식 목록 호출 시
				jdata = properties;
				
				pageIndex = 1;
				pageSize = parseInt(jdata.length / 10) + 1;
				if(jdata.length != 0 && parseInt(jdata.length % 10) == 0) {
					pageSize -= 1;
				}
				
				// JSON 객체 화면 세팅
				setHTMLList();
			}
		}
	};

	// 현재 날짜와 시간을 가져오기
	var now = new Date();

	// 년, 월, 일, 시, 분, 초 정보 가져오기
	var year = now.getFullYear();
	var month = (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1);
	var day = (now.getDate() < 10 ? '0' : '') + now.getDate();
	var hours = (now.getHours() < 10 ? '0' : '') + now.getHours();
	var minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
	var seconds = (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();

	// 'YYYYMMDDHHMMSS' 형태로 날짜 및 시간 문자열 만들기
	var formattedDateTime = year + month + day + hours + minutes + seconds;

	fileReader.open('GET', encodeURI("/idsiSFK/neo/ext/json/" + fileName + ".json?datetime="+formattedDateTime), true);
	fileReader.send(null);
}
//급수시설
function waterListRn(){ 
	var jdata1;
	var promise = jQuery.ajax({
           url:"/idsiSFK/sfk/ca/cac/are2/waterList.do",
           type:"POST",
           dataType:"json",
           data:{'rnCd' :$("#rdn_code").val(), 'rn': $("#rn").val(),'type':"1"},
           async:false
     });
	promise.done(successFunction);
	promise.fail(failFunction);
}

//대피시설
function evaListRn(){ 
	var jdata1;
	var promise = jQuery.ajax({
           url:"/idsiSFK/sfk/ca/cac/are2/waterList.do",
           type:"POST",
           dataType:"json",
           data:{'rnCd' :$("#rdn_code").val(), 'rn': $("#rn").val(), 'type':"2"},
           async:false
     });
	promise.done(successFunction);
	promise.fail(failFunction);
}

function successFunction(jdataRn,textStatus){
 	/* console.log(jdataRn.List);
 	console.log(jdataRn.List[0]);
	jdata1=jdataRn;*/
 	jdata=jdataRn.List;//사용
 	/*jdataRn=jdataRn;
 	console.log("a"+jdataRn);
 	jdata1=jdataRn.List;
 	console.log(jdata);*/
	pageIndex = 1;
	pageSize = parseInt(jdata.length / 10) + 1;
	if(jdata.length != 0 && parseInt(jdata.length % 10) == 0) {
		pageSize -= 1;
	}
 	setHTMLList();
	
    }
 function failFunction(request,status,error){
     alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    }
function prevPage() {
	if(pageIndex != 1){
		pageIndex -= 1;
		document.getElementById("tbpageindex").innerHTML = pageIndex;
		setHTMLList();
	}
}

function nextPage() {
	if(pageIndex < pageSize){
		pageIndex += 1;
		document.getElementById("tbpageindex").innerHTML = pageIndex;
		setHTMLList();
	}
}

function pageGo() {
	var i = document.getElementById("iptpageinput").value;
	
	if(i <= pageSize && i > 0){
		pageIndex = i;
		document.getElementById("tbpageindex").innerHTML = pageIndex;
		setHTMLList();
	}
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function isNull(comp) {
	if(comp == "" || comp == undefined || comp == null)
		return true;
	else
		return false;
}