var idsi_com_js = {};
var CommonUtil = {};
var DateUtil = {};

/*
var webSquareHome = location.pathname + "?w2xPath=/"
		+ (location.pathname).substring(1, (location.pathname).indexOf("/", 1))
		+ "/wq";
*/

var NeoSafeKoreaHome = (location.pathname).substring(0, (location.pathname).indexOf("/", 1))+"/"; 
var isSkipAreaCodeHandleChange = false;
/*
function setLoginMessage() {
	var strloginMsg = "";
	if (SessionUtil.isLogined()) {
		strloginMsg = SessionUtil.getSession().name + "님";
	}
	lnbLoginInfo.setValue(strloginMsg);
}
function fn_logout() {
	var sessionId = SessionUtil.getSession().sessionId;
	if (CommonUtil.nvl(sessionId, "N") == "N") {
		CommonUtil.forwardUrl("/template/login.xml");
	}
	if (CommonUtil.nvl(sessionId, "N") != "N") {
		$w.executeSubmission("getSelectLogoutInfo");
		return false;
	}
}
*/
CommonUtil.encrypt = function(str) {
	if (str == undefined || str == null || str == '') {
		return str;
	}
//	return encodeURIComponent(WebSquare.text.BASE64Encoder(str));
	return str;
};
CommonUtil.nvl = function(value, rep) {
	if (CommonUtil.isNull(value)) {
		return rep;
	} else {
		return value;
	}
};

CommonUtil.isNull = function(value) {
	if (value == undefined) {
		return true;
	} else {
		if (typeof value == "boolean" && value == false) {
			return false;
		} else if (typeof value == "number" && value == 0) {
			return false;
		} else if (value == null || value == "") {
			return true;
		} else {
			return false;
		}
	}
};
CommonUtil.errorCommonCheck = function(res) {
	if (!CommonUtil.isNull(res)) {
		if (!CommonUtil.isNull(res.rtnResult)) {
			if (!CommonUtil.isNull(res.rtnResult.resultCode)) {
				try {
					if (res.rtnResult.resultCode < 0) {
						if (res.rtnResult.resultCode == -999) {
							SessionUtil.removeSession();
							console.log(res.rtnResult.resultMsg
									+ "\n초기화면으로 이동합니다.");
							top.location.replace("/"
									+ CommonUtil.getContextName() + "/");
						} else {
							alert("오류 : " + res.rtnResult.resultMsg);
						}
						return true;
					}
				} catch (err) {
					alert("common err : " + err.message);
				}
			}
		}
	}
	console.log(">>> CommonUtil.errorCommonCheck");
	return false;
}
CommonUtil.errorCheck = function(dm_resultMap, strType, bIgnoreLoginCheck,
		bSuccessMessage) {
	if (CommonUtil.isNull(strType)) {
		strType = "DATAMAP";
	}
	var jsonResult = {};
	if (strType == "DATAMAP") {
		jsonResult = dm_resultMap.getJSON();
	} else if (strType == "JSON") {
		jsonResult = dm_resultMap;
	} else {
		console.log("CommonUtil.errorCheck parameter strType invalid('"
				+ strType + "')");
	}
	console.log("[result][" + jsonResult.resultCode + "]-"
			+ jsonResult.resultMsg);
	if (jsonResult.resultCode < 0) {
		if (jsonResult.resultCode == -999) {
			if (bIgnoreLoginCheck == undefined || bIgnoreLoginCheck == null
					|| bIgnoreLoginCheck == false) {
				SessionUtil.removeSession();
				alert(jsonResult.resultMsg + "\n초기화면으로 이동합니다.");
				top.location.replace("/" + CommonUtil.getContextName() + "/");
			}
		} else {
			alert("오류 : " + jsonResult.resultMsg);
		}
		return false;
	} else {
		if (!CommonUtil.isNull(bSuccessMessage) && bSuccessMessage == true) {
			alert(jsonResult.resultMsg);
		}
	}
	return true;
};
CommonUtil.ajaxErrorCheck = function(resultAll, title, bIgnoreLoginCheck) {
	try {
		if (resultAll.toString() == "[object XMLDocument]" && CommonUtil.isNull(JSON.parse(WebSquare.json.XML2JSONString(resultAll)))) {
			alert(title + "에서 오류가 발생하였습니다.");
			return false;
		}
	} 
	catch (e) {
		console.log(e);
	}
	
	if (CommonUtil.errorCheck(resultAll.rtnResult, "JSON", bIgnoreLoginCheck) == false) {
		console.log(title + "에서 오류가 발생하였습니다.\n" + resultAll.rtnResult.resultMsg);
		return false;
	}
	return true;
};
CommonUtil.getContextName = function() {
	var path = location.pathname;
	return path.substring(1, path.indexOf("/", 1));
};
/*
CommonUtil.getParameter = function(param, bEncoding, bUseSession) {
	if (CommonUtil.isNull(bUseSession) || bUseSession == false) {
		if (CommonUtil.isNull(bEncoding) || bEncoding == true) {
			return WebSquare.net.getBASE64Parameter(param);
		} else {
			return WebSquare.net.getParameter(param);
		}
	} else {
		var jsonParam = JSON.parse(sessionStorage.getItem("idsiPageParam"));
		return eval("jsonParam." + param);
	}
};
*/

//CommonUtil.getParameters = function(bEncoding, bUseSession) {
CommonUtil.getParameters = function(bUseSession) {
	if (CommonUtil.isNull(bUseSession) || bUseSession == false) {
		/*
		var param;
		if (CommonUtil.isNull(bEncoding) || bEncoding == true) {
			param = WebSquare.net.getAllBASE64Parameter();
		} else {
			param = WebSquare.net.getAllParameter();
		}
		return param;
		*/
		
		var paramObj = {};
		var url = location.href;
		// get 파라미터 값을 가져올 수 있는 ? 를 기점으로 slice 한 후 split 으로 나눔
	    var paramArr = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

	    // 나누어진 값의 비교를 통해 paramName 으로 요청된 데이터의 값만 return
	    for (var i = 0; i < paramArr.length; i++) {
	        var paramNm = paramArr[i].split('=')[0];
	        var paramVl = paramArr[i].split('=')[1];
	        paramObj[paramNm] = paramVl
	    }
	    return paramObj;
	} 
	else {
		return JSON.parse(sessionStorage.getItem("idsiPageParam"));
	}
};

CommonUtil.forwardUrl = function(url, target, param, bUseSession) {
	sessionStorage.setItem("idsiPageParam", JSON.stringify(param));

	if(target){
		try {
			if (param) {
				try {
					for (var key in param) {
						target.setUserData(key, param[key]);
					}
				} 
				catch (e) {
					console.log("파라메터 세팅중 오류가 발생하였습니다.");
				}
			}
			target.setSrc(url);
		} 
		catch (e) {
			console.log("화면 이동중 오류가 발생하였습니다.");
		}
	}
	else {
		if (bUseSession) {
			sessionStorage.setItem("idsiPageParam", JSON.stringify(param));
		} 
		else {
			var orgParam = "";
			if (url.indexOf(".jsp?") > -1) {
				url += CommonUtil.makeParamString(param);
			}
			else url += "?" + CommonUtil.makeParamString(param);
		}
		document.location.href = url;
	}
};

CommonUtil.makeParamString = function(param) {
	var paramString = "";
	try {
		var paramData = "";
		for(var key in param) {
			paramData = param[key] ? "" + param[key] : "";
			if (paramString != "") paramString += "&";
			paramString += key + "=" + paramData;
		}
	} 
	catch (e) {
		console.log("파라메터 세팅중 오류가 발생하였습니다.");
	}
	return paramString;
};

CommonUtil.createWindow = function(screenTitle, url, param, bEncoding, bUseSession) {
	if (!CommonUtil.isNull(param)) {
		if (url.indexOf(".jsp") > 0) {
			if (bUseSession == undefined || bUseSession == null || bUseSession == false) {
				if (bEncoding == undefined || bEncoding == null || bEncoding == true) {
					if (url.indexOf(".jsp?") > -1) {
						var arrUrl = url.split(".jsp?");
						var arrParams = arrUrl[1].split("&");
						for (var i = 0; i < arrParams.length; i++) {
							var arrParam = arrParams[i].split("=");
							arrParam[1] = CommonUtil.encrypt(arrParam[1]);
							arrParams[i] = arrParam.join("=");
						}
						arrUrl[1] = arrParams.join("&");
						url = arrUrl.join(".jsp?");
					}
				}
				url = url + (url.indexOf("?") > -1 ? "&" : "?") + CommonUtil.makeParamString(param, bEncoding);
			}
			else {
				sessionStorage.setItem("idsiPageParam", JSON.stringify(param));
			}
		}
	}
	wc_mdi.createWindow(screenTitle, null, url);
};

CommonUtil.downloadFile = function(fileName, localSaveFileName) {
	var pageUrl = "/" + CommonUtil.getContextName() + "/idsiWebsquareDownload.do?fileName=" + encodeURI(fileName) + "&localSaveFileName=" + encodeURI(localSaveFileName);
	var frmIframe = CommonUtil.createFrame("__IDSI_FILE_DOWN__");
	frmIframe.location.href = pageUrl;
};

CommonUtil.downloadSfkFile = function(fileName, localSaveFileName) {
	var pageUrl = "/" + CommonUtil.getContextName() + "/idsiSfkWebsquareDownload.do?fileName=" + encodeURI(fileName) + "&localSaveFileName=" + encodeURI(localSaveFileName);
	var frmIframe = CommonUtil.createFrame("__IDSI_FILE_DOWN__");
	frmIframe.location.href = pageUrl;
};

CommonUtil.downloadFileBbs = function (fileName, localSaveFileName, bbs) {
	var pageUrl = "/" + CommonUtil.getContextName() + "/idsiSfk"+bbs+"WebsquareDownload.do?fileName=" + encodeURI(fileName) + "&localSaveFileName=" + encodeURI(localSaveFileName);
	var frmIframe = CommonUtil.createFrame("__IDSI_FILE_DOWN__");
	frmIframe.location.href = pageUrl;
};

CommonUtil.downloadSfkBbsFile = function(fileName, localSaveFileName) {
	var pageUrl = "/" + CommonUtil.getContextName() + "/idsiSfkBBSWebsquareDownload.do?fileName=" + encodeURI(fileName) + "&localSaveFileName=" + encodeURI(localSaveFileName);
	var frmIframe = CommonUtil.createFrame("__IDSI_FILE_DOWN__");
	frmIframe.location.href = pageUrl;
};



/*
CommonUtil.previewFileName = function(fileName, bWebsquarePreview) {
	if (bWebsquarePreview == undefined || bWebsquarePreview == null
			|| bWebsquarePreview == true) {
		return "/" + CommonUtil.getContextName()
				+ "/idsiWebsquarePreview.do?fileName=" + encodeURI(fileName);
	} else {
		return "/" + CommonUtil.getContextName() + "/idsiPreview.do?fileName="
				+ encodeURI(fileName);
	}
};
CommonUtil.uploadXmlToJSON = function(retXml) {
	var rtnJSON = {
		"key" : WebSquare.xml.getValue(retXml, "ret/key"),
		"storedFileList" : WebSquare.xml.getValue(retXml, "ret/storedFileList"),
		"localfileList" : WebSquare.xml.getValue(retXml, "ret/localfileList"),
		"fileSizeList" : WebSquare.xml.getValue(retXml, "ret/fileSizeList"),
		"maxUploadSize" : WebSquare.xml.getValue(retXml, "ret/maxUploadSize"),
		"deniedList" : WebSquare.xml.getValue(retXml, "ret/deniedList"),
		"deniedCodeList" : WebSquare.xml.getValue(retXml, "ret/deniedCodeList")
	};
	return rtnJSON;
};
CommonUtil.executeReport = function(reportMode, submissionId, path, bcqre) {
	if (CommonUtil.isNull(submissionId)) {
		console.log("AI Report 호출 submission이 지정되지 않았습니다.");
		return;
	}
	if (",HTML,HWP,PDF,EXCEL,".indexOf("," + reportMode + ",") == -1) {
		console.log("AI Report 호출 타입이 지정되지 않았습니다.");
		return;
	}
	if (CommonUtil.isNull(path)) {
		console.log("AI Report 호출 URL이 지정되지 않았습니다.");
		return;
	}
	var ref = $w.getSubmission(submissionId).ref;
	ref = ref.substring(ref.indexOf(",") + 1, ref.length);
	if (ref.substring(0, 1) == "{") {
		ref = "[" + ref + "]";
	}
	var jsonReq = $w.data.get("JSON", ref);
	jsonReq = JSON.stringify(jsonReq);
	$('head').append(
			'<script src="/' + CommonUtil.getContextName()
					+ '/aireport/support/js/commonCall-1.0.01.js"></script>');
	bcqre = bcqre == null ? false : bcqre;
	var aiReportUrl = "/" + CommonUtil.getContextName() + "/ar" + path;
	if (bcqre) {
		aireportCommObj.installURI = "/" + CommonUtil.getContextName()
				+ "/aireport";
		aireportCommObj.viewMode = bcqreObj.name;
		aireportCommObj.reportUrl = aiReportUrl;
		aireportCommObj.reqParams['aiParam'] = jsonReq;
		bcqreObj.url = "http://27.101.211.65/idsiAPF/invoker_WEBSK.jsp";
		reportCall();
	} else {
		window.open(aiReportUrl + "?reportMode=" + reportMode + "&aiParam="
				+ jsonReq);
	}
};
*/

CommonUtil.executeReportPost = function(reportMode, submissionId, path, reportParam, bcqre) {
	if (CommonUtil.isNull(submissionId)) {
		console.log("AI Report 호출 submission이 지정되지 않았습니다.");
		return;
	}
	if (",HTML,HWP,PDF,EXCEL,".indexOf("," + reportMode + ",") == -1) {
		console.log("AI Report 호출 타입이 지정되지 않았습니다.");
		return;
	}
	if (CommonUtil.isNull(path)) {
		console.log("AI Report 호출 URL이 지정되지 않았습니다.");
		return;
	}
	var ref = '';
	var jsonReq = {};
	if (submissionId != 'none') {
		ref = window[submissionId].ref;

		jsonReq[ref.key] = window[ref.id].getJSON();

		jsonReq = JSON.stringify(jsonReq);
		reportParam['aiParam'] = jsonReq;
	}

	$('head').append('<script src="/' + CommonUtil.getContextName() + '/aireport/support/js/commonCall-1.0.01.js"></script>');
	var aiReportUrl = "/" + CommonUtil.getContextName() + "/ar" + path;
	bcqre = (bcqre == null) ? false : bcqre;
	if (bcqre) {
		aireportCommObj.installURI = "/" + CommonUtil.getContextName() + "/aireport";
		aireportCommObj.viewMode   = bcqreObj.name;
		aireportCommObj.reportUrl  = aiReportUrl;
		for ( var key in reportParam) {
			aireportCommObj.reqParams[key] = reportParam[key];
		}
		bcqreObj.url = "http://27.101.211.65/idsiAPF/invoker_WEBSK.jsp";
		reportCall();
	} 
	else {
		reportParam['reportMode'] = reportMode;
		var reportParams = 'pdfEditable:true';
		if (reportParam['server'] != null && reportParam['server'] == 'true') {
			reportParams += ',' + reportMode.toLocaleLowerCase() + 'serversave:true';
			if (reportParam['savename'] != null) {
				reportParams += ',savename:' + reportParam['savename'];
			}
			reportParam['reportParams'] = reportParams;
			$.ajax({
				type : 'post',
				dataType : 'json',
				url : aiReportUrl,
				data : reportParam,
				success : function(data) {
					console.log('server save true');
				},
				error : function(e) {
				}
			});
			return;
		} 
		else if (reportMode != 'HTML') {
			if (reportParam['savename'] != null) {
				reportParams += ',savename:' + reportParam['savename'];
			}
			reportParam['reportParams'] = reportParams;
			var aiForm = document.createElement('form');
			aiForm.setAttribute('method', 'POST');
			aiForm.setAttribute('action', aiReportUrl);
			aiForm.setAttribute('id',     'aireportsave');
			for ( var key in reportParam) { 
				var input = document.createElement('input');
				input.setAttribute('type', 'hidden');
				input.setAttribute('name',  key);
				input.setAttribute('value', reportParam[key]);
				aiForm.appendChild(input);
			}
			document.body.appendChild(aiForm);
			aiForm.submit();
		} 
		else {
			var target = 'aireport_height';
			if (reportParam['popup'] != null && reportParam['popup'] != '') {
				if (reportParam['popup'] == 'width') {
					target = 'aireport_width';
				} 
				else {
					target = 'aireport_user';
				}
			}
			if (reportParam['savename'] != null) {
				reportParams += ',savename:' + reportParam['savename'];
			}
			reportParam['reportParams'] = reportParams;
			var aiForm = document.createElement('form');
			aiForm.setAttribute('method', 'POST');
			aiForm.setAttribute('action', aiReportUrl);
			aiForm.setAttribute('target', target);
			aiForm.setAttribute('id',     'aireport');
			for ( var key in reportParam) {
				var input = document.createElement('input');
				input.setAttribute('type', 'hidden');
				input.setAttribute('name', key);
				input.setAttribute('value', reportParam[key]);
				aiForm.appendChild(input);
			}
			document.body.appendChild(aiForm);
			if (target == 'aireport_height') {
				var popup1 = window.open('', 'aireport_height', 'width=860,height=900,top=0,left=0,toolbar=no,menubar=no,lacation=no,scrollbars=no,status=no');
				aiForm.submit();
				popup1.focus();
			} 
			else if (target == 'aireport_width') {
				var popup2 = window.open('', 'aireport_width', 'width=1200,height=900,top=0,left=0,toolbar=no,menubar=no,lacation=no,scrollbars=no,status=no');
				aiForm.submit();
				popup2.focus();
			} 
			else if (target == 'aireport_user') {
				var popup3 = window.open('', 'aireport_user', reportParam['popup'] + ',top=0,left=0,toolbar=no,menubar=no,lacation=no,scrollbars=no,status=no');
				aiForm.submit();
				popup3.focus();
			}
		}
		$('body form[id="aireport"]').remove();
	}
};

CommonUtil.excelDownload = function(submissionId, excelUrl) {
	if (CommonUtil.isNull(submissionId)) {
		console.log("excel download 호출 submission이 지정되지 않았습니다.");
		return;
	}
	if (CommonUtil.isNull(excelUrl)) {
		console.log("excel download 호출 URL이 지정되지 않았습니다.");
		return;
	}

	var paramObj = {};
	var ref = window[submissionId].ref;
	if(Array.isArray(ref)){
		for(var i=0; i<ref.length; i++){
			var param = ref[i];
			paramObj[param.key] = window[param.id].data;
		}
	}
	else {
		paramObj[ref.key] = window[ref.id].data;
	}
	
	CommonUtil.excelDownloadJson(paramObj, excelUrl);
};


CommonUtil.excelDownloadJson = function(jsonObj, excelUrl) {
	var excelDownloadUrl = "/" + CommonUtil.getContextName() + excelUrl;
	var frmIframe = CommonUtil.createFrame("__IDSI_EXCEL_DOWN__");
	var formObj = document.createElement("form");
	formObj.action = excelDownloadUrl;
	formObj.method = "post";
	formObj.innerHTML = "<input type='hidden' name='excelParam' value='"
			+ JSON.stringify(jsonObj) + "'/>";
	try {
		frmIframe.document.body.appendChild(formObj);
	} 
	catch (e) {
		console.log("err : " + e.message);
		frmIframe.document.open();
		frmIframe.document.close();
		frmIframe.document.body.appendChild(formObj);
	}
	formObj.submit();
};


CommonUtil.dataList2excel = function(fileNm, dataList, columnList){
	var formId   = dataList.id + "_excel_form";
	var iframeId = dataList.id + "";
	
	var dataJson = JSON.stringify(dataList.data);
	var colJson  = JSON.stringify(columnList);
	var fileNm   = encodeURI(fileNm);

	var html = '<form name="@_excel_form" id="@_excel_form" method="post" action="/idsiSFK/neoDataList2ExcelFile.do" target="@_excel_frame">'
		     + '<input name="column"   id="@_column"   type="hidden">'
			 + '<input name="data"     id="@_data"     type="hidden">'
		     + '<input name="filename" id="@_filename" type="hidden">'
	         + '</form>'
	         + '<iframe name="@_excel_frame" title="엑셀다운로드를 위한 임시 프레임" frameborder="0" scrolling="no" style="width: 0px; height: 0px; display:none"></iframe>';
	html = html.replaceAll("@", dataList.id);
	if($("body").find("#" + dataList.id + "_excel_form").length == 0) $("body").append(html);
	$("#" + dataList.id + "_column"  ).val(colJson);
	$("#" + dataList.id + "_data"    ).val(dataJson);
	$("#" + dataList.id + "_filename").val(fileNm);
	window[dataList.id + "_excel_form"].submit();
}

CommonUtil.setYearCode = function(rObj1, rObj2, fg, callId) {
	if (CommonUtil.isNull(rObj1)) {
		alert("시작년도를 입력하여 주십시요");
		return;
	}
	if (CommonUtil.isNull(rObj2)) {
		alert("종료년도를 입력하여 주십시요");
		return;
	}
	if (CommonUtil.isNull(fg)) {
		alert("Y 또는 N 값을 입력하여 주십시요");
		return;
	}
	if (CommonUtil.isNull(callId)) {
		alert("날짜적용할 콤보박스 아이디를 입력하여 주십시요");
		return;
	}
	var result = [];
	var vArr = [];
	if (fg === "Y") {
		if (isNaN(rObj1) && isNaN(rObj2)) {
			alert("년도선택시 숫자형 문자로 입력값을 주시기 바랍니다");
			return;
		} 
		if (rObj2 <= rObj1) {
			alert("년도선택시 앞자리 년도보다 뒷자리년도를 더 크게 설정해주시기 바랍니다");
			return;
		}

		var j = 0;
		var zz = Number(rObj1) - 1;
		for ( var i = Number(rObj1); i <= Number(rObj2) + 1; i++) {
			vArr.push(zz + j);
			j = j + 1;
		}
		for ( var jj = 0; jj < vArr.length; jj++) {
			result.push({
				'label' : vArr[jj],
				'value' : vArr[jj]
			});
		}
	} 
	else if (fg === 'N') {
		if (isNaN(rObj1) && isNaN(rObj2)) {
			alert("년도선택시 숫자형 문자로 입력값을 주시기 바랍니다");
			return;
		} 

		var j = 0;
		var a = Number(rObj1);
		a = a - Number(rObj2);
		for ( var i = a; i <= Number(rObj1); i++) {
			vArr.push(a + j);
			j = j + 1;
		}
		var k = 0;
		var b = Number(rObj1);
		for ( var i = b; i < b + Number(rObj2); i++) {
			k = k + 1;
			vArr.push(b + k);
		}
		
		for ( var jj = 0; jj < vArr.length; jj++) {
			result.push({
				'label' : vArr[jj],
				'value' : vArr[jj]
			});
		}
	} 
	else if (fg === "X") {
		if (isNaN(rObj1) && isNaN(rObj2)) {
			alert("년도선택시 숫자형 문자로 입력값을 주시기 바랍니다");
			return;
		} 
		if (rObj2 <= rObj1) {
			alert("년도선택시 앞자리 년도보다 뒷자리년도를 더 크게 설정해주시기 바랍니다");
			return;
		}

		var j = 0;
		for ( var i = Number(rObj1); i <= Number(rObj2) + 1; i++) {
			vArr.push(Number(rObj1) + j);
			j = j + 1;
		}
		vArr.reverse();

		for ( var jj = 0; jj < vArr.length; jj++) {
			result.push({
				'label' : vArr[jj],
				'value' : vArr[jj]
			});
		}
	}
//	var rid = eval(callId);
	var rid;
	
	if(typeof callId == "string") {
		rid = document.getElementById(callId);
	} else if(typeof callId == "object") {
		rid = callId;
	}
	
	var x = 0;
	if (fg === "Y") {
		rid.addItem("", "년도를 선택하세요", 0);
		for (x = 1; x < result.length; x++) {
			rid.addItem(result[x].label, result[x].value + "년", x);
		}
		rid.setSelectedIndex(0);
	} 
	else if (fg === "N") {
		for (x = 0; x < result.length; x++) {
			rid.addItem(result[x].label, result[x].value + "년", x);
		}
		rid.setSelectedIndex(0);
		//rid.setSelectedIndex(x * 1 / 2);
	} 
	else if (fg === "X") {
		rid.addItem("", "년도를 선택하세요", 0);
		for (x = 1; x < result.length; x++) {
			rid.addItem(result[x].label, result[x].value + "년", x);
		}
		rid.setSelectedIndex(0);
	}
};

/*
CommonUtil.setYearMonthCode = function(rObj1, rObj2, fg, callId) {
	if (CommonUtil.isNull(rObj1)) {
		alert("시작년도를 입력하여 주십시요");
		return;
	}
	if (CommonUtil.isNull(rObj2)) {
		alert("종료년도를 입력하여 주십시요");
		return;
	}
	if (CommonUtil.isNull(callId)) {
		alert("날짜적용할 콤보박스 아이디를 입력하여 주십시요");
		return;
	}
	var result = [];
	var vArr = [];
	if (isNaN(rObj1) && isNaN(rObj2)) {
		alert("년도선택시 숫자형 문자로 입력값을 주시기 바랍니다");
		return;
	} else {
		var j = 0;
		var a = Number(rObj1);
		for ( var i = a; i <= Number(rObj2); i++) {
			for ( var x = 1; x <= 12; x++) {
				if (x <= 9) {
					vArr.push(a + j + "0" + x);
				} else {
					vArr.push(a + j + "" + x);
				}
			}
			j = j + 1;
		}
	}
	for ( var jj = 0; jj < vArr.length; jj++) {
		result.push({
			'label' : vArr[jj],
			'value' : vArr[jj]
		});
	}
	var rid = eval(callId);
	var x = 0;
	rid.addItem("", "년월을 선택하세요", 0);
	for (x = 0; x < result.length; x++) {
		rid.addItem(result[x].label, result[x].value.substring(0, 4) + "년"
				+ " " + result[x].value.substring(4, 6) + "월", x + 1);
	}
	rid.setSelectedIndex(0);
};
CommonUtil.setTimeCode = function(callId, fg) {
	if (CommonUtil.isNull(callId)) {
		alert("시간선택 콤보박스 아이디를 입력하여 주십시요");
		return;
	}
	var rid = eval(callId);
	rid.addItem("", "시간을 선택하세요", 0);
	var x;
	if (fg == "Y") {
		for (x = 1; x <= 24; x++) {
			if (1 <= x && x <= 9) {
				rid.addItem("0" + x, "0" + x + "시", x);
			} else {
				rid.addItem("" + x, x + "시", x);
			}
		}
		rid.setSelectedIndex(0);
	} else if (fg == "N") {
		for (x = 0; x <= 23; x++) {
			if (0 <= x && x <= 9) {
				rid.addItem("0" + x, "0" + x + "시", x + 1);
			} else {
				rid.addItem("" + x, x + "시", x + 1);
			}
		}
		rid.setSelectedIndex(0);
	}
};
*/
CommonUtil.requestErrCallback = function(e) {
};

CommonUtil.ajaxSFKErrorCheck = function(resultAll, title, bIgnoreLoginCheck) {
	try {
		if (resultAll.toString() == "[object XMLDocument]" && CommonUtil.isNull(JSON.parse(WebSquare.json.XML2JSONString(resultAll)))) {
			alert(title + "에서 오류가 발생하였습니다.");
			return false
		}
	} 
	catch (e) {
		console.log(e);
	}
	if (CommonUtil.errorSFKCheck(resultAll.rtnResult, "JSON", bIgnoreLoginCheck) == false) {
		console.log(title + "에서 오류가 발생하였습니다.\n" + resultAll.rtnResult.resultMsg);
		return false
	}
	return true
};

CommonUtil.errorSFKCheck = function(dm_resultMap, strType, bIgnoreLoginCheck, bSuccessMessage) {
	if (CommonUtil.isNull(strType)) {
		strType = "DATAMAP"
	}
	var jsonResult = {};
	if (strType == "DATAMAP") {
		jsonResult = dm_resultMap.getJSON()
	} 
	else if (strType == "JSON") {
		jsonResult = dm_resultMap
	} 
	else {
		console.log("CommonUtil.errorCheck parameter strType invalid('" + strType + "')")
	}
	console.log("[result][" + jsonResult.resultCode + "]-" + jsonResult.resultMsg);
	if (jsonResult.resultCode < 0) {
		if (jsonResult.resultCode == -999) {
			if (bIgnoreLoginCheck == undefined || bIgnoreLoginCheck == null || bIgnoreLoginCheck == false) {
				SessionUtil.removeSession();
				alert(jsonResult.resultMsg + "\n초기화면으로 이동합니다.");
				top.location.replace("/" + CommonUtil.getContextName() + "/")
			}
		} 
		else {
			alert("오류 : " + jsonResult.resultMsg)
		}
		return false
	} 
	else {
		if (!CommonUtil.isNull(bSuccessMessage) && bSuccessMessage == true) {
			alert(jsonResult.resultMsg)
		}
	}
	return true
};

CommonUtil.ajaxRequest = function(reqAjaxOptions) {
	var pAction       = reqAjaxOptions.action        || '';
	var pAsync        = reqAjaxOptions.mode          == 'asynchronous';
	var mediatype     = reqAjaxOptions.mediatype     || 'application/xml';
	var pMethod        = (reqAjaxOptions.method       || 'post').toLowerCase();
	var processMsg    = reqAjaxOptions.processMsg    || '';
	var requestHeader = reqAjaxOptions.requestHeader || {};
	var reqData       = reqAjaxOptions.reqDoc;
	var callbackFnc   = reqAjaxOptions.callbackFnc   || '';
	/*
	if (reqData && ((typeof reqData == 'object' && typeof reqData.documentElement != 'undefined' && reqData.nodeType == 9) || 
			        (typeof reqData == 'object' && typeof reqData.documentElement == 'undefined' && reqData.nodeType == 1))) {
							reqData = WebSquare.xml.serialize(reqData);
							if(mediatype.indexOf("json") >= 0) {
								reqData = WebSquare.json.XML2JSONString(reqData);
							}
	} 
	else if (mediatype.indexOf("json") >= 0 && typeof reqData == 'object') {
		reqData = JSON.stringify(reqAjaxOptions.reqDoc);
	}
	*/
	reqData = JSON.stringify(reqAjaxOptions.reqDoc);

	var parser = new DOMParser();
	resBody = parser.parseFromString("<ret/>", "text/xml");
/*

        var request = $.ajax({
            url        : actionUrl 
          , type       : self.method
          , data       : paramStr
          , async      : (self.mode == "asynchronous")
          , dataType   : "json"
          , beforeSend : self.onBeforeSend
          , success    : self.onPreSubmitDone
	      , error      : window[self.onSubmitError]
	      , complete   : window[self.onComplete]
        });

 */
	$.ajax({
		url        : pAction,
		type       : pMethod,
		async      : pAsync,
		data       : reqData,
		dataType   : "json",
		beforeSend : function(xhr) {
		    xhr.setRequestHeader('Accept', "application/json");
		    xhr.setRequestHeader('content-Type', "application/json; charset=UTF-8");
		    //return self.onSubmit(xhr);
		},
		success : function(e) {
			if (mediatype == 'application/xml') {
				if (typeof e.responseBody != "undefined")
					resBody = parser.parseFromString(e.responseBody);
			} 
			else if (mediatype == 'application/json') {
				//resBody = e.responseJSON;
				resBody = e;
			} 
			else {
				resBody = e.responseText;
			}
			if (callbackFnc != '') {
//				eval(callbackFnc + '(resBody, e)');
				window[callbackFnc](resBody, e);
			}
		},
		error : function(e) {
			CommonUtil.requestErrCallback(e);
		}
	});
	return resBody;
};

CommonUtil.getCommonCodeList = function(rObj, callbackFnc) {
	var actionUrl = '';
	var result    = {};

	if (Object.prototype.toString.call(rObj) != '[object Array]') {
		console.log("Code는 잘못된 형식입니다.");
		return result;
	}
	
	if (rObj.length > 0) {
		var commonCode = rObj.join(",");
		actionUrl = "/" + CommonUtil.getContextName() + "/com/retrieveCmmnDetailCodeList.do";
		var searchInfo = {
			"cmmnCdIds" : commonCode
		};
		var reqAjaxOptions = {
			"action" : actionUrl,
			"mode"   : "synchronous",
			"reqDoc" : {
				"searchInfo" : searchInfo
			},
			"mediatype" : "application/json"
		};
		var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
		if (!CommonUtil.ajaxErrorCheck(resultAll, "공통코드 모듈")) {
			result = {};
			if (callbackFnc) {
//				eval(callbackFnc + '(result)');
				window[callbackFnc](result);
			}
			return result;
		}
		var sResult = resultAll.cmmnCodeList;
		var result = {};
		var codeList = [];

		for ( var i = 0; i < sResult.length; i++) {
			var cd = {
					      cdLevel          : sResult[i].cdLevel 
						, cmmnCdId         : sResult[i].cmmnCdId
						, refrnCdKeyValue  : sResult[i].refrnCdKeyValue
						, upperCmmnCdValue : sResult[i].upperCmmnCdValue 
						, cdTyValue        : sResult[i].cdTyValue
						, cmmnCdValue      : sResult[i].cmmnCdValue 
						, cmmnCdNm         : sResult[i].cmmnCdNm
						, cmmnCdEngNm      : sResult[i].cmmnCdEngNm 
						, cmmnCdFllNm      : sResult[i].cmmnCdFllNm
						, cmmnDc           : sResult[i].cmmnDc 
						, cmmnCdStepCn     : sResult[i].cmmnCdStepCn
						, sortOrdr         : sResult[i].sortOrdr 
						, useAt            : sResult[i].useAt
						, frstRegistDt     : sResult[i].frstRegistDt
						, frstRegisterId   : sResult[i].frstRegisterId
						, frstRegisterNm   : sResult[i].frstRegisterNm 
						, lastModfDt       : sResult[i].lastModfDt
						, lastUpdusrId     : sResult[i].lastUpdusrId
						, lastUpdusrNm     : sResult[i].lastUpdusrNm
			};
			codeList.push(cd)
			if (i + 1 == sResult.length || sResult[i].upperCmmnCdValue != sResult[i + 1].upperCmmnCdValue) {
				result[cd.upperCmmnCdValue] = codeList;
				codeList = [];
			}
		}
	}
	
	return result;
	/*
	var actionUrl   = '';
	var parser = new DOMParser();
	var requestData = parser.parseFromString("<map/>", "text/xml");
	var result      = requestData.documentElement;
	
	if (Object.prototype.toString.call(rObj) != '[object Array]') {
		console.log("Code는 잘못된 형식입니다.");
		return WebSquare.json.XML2JSONString(result);
	}
	
	if (rObj.length > 0) {
		var commonCode = rObj.join(",");
		actionUrl = "/" + CommonUtil.getContextName() + "/com/retrieveCmmnDetailCodeList.do";
		var searchInfo = {
			"cmmnCdIds" : commonCode
		};
		var reqAjaxOptions = {
			"action" : actionUrl,
			"mode"   : "synchronous",
			"reqDoc" : {
				"searchInfo" : searchInfo
			},
			"mediatype" : "application/json"
		};
		var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
		if (!CommonUtil.ajaxErrorCheck(resultAll, "공통코드 모듈")) {
			result = {};
			if (callbackFnc) {
				eval(callbackFnc + '(result)');
			}
			return result;
		}
		var sResult = resultAll.cmmnCodeList;
		var str = new Array();
		for ( var i = 0; i < sResult.length; i++) {
			str.push("<map>" + "<cdLevel         ><![CDATA[" + sResult[i].cdLevel          + "]]></cdLevel>" 
					         + "<cmmnCdId        ><![CDATA[" + sResult[i].cmmnCdId         + "]]></cmmnCdId>"
							 + "<refrnCdKeyValue ><![CDATA[" + sResult[i].refrnCdKeyValue  + "]]></refrnCdKeyValue>"
							 + "<upperCmmnCdValue><![CDATA[" + sResult[i].upperCmmnCdValue + "]]></upperCmmnCdValue>" 
							 + "<cdTyValue       ><![CDATA[" + sResult[i].cdTyValue        + "]]></cdTyValue>"
							 + "<cmmnCdValue     ><![CDATA[" + sResult[i].cmmnCdValue      + "]]></cmmnCdValue>" 
							 + "<cmmnCdNm        ><![CDATA[" + sResult[i].cmmnCdNm         + "]]></cmmnCdNm>"
							 + "<cmmnCdEngNm     ><![CDATA[" + sResult[i].cmmnCdEngNm      + "]]></cmmnCdEngNm>" 
							 + "<cmmnCdFllNm     ><![CDATA[" + sResult[i].cmmnCdFllNm      + "]]></cmmnCdFllNm>"
							 + "<cmmnDc          ><![CDATA[" + sResult[i].cmmnDc           + "]]></cmmnDc>" 
							 + "<cmmnCdStepCn    ><![CDATA[" + sResult[i].cmmnCdStepCn     + "]]></cmmnCdStepCn>"
							 + "<sortOrdr        ><![CDATA[" + sResult[i].sortOrdr         + "]]></sortOrdr>" 
							 + "<useAt           ><![CDATA[" + sResult[i].useAt            + "]]></useAt>"
							 + "<frstRegistDt    ><![CDATA[" + sResult[i].frstRegistDt     + "]]></frstRegistDt>"
							 + "<frstRegisterId  ><![CDATA[" + sResult[i].frstRegisterId   + "]]></frstRegisterId>"
							 + "<frstRegisterNm  ><![CDATA[" + sResult[i].frstRegisterNm   + "]]></frstRegisterNm>" 
							 + "<lastModfDt      ><![CDATA[" + sResult[i].lastModfDt       + "]]></lastModfDt>"
							 + "<lastUpdusrId    ><![CDATA[" + sResult[i].lastUpdusrId     + "]]></lastUpdusrId>"
							 + "<lastUpdusrNm    ><![CDATA[" + sResult[i].lastUpdusrNm     + "]]></lastUpdusrNm>"
							 + "</map>");
			if (i + 1 == sResult.length || sResult[i].upperCmmnCdValue != sResult[i + 1].upperCmmnCdValue) {
				var nstr = "<" + sResult[i].upperCmmnCdValue + ">" + str.join("") + "</" + sResult[i].upperCmmnCdValue + ">";
				try {
					//WebSquare.xml.appendChild(result, parser.parse(nstr, "text/xml").documentElement);
					result.appendChild(parser.parseFromString(nstr, "text/xml").documentElement);
				} 
				catch (e) {
					debugger
				}
				str = new Array();
			}
		}
	}
	
	//result = JSON.parse(WebSquare.json.XML2JSONString(parser.parseFromString(result, "text/xml")));
	result = {};
	if (CommonUtil.isNull(result)) {
		result = {};
	}
	if (callbackFnc) {
		eval(callbackFnc + '(result)');
	}
	return result;
	*/
};

/*
CommonUtil.setJsonToDataList = function(jsonObj, dataList, bDelete) {
	if (CommonUtil.isNull(dataList)) {
		return;
	}
	if (bDelete != false) {
		dataList.removeAll();
	}
	if (CommonUtil.isNull(jsonObj)) {
		return;
	}
	for ( var i = 0; i < jsonObj.length; i++) {
		var arrRow = [];
		for ( var j = 0; j < dataList.getColumnCount(); j++) {
			arrRow[j] = eval("jsonObj[i]." + dataList.getColumnID(j));
		}
		dataList.setRowData(i + 1, arrRow, false);
	}
};
*/
CommonUtil.setJsonToControl = function(controlId, jsonData, bDelete, headItemLabel, headItemValue, value, jsonLabelNm, jsonValueNm, jsonUseAtNm, useAt, controlTypeName) {
	if (CommonUtil.isNull(controlId) || CommonUtil.isNull(jsonLabelNm) || CommonUtil.isNull(jsonValueNm)) {
		return;
	}
	
	var control;
	
	if(typeof controlId == "string") {
		control = document.getElementById(controlId);
	} else if(typeof controlId == "object") {
		control = controlId;
	}
	
	if (bDelete != false) {
		control.removeAll();
	}
	var headCount = 0;
	if (!CommonUtil.isNull(headItemLabel)) {
		control.addItem(CommonUtil.nvl(headItemValue, ""), headItemLabel, 0);
		headCount++;
	}
	if (CommonUtil.isNull(jsonData) || JSON.stringify(jsonData) == "{}") {
		return;
	}
	var selectedIndex = controlTypeName == "combo" ? 0 : -1;
	var itemCount = headCount;
	if (CommonUtil.isNull(jsonData.length)) {
		if (!$.isArray(jsonData)) {
			try {
				jsonData = [
					jsonData.map
				];
			}
			catch (e) {
				jsonData = [
					jsonData
				];
			}
		}
	}
	for (var i = 0; i < jsonData.length; i++) {
//		var jsonLabel = eval("jsonData[i]." + jsonLabelNm);
//		var jsonValue = eval("jsonData[i]." + jsonValueNm);
//		var jsonUseAt = eval("jsonData[i]." + jsonUseAtNm);
		var jsonLabel = jsonData[i][jsonLabelNm];
		var jsonValue = jsonData[i][jsonValueNm];
		var jsonUseAt = jsonData[i][jsonUseAtNm];
		if (!CommonUtil.isNull(useAt)) {
			if (useAt == jsonUseAt) {
				control.addItem(jsonValue, jsonLabel, itemCount);
				itemCount++;
			}
		}
		else {
			control.addItem(jsonValue, jsonLabel, itemCount);
			itemCount++;
		}
		if (!CommonUtil.isNull(value) && jsonValue == value) {
			selectedIndex = itemCount - 1;
		}
		if (controlTypeName == "checkbox") {
			var arrValue = value.split(" ");
			for (var j = 0; j < arrValue.length; j++) {
				if (arrValue[j] == jsonValue) {
					control.setSelectedIndex(itemCount - 1);
				}
			}
		}
	}
	if (controlTypeName != "checkbox" && ((controlTypeName == "radio" && selectedIndex != -1) || (controlTypeName == "combo"))) {
		control.setSelectedIndex(selectedIndex);
	}
};

/*
CommonUtil.setJsonToCodeCombo = function(controlId, jsonData, bDelete,
		headItemLabel, headItemValue, value) {
	CommonUtil.setJsonToControl(controlId, jsonData, bDelete, headItemLabel,
			headItemValue, value, "cmmnCdNm", "cmmnCdValue", "useAt", "Y",
			"combo");
};
function IdsiCommonCode(codeParam) {
	this.codeParam = codeParam;
	this.codeJsonList = {};
	this.headLabel = "";
	this.headValue = "";
	this.useAt = "";
	this.skipHandleChange = false;
	this.multiComboControlList = new Array();
	this.multiComboUprCdKeyList = new Array();
	this.init = function(codeParam) {
		this.codeJsonList = CommonUtil.getCommonCodeList(codeParam);
	};
	this.getCommonCodeList = function(upperCmmnCdValue, compColumnNm,
			compOperand, compValue) {
		if (CommonUtil.isNull(compColumnNm) || CommonUtil.isNull(compOperand)) {
			if (CommonUtil.isNull(upperCmmnCdValue)) {
				return {};
			}
			return eval("this.codeJsonList." + upperCmmnCdValue);
		} else {
			var originList = eval("this.codeJsonList." + upperCmmnCdValue);
			var resultList = [];
			compValue = "," + compValue + ",";
			for ( var key in originList) {
				var orgValue = ","
						+ eval("originList[" + key + "]." + compColumnNm) + ",";
				if ((compOperand == "==" && compValue.indexOf(orgValue) > -1)
						|| (compOperand == "!=" && compValue.indexOf(orgValue) == -1)) {
					resultList[resultList.length] = originList[key];
				}
			}
			return resultList;
		}
	};
	this.getParentCodeKey = function(code, cdTyValue) {
		for ( var key in this.codeJsonList) {
			var codeList = eval("this.codeJsonList." + key);
			if (!$.isArray(codeList)) {
				try {
					codeList = [ codeList.map ];
				} catch (e) {
					codeList = [ codeList ];
				}
			}
			if (codeList[0].cdTyValue == cdTyValue) {
				for ( var i = 0; i < codeList.length; i++) {
					if (codeList[i].cmmnCdValue == code) {
						return key;
					}
				}
			}
		}
	};
	this.getParentCodeValue = function(cmmnCdId, cdTyValue) {
		for ( var key in this.codeJsonList) {
			var codeList = eval("this.codeJsonList." + key);
			if (!$.isArray(codeList)) {
				try {
					codeList = [ codeList.map ];
				} catch (e) {
					codeList = [ codeList ];
				}
			}
			if (codeList[0].cdTyValue == cdTyValue) {
				for ( var i = 0; i < codeList.length; i++) {
					if (codeList[i].cmmnCdId == cmmnCdId) {
						return codeList[i].cmmnCdValue;
					}
				}
			}
		}
	};
	this.getUprCdKey = function(list, value) {
		if (JSON.stringify(list) == "{}") {
			return "";
		}
		if (!$.isArray(list)) {
			try {
				list = [ list.map ];
			} catch (e) {
				list = [ list ];
			}
		}
		for ( var i = 0; i < list.length; i++) {
			if (list[i].cmmnCdValue == value) {
				return list[i].cmmnCdId;
			}
		}
		return "";
	};
	this.setMultiComboUprCdKeyList = function(multiComboUprCdKeyIndex,
			controlId, value) {
		var arrMultiComboUprCdKeyList = this.multiComboUprCdKeyList[multiComboUprCdKeyIndex]
				.split(",");
		for ( var i = 0; i < arrMultiComboUprCdKeyList.length; i++) {
			var arrMultiComboControlList = this.multiComboControlList[multiComboUprCdKeyIndex]
					.split(",");
			for ( var j = 0; j < arrMultiComboControlList.length; j++) {
				if (arrMultiComboControlList[j] == controlId) {
					if (j > 0 && !CommonUtil.isNull(value) && value != "-1") {
						arrMultiComboUprCdKeyList[j] = this
								.getUprCdKey(
										this
												.getCommonCodeList(arrMultiComboUprCdKeyList[j - 1]),
										value);
					}
					for ( var k = j + 1; k < arrMultiComboControlList.length; k++) {
						arrMultiComboUprCdKeyList[k] = "";
					}
					this.multiComboUprCdKeyList[multiComboUprCdKeyIndex] = arrMultiComboUprCdKeyList
							.join(",");
					return;
				}
			}
		}
	};
	this.setMultiComboUprCdKeySingle = function(multiComboUprCdKeyIndex,
			controlId, uprCdKey) {
		var arrMultiComboUprCdKeyList = this.multiComboUprCdKeyList[multiComboUprCdKeyIndex]
				.split(",");
		for ( var i = 0; i < arrMultiComboUprCdKeyList.length; i++) {
			var arrMultiComboControlList = this.multiComboControlList[multiComboUprCdKeyIndex]
					.split(",");
			for ( var j = 0; j < arrMultiComboControlList.length; j++) {
				if (arrMultiComboControlList[j] == controlId) {
					arrMultiComboUprCdKeyList[j] = uprCdKey;
					this.multiComboUprCdKeyList[multiComboUprCdKeyIndex] = arrMultiComboUprCdKeyList
							.join(",");
					return;
				}
			}
		}
	};
	this.setItemList = function(uprCdKey, controlId, headLabel, headValue,
			useAt, value, compColumnNm, compOperand, compValue) {
		CommonUtil.setJsonToControl(controlId, this.getCommonCodeList(uprCdKey,
				compColumnNm, compOperand, compValue), true, headLabel,
				headValue, value, "cmmnCdNm", "cmmnCdValue", "useAt", useAt,
				"combo");
	};
	this.setItemListCheckbox = function(uprCdKey, controlId, headLabel,
			headValue, useAt, value, compColumnNm, compOperand, compValue) {
		CommonUtil.setJsonToControl(controlId, this.getCommonCodeList(uprCdKey,
				compColumnNm, compOperand, compValue), true, headLabel,
				headValue, value, "cmmnCdNm", "cmmnCdValue", "useAt", useAt,
				"checkbox");
	};
	this.setItemListRadio = function(uprCdKey, controlId, headLabel, headValue,
			useAt, value, compColumnNm, compOperand, compValue) {
		CommonUtil.setJsonToControl(controlId, this.getCommonCodeList(uprCdKey,
				compColumnNm, compOperand, compValue), true, headLabel,
				headValue, value, "cmmnCdNm", "cmmnCdValue", "useAt", useAt,
				"radio");
	};
	this.setItemListMulti = function(uprCdKey, controlIds, headLabel,
			headValue, useAt, arrValue, arrCompColumnNm, arrCompOperand,
			arrCompValue) {
		if (Object.prototype.toString.call(controlIds) != '[object Array]') {
			console.log("ControlIds는 잘못된 형식입니다.");
			return;
		}
		try {
			if (CommonUtil.isNull(arrValue)
					|| Object.prototype.toString.call(arrValue) != '[object Array]') {
				arrValue = new Array();
				for ( var i = 0; i < controlIds.length; i++) {
					arrValue[i] = "";
				}
			}
			this.headLabel = headLabel;
			this.headValue = headValue;
			this.useAt = useAt;
			var multiControlIds = controlIds.join(",");
			var isFind = false;
			var currMultiListCnt = -1;
			for ( var i = 0; i < this.multiComboControlList.length; i++) {
				if (this.multiComboControlList[i] == multiControlIds) {
					isFind = true;
					this.multiComboUprCdKeyList[i] = uprCdKey;
					currMultiListCnt = i;
				}
			}
			if (!isFind) {
				this.multiComboControlList[this.multiComboControlList.length] = multiControlIds;
				this.multiComboUprCdKeyList[this.multiComboUprCdKeyList.length] = uprCdKey;
				currMultiListCnt = this.multiComboUprCdKeyList.length - 1;
			}
			for ( var i = 0; i < controlIds.length; i++) {
				if (i == 0) {
					var compColumnNm = CommonUtil.isNull(arrCompColumnNm) ? null
							: CommonUtil.isNull(arrCompColumnNm[i]) ? null
									: arrCompColumnNm[i];
					var compOperand = CommonUtil.isNull(arrCompOperand) ? null
							: CommonUtil.isNull(arrCompOperand[i]) ? null
									: arrCompOperand[i];
					var compValue = CommonUtil.isNull(arrCompValue) ? null
							: CommonUtil.isNull(arrCompValue[i]) ? null
									: arrCompValue[i];
					CommonUtil.setJsonToControl(controlIds[i], this
							.getCommonCodeList(uprCdKey, compColumnNm,
									compOperand, compValue), true, headLabel,
							headValue, arrValue[i], "cmmnCdNm", "cmmnCdValue",
							"useAt", useAt, "combo");
					this.multiComboUprCdKeyList[currMultiListCnt] = this.multiComboUprCdKeyList[currMultiListCnt]
							+ ","
							+ this.getUprCdKey(
									this.getCommonCodeList(uprCdKey),
									arrValue[i]);
				} else {
					var compColumnNm = CommonUtil.isNull(arrCompColumnNm) ? null
							: CommonUtil.isNull(arrCompColumnNm[i]) ? null
									: arrCompColumnNm[i];
					var compOperand = CommonUtil.isNull(arrCompOperand) ? null
							: CommonUtil.isNull(arrCompOperand[i]) ? null
									: arrCompOperand[i];
					var compValue = CommonUtil.isNull(arrCompValue) ? null
							: CommonUtil.isNull(arrCompValue[i]) ? null
									: arrCompValue[i];
					var arrUprCdKeyList = this.multiComboUprCdKeyList[currMultiListCnt]
							.split(",");
					var parentValue = arrUprCdKeyList[i];
					CommonUtil.setJsonToControl(controlIds[i], CommonUtil
							.isNull(parentValue)
							|| parentValue == "-1" ? {} : this
							.getCommonCodeList(parentValue, compColumnNm,
									compOperand, compValue), true, headLabel,
							headValue, arrValue[i], "cmmnCdNm", "cmmnCdValue",
							"useAt", useAt, "combo");
					if (i < controlIds.length - 1) {
						this.multiComboUprCdKeyList[currMultiListCnt] = this.multiComboUprCdKeyList[currMultiListCnt]
								+ ","
								+ this.getUprCdKey(this
										.getCommonCodeList(parentValue),
										arrValue[i]);
					}
				}
			}
		} catch (e) {
			console.log("setItemListMulti 실행 오류  :" + e.toString());
		}
	};
	this.handleChangeCommonCode = function(controlId) {
		if (this.skipHandleChange == true) {
			return;
		}
		if (CommonUtil.isNull(controlId)) {
			console.log("controlId 오류입니다.");
			return;
		}
		this.skipHandleChange = true;
		var value = eval(controlId + ".getValue()");
		for ( var i = 0; i < this.multiComboControlList.length; i++) {
			if (("," + this.multiComboControlList[i] + ",").indexOf(","
					+ controlId + ",") > -1) {
				var arrControlId = this.multiComboControlList[i].split(",");
				for ( var j = 0; j < arrControlId.length; j++) {
					if (controlId == arrControlId[j]) {
						for ( var k = j + 1; k < arrControlId.length; k++) {
							if (k == j + 1) {
								if (CommonUtil.isNull(value) || value == "-1") {
									CommonUtil.setJsonToControl(
											arrControlId[k], {}, true,
											this.headLabel, this.headValue, "",
											"cmmnCdNm", "cmmnCdValue", "useAt",
											this.useAt, "combo");
									this.setMultiComboUprCdKeySingle(i,
											arrControlId[k], "");
								} else {
									var arrUprCdKeyList = this.multiComboUprCdKeyList[i]
											.split(",");
									var parentValue = this
											.getUprCdKey(
													this
															.getCommonCodeList(arrUprCdKeyList[k - 1]),
													value);
									CommonUtil
											.setJsonToControl(
													arrControlId[k],
													this
															.getCommonCodeList(parentValue),
													true, this.headLabel,
													this.headValue, "",
													"cmmnCdNm", "cmmnCdValue",
													"useAt", this.useAt,
													"combo");
									this.setMultiComboUprCdKeySingle(i,
											arrControlId[k], parentValue);
								}
							} else {
								CommonUtil.setJsonToControl(arrControlId[k],
										{}, true, this.headLabel,
										this.headValue, "", "cmmnCdNm",
										"cmmnCdValue", "useAt", this.useAt,
										"combo");
								this.setMultiComboUprCdKeySingle(i,
										arrControlId[k], "");
							}
							eval(arrControlId[k]).setSelectedIndex(0);
						}
					}
				}
			}
		}
		this.skipHandleChange = false;
	};
	this.setItemListMultiFromCode = function(controlId, value) {
		if (CommonUtil.isNull(controlId)) {
			console.log("controlId 오류입니다.");
			return;
		}
		for ( var i = 0; i < this.multiComboControlList.length; i++) {
			if (("," + this.multiComboControlList[i] + ",").indexOf(","
					+ controlId + ",") > -1) {
				var cdTyValue = this.multiComboUprCdKeyList[i].substring(0,
						this.multiComboUprCdKeyList[i].indexOf(","));
				var arrControlId = this.multiComboControlList[i].split(",");
				for ( var j = 0; j < arrControlId.length; j++) {
					if (controlId == arrControlId[j]) {
						var parentValue = "";
						var codeValue = value;
						var uprCdKey = "";
						this.skipHandleChange = true;
						for ( var k = j; k >= 0; k--) {
							if (k == j) {
								uprCdKey = this.getParentCodeKey(codeValue,
										cdTyValue);
								parentValue = this.getParentCodeValue(uprCdKey,
										cdTyValue);
								CommonUtil.setJsonToControl(arrControlId[k],
										this.getCommonCodeList(uprCdKey), true,
										this.headLabel, this.headValue,
										codeValue, "cmmnCdNm", "cmmnCdValue",
										"useAt", this.useAt, "combo");
								this.setMultiComboUprCdKeySingle(i,
										arrControlId[k], uprCdKey);
								codeValue = parentValue;
							} else {
								uprCdKey = this.getParentCodeKey(codeValue,
										cdTyValue);
								parentValue = this.getParentCodeValue(uprCdKey,
										cdTyValue);
								CommonUtil.setJsonToControl(arrControlId[k],
										this.getCommonCodeList(uprCdKey), true,
										this.headLabel, this.headValue,
										codeValue, "cmmnCdNm", "cmmnCdValue",
										"useAt", this.useAt, "combo");
								this.setMultiComboUprCdKeySingle(i,
										arrControlId[k], uprCdKey);
								codeValue = parentValue;
							}
						}
						this.skipHandleChange = false;
					}
				}
			}
		}
	};
	this.init(this.codeParam);
}
*/

CommonUtil.getPopupIdFromParameters = function(){
	if(window.neoSafeKoreaParams != undefined) {
		return neoSafeKoreaParams.popupId;
	}
	
	function getUrlParameter(name) {
	    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	    var regex   = new RegExp('[\\?&]' + name + '=([^&#]*)');
	    var results = regex.exec(location.search);
	    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}
	
	return getUrlParameter("popupId");
}
CommonUtil.setPopupParameter = function(popupId, paramName, paramDataObj){
	sessionStorage.setItem(popupId + "." + paramName, JSON.stringify(paramDataObj));
}

CommonUtil.getPopupParameter = function(paramName, paramDataObj){
	var popupId = CommonUtil.getPopupIdFromParameters();
	var param = sessionStorage.getItem(popupId + "." + paramName);
	return JSON.parse(param);
}


CommonUtil.openPopup = function(url, options) {
	var useIFrame      = typeof options.useIFrame === 'undefined' ? false : options.useIFrame;
	var modal          = typeof options.modal     === 'undefined' ? true  : options.modal;
	var width          = parseInt(options.width  || 400);
	var height         = parseInt(options.height || 400);
	var dualScreenLeft = typeof window.screenLeft !== 'undefined' ? window.screenLeft : screen.left;
	var dualScreenTop  = typeof window.screenTop  !== 'undefined' ? window.screenTop  : screen.top;
	var brWidth        = window.innerWidth  ? window.innerWidth  : document.documentElement.clientWidth  ? document.documentElement.clientWidth  : screen.width;
	var brHeight       = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
	if (width  >= brWidth ) width  = brWidth;
	if (height >= brHeight) height = brHeight;

	var left = options.left;
	var top  = options.top;

	if (!useIFrame) {
		if (left == undefined) left = ((brWidth  / 2) - (width  / 2)) + dualScreenLeft; else left = left + dualScreenLeft;
		if (top  == undefined) top  = ((brHeight / 2) - (height / 2)) + dualScreenTop;  else top  = top  + dualScreenTop; 
	}
	else {
		if (left == undefined) 
			 left = ((brWidth / 2) - (width / 2)) + (CommonUtil.isNull(window.pageXOffset) ? window.document.documentElement.scrollLeft : window.pageXOffset);
		else left = left + (CommonUtil.isNull(window.pageXOffset) ? window.document.documentElement.scrollLeft : window.pageXOffset);

		if (top  == undefined) 
			 top = ((brHeight / 2) - (height / 2)) + (CommonUtil.isNull(window.pageYOffset) ? window.document.documentElement.scrollTop : window.pageYOffset);
		else top = top + (CommonUtil.isNull(window.pageYOffset) ? window.document.documentElement.scrollTop : window.pageYOffset);
	}

	
	var id = options.id;
	if (options.closeCallbackFnc) {
		id = id + '__' + options.closeCallbackFnc;
	}
	if (!CommonUtil.isNull(options.heavyjob) && options.heavyjob == true) {
		if (!confirm("시간이 많이 걸리는 작업입니다. 계속 하시겠습니까?")) {
			alert("작업을 취소합니다.");
			return;
		}
	}

	var options = {
		id     : id,
		type   : options.type || 'window',
		width  : width + "px",
		height : height + "px",
		top    : Math.round(top) + "px",
		left   : Math.round(left) + "px",
		modal  : modal,
		style  : "",
		popupName  : options.popupName || '',
		useIFrame  : useIFrame,
		resizable  : options.resizable || false,
		scrollbars : options.scrollbar || false,
		status  : false,
		menubar : false,
		title : options.title || false,
		dataObject : options.dataObject
	};
	
	//$w.openPopup("/" + CommonUtil.getContextName() + url, options);
	
	if(url.indexOf("?") == -1) url += "?"; else url += "&";
	url += "popupId=" + options.id;
	
	CommonUtil.setPopupParameter(options.id, options.dataObject.name, options.dataObject.data);	
	//*********************************************************************
	//
	if($("#_modal").length == 0){
		var modalHtml = "<div class=\"w2modal modal\" id=\"_modal\" style=\"display: none;\"></div>";
		$("body").append(modalHtml);
	}
	$("#_modal").show();
	
	//*********************************************************************
	//
	var popupHtml = "<div title=\"" + options.popupName + "\" "
	              + "class=\"w2window w2window_maximized w2popup_window disable-select\""
	              + "id=\"" + options.id + "\" "
	              + "style=\"left:" + options.left + ";top:" + options.top + ";width:" + options.width + ";height:" + options.height + ";\">";
	popupHtml    +=     "<div class=\"w2window_header\""                                     + " id=\"" + options.id +"_header\">"
	              +         "<div class=\"w2window_header_icon\""                            + " id=\"" + options.id +"_header_icon\"></div>"
	              +         "<div class=\"w2window_header_title\""                           + " id=\"" + options.id +"_header_title\">" + options.popupName + "</div>"
	              +         "<div class=\"w2window_header_control\""                         + " id=\"" + options.id +"_header_control\">"
	           // +             "<div title=\"창사이즈 최소화\" class=\"w2window_minimize\"" + " id=\"" + options.id +"_minimize\"></div>"
	           // +             "<div title=\"창사이즈 복원\" class=\"w2window_restore\""    + " id=\"" + options.id +"_restore\"></div>"
	              +             "<a title=\"창닫기\" class=\"w2window_close\" href=\"javascript:$('#bbs_close').hide()\""             + " id=\"" + options.id +"_close\"></a>"
	              +         "</div>"
	              +     "</div>";
	popupHtml    +=     "<div class=\"w2window_body\" id=\"" + options.id +"_body\">"
	              +         "<div class=\"w2window_content\" id=\"" + options.id +"_content\">"
	              +             "<iframe class=\"w2iframe w2window_iframe\" id=\"" + options.id +"_iframe\" src=\"" + url + "\" frameborder=\"0\"></iframe>"
	              +         "</div>"
	              +         "<div class=\"w2window_status\"  id=\"" + options.id +"_status\">"
	              +             "<div class=\"w2window_msg\" id=\"" + options.id +"_msg\"></div>"
	              +         "</div>"
	              +     "</div>"
	              +     "<div class=\"w2modal modal\" id=\"" + options.id + "_modal\" style=\"display:none\"></div>";
	popupHtml    += "</div>";
	popupHtml    += "<div class=\"w2group w2drag drag w2drag_resize\" id=\"" + options.id + "_drag\"></div>";
	$("body").append(popupHtml);
	var $modal  = $("#_modal");
	var $popWin = $("#" + options.id);
	var $header = $("#" + options.id + "_header");
	var $closeBtn = $("#" + options.id +"_close");
	var $title    = $("#" + options.id + "_header_title");
	var $drag     = $("#" + options.id + "_drag");
	
	
	$closeBtn.on("click", function(){
		var id = $(this).attr("id").replace("_close", "");
		CommonUtil.closePopup(id, "-1");
	});
	
	
	var _prevX, _prevY;
	var _isMoving = false;
	var _mySize     = { width:$popWin.width(),          height:$popWin.height()};
	var _parentSize = { width:$("body").prop("scrollWidth") - 30, height:$("body").prop("scrollHeight") - 30};
	
	var mousedownHandler = function(e){
		if($(e.target).hasClass("w2window_close")) return;
				
		_prevX = e.screenX;
		_prevY = e.screenY;
		
		$drag.css("display", "block");
		$drag.css("visibility", "visible");

		$popWin.find(".modal").show();
		$drag.width ($popWin.width());
		$drag.height($popWin.height());
		
		$drag.offset($popWin.offset());
		
		_isMoving = true;
	};
	var mouseupHandler = function(e){
		if(_isMoving == false) return;
		
		$popWin.offset($drag.offset());
		$popWin.find(".modal").hide();
		$drag.css("display", "none");
		$drag.css("visibility", "hidden");
		_isMoving = false;
	};
	var mousemoveHandler = function(e){
		if(_isMoving == false) return;
		
		var p = $drag.offset();
		var dx = _prevX - e.screenX;
		var dy = _prevY - e.screenY;
		p.left -= dx;
		p.top  -= dy;
		
		if(p.left + _mySize.width  > _parentSize.width ) p.left = _parentSize.width  - _mySize.width;   
		if(p.top  + _mySize.height > _parentSize.height) p.top  = _parentSize.height - _mySize.height;   
		if(p.left < 0) p.left = 0;
		if(p.top  < 0) p.top  = 0;
		$drag.offset(p);
		
		_prevX = e.screenX;
		_prevY = e.screenY;
	};
	
	$header.on("mousedown", mousedownHandler);

	$popWin.find(".modal").on("mouseup",    mouseupHandler);
	$popWin.find(".modal").on("mousemove",  mousemoveHandler);

	$drag.on("mouseup",   mouseupHandler);
	$drag.on("mousemove", mousemoveHandler);
};

CommonUtil.closePopup = function(popId, rtnCode, rtnParam) {
	function _closePopup(){
		if($("#" + popId).length > 0){
			$(".drag").last().remove();
			$("#_modal").remove();
			$("#" + popId).remove();
		}
		else {
			parent.$(".drag").last().remove();
			parent.$("#_modal").remove();
			parent.$("#" + popId).remove();
		}
	}
	
	var callbackFnc = popId.split("__")[1] || '';
	var rtnCode = rtnCode || '';
	if (callbackFnc) {
		if (opener) {
			if (rtnCode != "-1") {
//				eval('opener.' + callbackFnc + '(rtnCode, rtnParam)');
				opener[callbackFnc](rtnCode, rtnParam);
			}
			self.close();
		} 
		else {
			if (rtnCode != "-1") {
//				eval('parent.' + callbackFnc + '(rtnCode, rtnParam)');
				parent[callbackFnc](rtnCode, rtnParam);
			}
			_closePopup();
		}
	} 
	else {
		_closePopup();
	}
};
CommonUtil.dynamicLinkCss = function(site) {
	var headID = document.getElementsByTagName("head")[0];
	var cssNode = document.createElement('link');
	var cssNode2 = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode2.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode2.rel = 'stylesheet';
	if (site == "DPF") {
		cssNode.href = '/' + CommonUtil.getContextName() + '/css/layout.css';
		cssNode2.href = '/' + CommonUtil.getContextName() + '/css/info_sub.css';
	} else {
		cssNode.href = '/' + CommonUtil.getContextName() + '/css/style.css';
		cssNode2.href = '/' + CommonUtil.getContextName() + '/css/sub.css';
	}
	headID.appendChild(cssNode);
	headID.appendChild(cssNode2);
};
/*
CommonUtil.setJsonToOrganControl = function(controlId, jsonData, bDelete,
		headItemLabel, headItemValue, jsonLabelNm, jsonValueNm,
		jsonUpperValueNm, jsonUseAtNm, useAt, controlTypeName, setComboId) {
	var rtnFlag = true;
	if (CommonUtil.isNull(controlId) || CommonUtil.isNull(jsonLabelNm)
			|| CommonUtil.isNull(jsonValueNm)) {
		return;
	}
	var control = eval(controlId);
	if (bDelete != false) {
		control.removeAll();
	}
	if (CommonUtil.isNull(jsonData)) {
		return;
	}
	var headCount = 0;
	if (!CommonUtil.isNull(headItemLabel)) {
		control.addItem(CommonUtil.nvl(headItemValue, ""), headItemLabel, 0);
		headCount++;
	}
	var selectedIndex = controlTypeName == "combo" ? 0 : -1;
	var itemCount = headCount;
	if (CommonUtil.isNull(jsonData.length)) {
		if (!$.isArray(jsonData)) {
			try {
				jsonData = [ jsonData.map ];
			} catch (e) {
				jsonData = [ jsonData ];
			}
		}
	}
	for ( var i = 0; i < jsonData.length; i++) {
		var jsonLabel = eval("jsonData[i]." + jsonLabelNm);
		var jsonValue = eval("jsonData[i]." + jsonValueNm);
		var jsonUpperValue = eval("jsonData[i]." + jsonUpperValueNm);
		var jsonUseAt = eval("jsonData[i]." + jsonUseAtNm);
		control.addItem(jsonValue, jsonLabel, itemCount);
		itemCount++;
		if (jsonValue == jsonUpperValue) {
			selectedIndex = itemCount - 1;
		}
		if (controlTypeName == "checkbox") {
			var arrValue = jsonUpperValue.split(" ");
			for ( var j = 0; j < arrValue.length; j++) {
				if (arrValue[j] == jsonValue) {
					control.setSelectedIndex(itemCount - 1);
				}
			}
		}
	}
	if (controlTypeName != "checkbox"
			&& ((controlTypeName == "radio" && selectedIndex != -1) || (controlTypeName == "combo"))) {
		control.setSelectedIndex(selectedIndex);
	}
	return rtnFlag;
};
CommonUtil.setOrganCodeList = function(type, depth, parentCode, useAt,
		selectBoxId, headItemLabel, headItemValue, setComboId, callbackFnc) {
	var receiveFlag = true;
	if (type == "U") {
		var arrHead = new Array(7);
		var arrBody = new Array(7);
		if (typeof selectBoxId == 'object') {
			arrHead[0] = selectBoxId[0];
			arrHead[1] = selectBoxId[1];
			arrHead[2] = selectBoxId[2];
			arrHead[3] = selectBoxId[3];
			arrHead[4] = selectBoxId[4];
			arrHead[5] = selectBoxId[5];
			arrHead[6] = selectBoxId[6];
		}
		if (typeof headItemLabel == 'object') {
			arrBody[0] = headItemLabel[0];
			arrBody[1] = headItemLabel[1];
			arrBody[2] = headItemLabel[2];
			arrBody[3] = headItemLabel[3];
			arrBody[4] = headItemLabel[4];
			arrBody[5] = headItemLabel[5];
			arrBody[6] = headItemLabel[6];
		}
		var requestData = WebSquare.xml.parse("<map/>");
		var requestData2 = WebSquare.xml.parse("<map/>");
		var requestData3 = WebSquare.xml.parse("<map/>");
		var requestData4 = WebSquare.xml.parse("<map/>");
		var requestData5 = WebSquare.xml.parse("<map/>");
		var requestData6 = WebSquare.xml.parse("<map/>");
		var requestData7 = WebSquare.xml.parse("<map/>");
		var result = requestData.documentElement;
		var result2 = requestData2.documentElement;
		var result3 = requestData3.documentElement;
		var result4 = requestData4.documentElement;
		var result5 = requestData5.documentElement;
		var result6 = requestData6.documentElement;
		var result7 = requestData7.documentElement;
		var actionUrl = "/" + CommonUtil.getContextName()
				+ "/com/retrieveOrganComboCodeList.do";
		var searchInfo = {
			"type" : type,
			"depth" : depth,
			"parentCode" : parentCode,
		};
		var reqAjaxOptions = {
			"action" : actionUrl,
			"mode" : "synchronous",
			"reqDoc" : {
				"searchInfo" : searchInfo
			},
			"mediatype" : "application/json"
		};
		var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
		if (!CommonUtil.ajaxErrorCheck(resultAll, "조직코드 모듈")) {
			result = {};
			if (callbackFnc) {
				eval(callbackFnc + '(result)');
			}
			return result;
		}
		var sResult = resultAll.organComboCodeList;
		var x = 0;
		while (eval("sResult.key" + x) != undefined) {
			if (x == 0) {
				var tempData = eval("sResult.key" + x);
				for ( var i = 0; i < tempData.length; i++) {
					var str = "<map>" + "<ctgryNm><![CDATA["
							+ tempData[i].ctgryNm + "]]></ctgryNm>"
							+ "<ctgryId><![CDATA[" + tempData[i].ctgryId
							+ "]]></ctgryId>" + "<upperEngnId><![CDATA["
							+ tempData[i].upperEngnId + "]]></upperEngnId>"
							+ "<useAt><![CDATA[" + tempData[i].useAt
							+ "]]></useAt>" + "</map>";
					WebSquare.xml.appendChild(result,
							WebSquare.xml.parse(str).documentElement);
				}
				result = JSON.parse(WebSquare.json.XML2JSONString(WebSquare.xml
						.parse(result)));
				receiveFlag = CommonUtil.setJsonToOrganControl(arrHead[0],
						result, true, arrBody[0], headItemValue, "ctgryNm",
						"ctgryId", "upperEngnId", "useAt", useAt, "combo",
						setComboId[0]);
				if (receiveFlag) {
					var rrid = eval(setComboId[0]);
					rrid.setValue(tempData[0].upperEngnId);
				} else {
					if (typeof receiveFlag != "undefined") {
						alert("사용하지 않는 조직코드입니다!");
					}
					var arrH = eval(arrHead[0]);
					arrH.setSelectedIndex(0);
					return;
				}
			}
			if (x == 1 && receiveFlag) {
				var tempData = eval("sResult.key" + x);
				for ( var i = 0; i < tempData.length; i++) {
					var str = "<map>" + "<ctgryNm><![CDATA["
							+ tempData[i].ctgryNm + "]]></ctgryNm>"
							+ "<ctgryId><![CDATA[" + tempData[i].ctgryId
							+ "]]></ctgryId>" + "<upperEngnId><![CDATA["
							+ tempData[i].upperEngnId + "]]></upperEngnId>"
							+ "<useAt><![CDATA[" + tempData[i].useAt
							+ "]]></useAt>" + "</map>";
					WebSquare.xml.appendChild(result2,
							WebSquare.xml.parse(str).documentElement);
				}
				result2 = JSON.parse(WebSquare.json
						.XML2JSONString(WebSquare.xml.parse(result2)));
				receiveFlag = CommonUtil.setJsonToOrganControl(arrHead[1],
						result2, true, arrBody[1], headItemValue, "ctgryNm",
						"ctgryId", "upperEngnId", "useAt", useAt, "combo",
						setComboId[1]);
				if (receiveFlag) {
					var rrid = eval(setComboId[1]);
					rrid.setValue(tempData[0].upperEngnId);
				} else {
					if (typeof receiveFlag != "undefined") {
						alert("사용하지 않는 조직코드입니다!");
					}
					var arrH = eval(arrHead[1]);
					arrH.setSelectedIndex(0);
					return;
				}
			}
			if (x == 2 && receiveFlag) {
				var tempData = eval("sResult.key" + x);
				for ( var i = 0; i < tempData.length; i++) {
					var str = "<map>" + "<ctgryNm><![CDATA["
							+ tempData[i].ctgryNm + "]]></ctgryNm>"
							+ "<ctgryId><![CDATA[" + tempData[i].ctgryId
							+ "]]></ctgryId>" + "<upperEngnId><![CDATA["
							+ tempData[i].upperEngnId + "]]></upperEngnId>"
							+ "<useAt><![CDATA[" + tempData[i].useAt
							+ "]]></useAt>" + "</map>";
					WebSquare.xml.appendChild(result3,
							WebSquare.xml.parse(str).documentElement);
				}
				result3 = JSON.parse(WebSquare.json
						.XML2JSONString(WebSquare.xml.parse(result3)));
				receiveFlag = CommonUtil.setJsonToOrganControl(arrHead[2],
						result3, true, arrBody[2], headItemValue, "ctgryNm",
						"ctgryId", "upperEngnId", "useAt", useAt, "combo",
						setComboId[2]);
				if (receiveFlag) {
					var rrid = eval(setComboId[2]);
					rrid.setValue(tempData[0].upperEngnId);
				} else {
					if (typeof receiveFlag != "undefined") {
						alert("사용하지 않는 조직코드입니다!");
					}
					var arrH = eval(arrHead[2]);
					arrH.setSelectedIndex(0);
					return;
				}
			}
			if (x == 3 && receiveFlag) {
				var tempData = eval("sResult.key" + x);
				for ( var i = 0; i < tempData.length; i++) {
					var str = "<map>" + "<ctgryNm><![CDATA["
							+ tempData[i].ctgryNm + "]]></ctgryNm>"
							+ "<ctgryId><![CDATA[" + tempData[i].ctgryId
							+ "]]></ctgryId>" + "<upperEngnId><![CDATA["
							+ tempData[i].upperEngnId + "]]></upperEngnId>"
							+ "<useAt><![CDATA[" + tempData[i].useAt
							+ "]]></useAt>" + "</map>";
					WebSquare.xml.appendChild(result4,
							WebSquare.xml.parse(str).documentElement);
				}
				result4 = JSON.parse(WebSquare.json
						.XML2JSONString(WebSquare.xml.parse(result4)));
				receiveFlag = CommonUtil.setJsonToOrganControl(arrHead[3],
						result4, true, arrBody[3], headItemValue, "ctgryNm",
						"ctgryId", "upperEngnId", "useAt", useAt, "combo",
						setComboId[3]);
				if (receiveFlag) {
					var rrid = eval(setComboId[3]);
					rrid.setValue(tempData[0].upperEngnId);
				} else {
					if (typeof receiveFlag != "undefined") {
						alert("사용하지 않는 조직코드입니다!");
					}
					var arrH = eval(arrHead[3]);
					arrH.setSelectedIndex(0);
					return;
				}
			}
			if (x == 4 && receiveFlag) {
				var tempData = eval("sResult.key" + x);
				for ( var i = 0; i < tempData.length; i++) {
					var str = "<map>" + "<ctgryNm><![CDATA["
							+ tempData[i].ctgryNm + "]]></ctgryNm>"
							+ "<ctgryId><![CDATA[" + tempData[i].ctgryId
							+ "]]></ctgryId>" + "<upperEngnId><![CDATA["
							+ tempData[i].upperEngnId + "]]></upperEngnId>"
							+ "<useAt><![CDATA[" + tempData[i].useAt
							+ "]]></useAt>" + "</map>";
					WebSquare.xml.appendChild(result5,
							WebSquare.xml.parse(str).documentElement);
				}
				result5 = JSON.parse(WebSquare.json
						.XML2JSONString(WebSquare.xml.parse(result5)));
				receiveFlag = CommonUtil.setJsonToOrganControl(arrHead[4],
						result5, true, arrBody[4], headItemValue, "ctgryNm",
						"ctgryId", "upperEngnId", "useAt", useAt, "combo",
						setComboId[4]);
				if (receiveFlag) {
					var rrid = eval(setComboId[4]);
					rrid.setValue(tempData[0].upperEngnId);
				} else {
					if (typeof receiveFlag != "undefined") {
						alert("사용하지 않는 조직코드입니다!");
					}
					var arrH = eval(arrHead[4]);
					arrH.setSelectedIndex(0);
					return;
				}
			}
			if (x == 5 && receiveFlag) {
				var tempData = eval("sResult.key" + x);
				for ( var i = 0; i < tempData.length; i++) {
					var str = "<map>" + "<ctgryNm><![CDATA["
							+ tempData[i].ctgryNm + "]]></ctgryNm>"
							+ "<ctgryId><![CDATA[" + tempData[i].ctgryId
							+ "]]></ctgryId>" + "<upperEngnId><![CDATA["
							+ tempData[i].upperEngnId + "]]></upperEngnId>"
							+ "<useAt><![CDATA[" + tempData[i].useAt
							+ "]]></useAt>" + "</map>";
					WebSquare.xml.appendChild(result6,
							WebSquare.xml.parse(str).documentElement);
				}
				result6 = JSON.parse(WebSquare.json
						.XML2JSONString(WebSquare.xml.parse(result6)));
				receiveFlag = CommonUtil.setJsonToOrganControl(arrHead[5],
						result6, true, arrBody[5], headItemValue, "ctgryNm",
						"ctgryId", "upperEngnId", "useAt", useAt, "combo",
						setComboId[5]);
				if (receiveFlag) {
					var rrid = eval(setComboId[5]);
					rrid.setValue(tempData[0].upperEngnId);
				} else {
					if (typeof receiveFlag != "undefined") {
						alert("사용하지 않는 조직코드입니다!");
					}
					var arrH = eval(arrHead[5]);
					arrH.setSelectedIndex(0);
					return;
				}
			}
			if (x == 6 && receiveFlag) {
				var tempData = eval("sResult.key" + x);
				for ( var i = 0; i < tempData.length; i++) {
					var str = "<map>" + "<ctgryNm><![CDATA["
							+ tempData[i].ctgryNm + "]]></ctgryNm>"
							+ "<ctgryId><![CDATA[" + tempData[i].ctgryId
							+ "]]></ctgryId>" + "<upperEngnId><![CDATA["
							+ tempData[i].upperEngnId + "]]></upperEngnId>"
							+ "<useAt><![CDATA[" + tempData[i].useAt
							+ "]]></useAt>" + "</map>";
					WebSquare.xml.appendChild(result7,
							WebSquare.xml.parse(str).documentElement);
				}
				result7 = JSON.parse(WebSquare.json
						.XML2JSONString(WebSquare.xml.parse(result7)));
				receiveFlag = CommonUtil.setJsonToOrganControl(arrHead[6],
						result7, true, arrBody[6], headItemValue, "ctgryNm",
						"ctgryId", "upperEngnId", "useAt", useAt, "combo",
						setComboId[6]);
				if (receiveFlag) {
					var rrid = eval(setComboId[6]);
					rrid.setValue(tempData[0].upperEngnId);
				} else {
					if (typeof receiveFlag != "undefined") {
						alert("사용하지 않는 조직코드입니다!");
					}
					var arrH = eval(arrHead[6]);
					arrH.setSelectedIndex(0);
					return;
				}
			}
			x++;
		}
	} else if (type == "C") {
		var requestData = WebSquare.xml.parse("<map/>");
		var result = requestData.documentElement;
		var actionUrl = "/" + CommonUtil.getContextName()
				+ "/com/selectLowerOrganCode.do";
		var searchInfo = {
			"rCode1" : parentCode,
			"rCode2" : parentCode
		};
		var reqAjaxOptions = {
			"action" : actionUrl,
			"mode" : "synchronous",
			"reqDoc" : {
				"searchInfo" : searchInfo
			},
			"mediatype" : "application/json"
		};
		var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
		if (!CommonUtil.ajaxErrorCheck(resultAll, "조직코드 모듈")) {
			result = {};
			if (callbackFnc) {
				eval(callbackFnc + '(result)');
			}
			return result;
		}
		var rValue = resultAll.organCodeList;
		for ( var i = 0; i < rValue.length; i++) {
			var str = "<map>" + "<ctgryNm><![CDATA[" + rValue[i].ctgryNm
					+ "]]></ctgryNm>" + "<ctgryId><![CDATA["
					+ rValue[i].ctgryId + "]]></ctgryId>"
					+ "<upperEngnId><![CDATA[" + rValue[i].upperEngnId
					+ "]]></upperEngnId>" + "<useAt><![CDATA["
					+ rValue[i].useAt + "]]></useAt>" + "</map>";
			WebSquare.xml.appendChild(result,
					WebSquare.xml.parse(str).documentElement);
		}
		result = JSON.parse(WebSquare.json.XML2JSONString(WebSquare.xml
				.parse(result)));
		if (depth == "1") {
			receiveFlag = CommonUtil.setJsonToOrganControl(selectBoxId, result,
					true, headItemLabel, headItemValue, "ctgryNm", "ctgryId",
					"upperEngnId", "useAt", useAt, "combo");
			if (!receiveFlag) {
				var arrH = eval(selectBoxId);
				arrH.setSelectedIndex(0);
			}
		} else if (depth == "2") {
			receiveFlag = CommonUtil.setJsonToOrganControl(selectBoxId, result,
					true, headItemLabel, headItemValue, "ctgryNm", "ctgryId",
					"upperEngnId", "useAt", useAt, "combo");
			if (!receiveFlag) {
				var arrH = eval(selectBoxId);
				arrH.setSelectedIndex(0);
			}
		} else if (depth == "3") {
			receiveFlag = CommonUtil.setJsonToOrganControl(selectBoxId, result,
					true, headItemLabel, headItemValue, "ctgryNm", "ctgryId",
					"upperEngnId", "useAt", useAt, "combo");
			if (!receiveFlag) {
				var arrH = eval(selectBoxId);
				arrH.setSelectedIndex(0);
			}
		} else if (depth == "4") {
			receiveFlag = CommonUtil.setJsonToOrganControl(selectBoxId, result,
					true, headItemLabel, headItemValue, "ctgryNm", "ctgryId",
					"upperEngnId", "useAt", useAt, "combo");
			if (!receiveFlag) {
				var arrH = eval(selectBoxId);
				arrH.setSelectedIndex(0);
			}
		} else if (depth == "5") {
			receiveFlag = CommonUtil.setJsonToOrganControl(selectBoxId, result,
					true, headItemLabel, headItemValue, "ctgryNm", "ctgryId",
					"upperEngnId", "useAt", useAt, "combo");
			if (!receiveFlag) {
				var arrH = eval(selectBoxId);
				arrH.setSelectedIndex(0);
			}
		} else if (depth == "6") {
			receiveFlag = CommonUtil.setJsonToOrganControl(selectBoxId, result,
					true, headItemLabel, headItemValue, "ctgryNm", "ctgryId",
					"upperEngnId", "useAt", useAt, "combo");
			if (!receiveFlag) {
				var arrH = eval(selectBoxId);
				arrH.setSelectedIndex(0);
			}
		}
	}
};
CommonUtil.getUpperOrganCode = function(rCode1, rCode2) {
	var fg = false;
	if (CommonUtil.isNull(rCode1)) {
		alert("rCode1 값을 입력하여 주십시오. (rCode1:" + rCode1 + ")");
		return;
	}
	if (CommonUtil.isNull(rCode2)) {
		alert("rCode2 값을 입력하여 주십시오. (rCode2:" + rCode2 + ")");
		return;
	}
	var actionUrl = "/" + CommonUtil.getContextName()
			+ "/com/selectUpperOrganCode.do";
	var searchInfo = {
		"rCode1" : rCode1,
		"rCode2" : rCode2,
		"useAt" : "Y"
	};
	var reqAjaxOptions = {
		"action" : actionUrl,
		"mode" : "synchronous",
		"reqDoc" : {
			"searchInfo" : searchInfo
		},
		"mediatype" : "application/json"
	};
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxErrorCheck(resultAll, "조직코드 모듈")) {
		result = {};
		if (callbackFnc) {
			eval(callbackFnc + '(result)');
		}
		return result;
	}
	var rValue = resultAll.organCodeList;
	console.log("rValue 개수 : " + rValue.length);
	for ( var i = 0; i < rValue.length; i++) {
		if (rValue[i].upperEngnId == rCode2) {
			fg = true;
			break;
		}
	}
	return fg;
};
CommonUtil.getLowerOrganCode = function(rCode1, rCode2) {
	var fg = false;
	if (CommonUtil.isNull(rCode1)) {
		alert("rCode1 값을 입력하여 주십시오. (rCode1:" + rCode1 + ")");
		return;
	}
	if (CommonUtil.isNull(rCode2)) {
		alert("rCode2 값을 입력하여 주십시오. (rCode2:" + rCode2 + ")");
		return;
	}
	var actionUrl = "/" + CommonUtil.getContextName()
			+ "/com/selectLowerOrganCode.do";
	var searchInfo = {
		"rCode1" : rCode1,
		"rCode2" : rCode2,
		"useAt" : "Y"
	};
	var reqAjaxOptions = {
		"action" : actionUrl,
		"mode" : "synchronous",
		"reqDoc" : {
			"searchInfo" : searchInfo
		},
		"mediatype" : "application/json"
	};
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxErrorCheck(resultAll, "조직코드 모듈")) {
		result = {};
		if (callbackFnc) {
			eval(callbackFnc + '(result)');
		}
		return result;
	}
	var rValue = resultAll.organCodeList;
	console.log("rValue 개수 : " + rValue.length);
	for ( var i = 0; i < rValue.length; i++) {
		if (rValue[i].ctgryId == rCode2) {
			fg = true;
			break;
		}
	}
	return fg;
};
*/
CommonUtil.createFrame = function(formName) {
	var frm = window.frames;
	for ( var i = 0; i < frm.length; i++) {
		if (!CommonUtil.isNull(frm[i]) && !CommonUtil.isNull(frm[i].name)) {
			if (frm[i].name == formName) {
				return frm[i];
			}
		}
	}
	var objLayer = CommonUtil.createLayer(formName);
	if (CommonUtil.isNull(objLayer))
		return CommonUtil.createLayer(formName);
	else
		return objLayer;
};

CommonUtil.createLayer = function(formName) {
	//var src = WebSquare.net.getSSLBlankPage();
	var src = "src=\"\"";
	var iframeTag = "<iframe frameborder='0px' name='" + formName + "' scrolling='no' style='width:100px; height:0px' " + src + "></iframe>";
	var layerUP = document.createElement("div");
	var src = "";
	layerUP.style.border = "1px solid blue";
	layerUP.style.width  = "100px";
	layerUP.style.height = "0px";
	layerUP.style.visibility = "hidden";
	document.body.appendChild(layerUP);
	layerUP.innerHTML = iframeTag;
	frm = window.frames;
	for ( var i = 0; i < frm.length; i++) {
		if (!CommonUtil.isNull(frm[i]) && !CommonUtil.isNull(frm[i].name)) {
			if (frm[i].name == formName) {
				return frm[i];
			}
		}
	}
}

/*
CommonUtil.getHolidayList = function() {
	var actionUrl = '';
	var requestData = WebSquare.xml.parse("<map/>");
	var result = requestData.documentElement;
	if (Object.prototype.toString.call(rObj) != '[object Array]') {
		console.log("Code는 잘못된 형식입니다.");
		return WebSquare.json.XML2JSONString(result);
	}
	if (rObj.length > 0) {
		actionUrl = "/" + CommonUtil.getContextName()
				+ "/com/retrieveHolidayList.do";
		var searchInfo = {};
		var reqAjaxOptions = {
			"action" : actionUrl,
			"mode" : "synchronous",
			"reqDoc" : {
				"searchInfo" : searchInfo
			},
			"mediatype" : "application/json"
		};
		var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
		if (!CommonUtil.ajaxErrorCheck(resultAll, "휴일조회 모듈")) {
			result = {};
			if (callbackFnc) {
				eval(callbackFnc + '(result)');
			}
			return result;
		}
		var sResult = resultAll.holidayList;
		var str = new Array();
		for ( var i = 0; i < sResult.length; i++) {
			str.push(sResult[i].holiday);
		}
	}
	if (CommonUtil.isNull(str)) {
		str = {};
	}
	return str;
};
function IdsiGovernCalendar(arrGovernCalendar, arrHoliday) {
	this.arrGovernCalendar = null;
	this.arrHoliday = new Array();
	this.init = function(arrGovernCalendar) {
		if (CommonUtil.isNull(arrGovernCalendar)
				|| CommonUtil.isNull(arrHoliday)) {
			console.log("IdsiGovernCalendar :  달력 컨트롤이 초기화되지 못하였습니다.");
			return;
		}
		this.arrHoliday = arrHoliday;
		this.bindCalHoliday(arrGovernCalendar);
	};
	this.bindCalHoliday = function(arrGovernCalendar) {
		if (CommonUtil.isNull(arrGovernCalendar))
			return;
		this.arrGovernCalendar = arrGovernCalendar;
		for ( var idx = 0, iLen = arrGovernCalendar.length; idx < iLen; idx++) {
			var arrHoliday = this.arrHoliday;
			$w.comp[arrGovernCalendar[idx]].bind("onafteropen", function() {
				IdsiGovernCalendar.setHolidayClass.apply(this.calendar,
						[ arrHoliday ]);
				if (this.getUserData("_evbind") == "true")
					return;
				this.calendar.bind("onviewchange", function(info) {
					IdsiGovernCalendar.setHolidayClass.apply(this,
							[ arrHoliday ]);
				});
				this.setUserData("_evbind", "true");
			});
		}
		;
	};
	this.getHolidayData = function() {
		try {
			return CommonUtil.getHolidayList();
		} catch (e) {
			return [ "20151221", "20151222", "20151223", "20160103",
					"20160104", "20160105" ];
		}
	};
	this.init(arrGovernCalendar);
}
IdsiGovernCalendar.setHolidayClass = function(arrHoliday) {
	try {
		this.removeAllCellClass();
	} catch (e) {
		console.log(e.toString());
	}
	try {
		for ( var idx = 0, iLen = arrHoliday.length; idx < iLen; idx++) {
			this.setCellClass(arrHoliday[idx], "w2calendar_day_0");
		}
		;
	} catch (e) {
		console.log(e.toString());
	}
};
CommonUtil.setDepartCodeList = function(id, dataList, buseocd, searchWord,
		useAt, callbackFnc) {
	debugger;
	var actionUrl = "/" + CommonUtil.getContextName()
			+ "/com/selectDepartCodeList.do";
	var searchInfo = {
		"idNumber" : buseocd,
		"searchWord" : searchWord,
		"useAt" : useAt
	};
	var reqAjaxOptions = {
		"action" : actionUrl,
		"mode" : "synchronous",
		"reqDoc" : {
			"searchInfo" : searchInfo
		},
		"mediatype" : "application/json"
	};
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxErrorCheck(resultAll, "부서코드 모듈")) {
		result = {};
		if (callbackFnc) {
			eval(callbackFnc + '(result)');
		}
		return result;
	}
	var rValue = resultAll.departCodeList;
	console.log("rValue 개수 : " + rValue.length);
	var tmpStr = "<list>";
	var rdt = rValue[0].departDepth;
	if (rdt == "1") {
	} else if (rdt == "2") {
		tmpStr += "<data><depth><![CDATA[1]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
	} else if (rdt == "3") {
		tmpStr += "<data><depth><![CDATA[1]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[2]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
	} else if (rdt == "4") {
		tmpStr += "<data><depth><![CDATA[1]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[2]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[3]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
	} else if (rdt == "5") {
		tmpStr += "<data><depth><![CDATA[1]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[2]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[3]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[4]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
	} else if (rdt == "6") {
		tmpStr += "<data><depth><![CDATA[1]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[2]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[3]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[4]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[5]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
	} else if (rdt == "7") {
		tmpStr += "<data><depth><![CDATA[1]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[2]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[3]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[4]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[5]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
		tmpStr += "<data><depth><![CDATA[6]]></depth><label><![CDATA[코드명없음]]></label><value><![CDATA[코드값없음]]></value></data>";
	}
	for ( var i = 0; i < rValue.length; i++) {
		tmpStr += "<data><depth><![CDATA[" + rValue[i].departDepth
				+ "]]></depth><label><![CDATA[" + rValue[i].departLabel
				+ "]]></label><value><![CDATA[" + rValue[i].departValue
				+ "]]></value></data>";
	}
	tmpStr += "</list>";
	var tmpDoc = WebSquare.xml.parse(tmpStr);
	var tmpDocArr = WebSquare.xml.findNodes(tmpDoc, "list/data");
	var rid = eval(id);
	var rdataset = eval(dataList);
	rdataset.removeRow(0);
	rid.appendData(0, tmpDocArr);
};
CommonUtil.setOrganTreeviewCodeList = function(id, dataList, searchWord, useAt,
		callbackFnc) {
	var actionUrl = "/" + CommonUtil.getContextName()
			+ "/com/selectOrganTreeviewCodeList.do";
	var searchInfo = {
		"orgNm" : searchWord,
		"useAt" : useAt
	};
	var reqAjaxOptions = {
		"action" : actionUrl,
		"mode" : "synchronous",
		"reqDoc" : {
			"searchInfo" : searchInfo
		},
		"mediatype" : "application/json"
	};
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxErrorCheck(resultAll, "기관코드 모듈")) {
		result = {};
		if (callbackFnc) {
			eval(callbackFnc + '(result)');
		}
		return result;
	}
	var rValue = resultAll.departCodeList;
	console.log("rValue 개수 : " + rValue.length);
	var tmpStr = "<list>";
	for ( var i = 0; i < rValue.length; i++) {
		tmpStr += "<data><depth><![CDATA[" + rValue[i].departDepth
				+ "]]></depth><label><![CDATA[" + rValue[i].departLabel
				+ "]]></label><value><![CDATA[" + rValue[i].departValue
				+ "]]></value></data>";
	}
	tmpStr += "</list>";
	var tmpDoc = WebSquare.xml.parse(tmpStr);
	var tmpDocArr = WebSquare.xml.findNodes(tmpDoc, "list/data");
	var rid = eval(id);
	var rdataset = eval(dataList);
	rdataset.removeRow(0);
	rid.appendData(0, tmpDocArr);
};
CommonUtil.executeBatch = function(jobName, parameter, callbackFnc) {
	var requestData = WebSquare.xml.parse("<map/>");
	var result = requestData.documentElement;
	if (CommonUtil.isNull(jobName)) {
		console.log("jobName invalid");
		return;
	}
	var actionUrl = "/" + CommonUtil.getContextName() + "/com/executeBatch.do";
	var batchInfoList = parameter;
	for ( var i = 0; i < batchInfoList.length; i++) {
		batchInfoList[i].jobName = jobName;
	}
	if (JSON.stringify(batchInfoList) == "{}") {
		batchInfoList = [ {
			jobName : jobName
		} ];
	}
	var reqAjaxOptions = {
		"action" : actionUrl,
		"mode" : "synchronous",
		"reqDoc" : {
			"batchInfoList" : batchInfoList
		},
		"mediatype" : "application/json"
	};
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxErrorCheck(resultAll, "배치실행")) {
		result = {};
		if (callbackFnc) {
			eval(callbackFnc + '(result)');
		}
		return result;
	}
	result = resultAll;
	if (callbackFnc) {
		eval(callbackFnc + '(result)');
	}
	return result;
};
CommonUtil.checkFileExt = function(fileName, allowExt, bAllow) {
	if (CommonUtil.isNull(bAllow)) {
		bAllow = true;
	}
	var fileName = fileName.substring(fileName.lastIndexOf("\\") + 1,
			fileName.length);
	var fileExt = fileName.indexOf(".") > -1 ? fileName.split(".")[fileName
			.split(".").length - 1] : "";
	if (bAllow) {
		if (CommonUtil.isNull(fileExt)) {
			return false;
		}
		if (("," + allowExt.toUpperCase() + ",").indexOf(","
				+ fileExt.toUpperCase() + ",") > -1) {
			return true;
		} else {
			return false;
		}
	} else {
		if (CommonUtil.isNull(fileExt)) {
			return true;
		}
		if (("," + allowExt.toUpperCase() + ",").indexOf(","
				+ fileExt.toUpperCase() + ",") > -1) {
			return false;
		} else {
			return true;
		}
	}
};
CommonUtil.openUserSearchPopup = function(orgCd, closeCallbackFnName, opts,
		site) {
	var url = "/wq/cmm/popup/userSearchPopup.xml";
	var w = "732";
	var h = "502";
	if (typeof opts.searchPtlAthrId != "undefined"
			&& opts.searchPtlAthrId.length > 0) {
		var searchPtlAthrIdStr = opts.searchPtlAthrId.join(",");
	}
	if (typeof opts.searchCondition != "undefined") {
		var searchCondition = opts.searchCondition;
	}
	if (site == 'DPF') {
		w = "902";
		h = "602";
	}
	var dataObj = {
		type : "json",
		name : "rowObj",
		data : {
			site : site,
			orgCd : orgCd,
			searchPtlAthrIdStr : searchPtlAthrIdStr,
			searchCondition : searchCondition
		}
	};
	var options = {
		id : "userSearchPopup",
		type : "window",
		closeCallbackFnc : closeCallbackFnName,
		width : w,
		height : h,
		popupName : "조직구성원 선택팝업",
		modal : true,
		useIFrame : true,
		dataObject : dataObj
	};
	CommonUtil.openPopup(url, options);
};
CommonUtil.openDepartTreeviewCodePopup = function(closeCallbackFnName, site) {
	var url = "/wq/cmm/popup/departTreeviewPopup.xml";
	var w = "732";
	var h = "502";
	if (site == 'DPF') {
		w = "902";
		h = "602";
	}
	var dataObj = {
		type : "json",
		data : {
			site : site
		},
		name : "rowObj"
	};
	var options = {
		id : "departPopup",
		type : "window",
		closeCallbackFnc : closeCallbackFnName,
		width : w,
		height : h,
		popupName : "조직코드Treeview 팝업",
		modal : true,
		useIFrame : true,
		dataObject : dataObj
	};
	CommonUtil.openPopup(url, options);
};
CommonUtil.openOrganTreeviewCodePopup = function(closeCallbackFnName, site) {
	var url = "/wq/cmm/popup/organTreeviewPopup.xml";
	var w = "732";
	var h = "502";
	if (site == 'DPF') {
		w = "902";
		h = "602";
	}
	var dataObj = {
		type : "json",
		data : {
			site : site
		},
		name : "rowObj"
	};
	var options = {
		id : "popupTest",
		type : "window",
		closeCallbackFnc : closeCallbackFnName,
		width : w,
		height : h,
		popupName : "기관코드Treeview 팝업",
		modal : true,
		useIFrame : true,
		dataObject : dataObj
	};
	CommonUtil.openPopup(url, options);
};
CommonUtil.openOrganComboCodePopup = function(closeCallbackFnName, orgCd, site) {
	var url = "/wq/cmm/popup/organCodePopup.xml";
	var w = "732";
	var h = "502";
	if (site == 'DPF') {
		w = "902";
		h = "602";
	}
	var dataObj = {
		type : "json",
		data : {
			site : site
		},
		name : "rowObj",
		orgCd : orgCd
	};
	var options = {
		id : "popupTest",
		type : "window",
		closeCallbackFnc : closeCallbackFnName,
		width : w,
		height : h,
		popupName : "조직코드조회 팝업",
		modal : true,
		useIFrame : true,
		dataObject : dataObj
	};
	CommonUtil.openPopup(url, options);
};
*/
CommonUtil.replaceAll = function(str, searchStr, replaceStr) {
	if (CommonUtil.isNull(str) || CommonUtil.isNull(searchStr)) {
		return str;
	}
	return str.split(searchStr).join(replaceStr);
};

Date.prototype.format = function(f) {
	if (!this.valueOf())
		return " ";
	var weekName = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
	var d = this;
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
		case "yyyy":
			return d.getFullYear();
		case "yy":
			return (d.getFullYear() % 1000).zf(2);
		case "MM":
			return (d.getMonth() + 1).zf(2);
		case "dd":
			return d.getDate().zf(2);
		case "E":
			return weekName[d.getDay()];
		case "HH":
			return d.getHours().zf(2);
		case "hh":
			return ((h = d.getHours() % 12) ? h : 12).zf(2);
		case "mm":
			return d.getMinutes().zf(2);
		case "ss":
			return d.getSeconds().zf(2);
		case "a/p":
			return d.getHours() < 12 ? "오전" : "오후";
		default:
			return $1;
		}
	});
};
String.prototype.string = function(len) {
	var s = '', i = 0;
	while (i++ < len) {
		s += this;
	}
	return s;
};
String.prototype.zf = function(len) {
	return "0".string(len - this.length) + this;
};
Number.prototype.zf = function(len) {
	return this.toString().zf(len);
};



DateUtil.addYearMonthDay = function(sDate, year, month, day) {
	if (CommonUtil.isNull(sDate)) {
		return sDate;
	}
	var dateStr = DateUtil.validChkDate(sDate);
	var retDate = new Date(parseInt(dateStr.substring(0, 4)), parseInt(dateStr
			.substring(4, 6)) - 1, parseInt(dateStr.substring(6, 8)));
	if (!CommonUtil.isNull(year) && year != 0) {
		retDate.setFullYear(retDate.getFullYear() + year);
	}
	if (!CommonUtil.isNull(month) && month != 0) {
		retDate.setMonth(retDate.getMonth() + month);
	}
	if (!CommonUtil.isNull(day) && day != 0) {
		retDate.setDate(retDate.getDate() + day);
	}
	return retDate.format("yyyyMMdd");
};
DateUtil.addYear = function(dateStr, year) {
	return DateUtil.addYearMonthDay(dateStr, year, 0, 0);
};
DateUtil.addMonth = function(dateStr, month) {
	return DateUtil.addYearMonthDay(dateStr, 0, month, 0);
};
DateUtil.addDay = function(dateStr, day) {
	return DateUtil.addYearMonthDay(dateStr, 0, 0, day);
};
DateUtil.getDaysDiff = function(sDate1, sDate2) {
	var dateStr1 = DateUtil.validChkDate(sDate1);
	var dateStr2 = DateUtil.validChkDate(sDate2);
	if (CommonUtil.isNull(sDate1) || CommonUtil.isNull(sDate2)
			|| !DateUtil.checkDate(sDate1) || !DateUtil.checkDate(sDate2)) {
		return null;
	}
	var date1 = new Date(parseInt(dateStr1.substring(0, 4)), parseInt(dateStr1
			.substring(4, 6)) - 1, parseInt(dateStr1.substring(6, 8)));
	var date2 = new Date(parseInt(dateStr2.substring(0, 4)), parseInt(dateStr2
			.substring(4, 6)) - 1, parseInt(dateStr2.substring(6, 8)));
	var timeDiff = date2.getTime() - date1.getTime();
	return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
DateUtil.checkDate = function(sDate) {
	var dateStr = DateUtil.validChkDate(sDate);
	var year = dateStr.substring(0, 4);
	var month = dateStr.substring(4, 6);
	var day = dateStr.substring(6, 8);
	return DateUtil.checkDateYmd(year, month, day);
};
DateUtil.checkDateYmd = function(year, month, day) {
	try {
		var checkDate = new Date(parseInt(year), parseInt(month) - 1,
				parseInt(day));
		if (year + month + day == checkDate.format("yyyyMMdd")) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
};
DateUtil.convertDate = function(sDate, sTime, sFormatStr) {
	var dateStr = DateUtil.validChkDate(sDate);
	var timeStr = DateUtil.validChkTime(sTime);
	if (timeStr.length == 0) {
		timeStr = "000000";
	} else if (timeStr.length == 2) {
		timeStr = timeStr + "0000";
	} else if (timeStr.length == 4) {
		timeStr = timeStr + "00";
	}
	return new Date(parseInt(dateStr.substring(0, 4)), parseInt(dateStr
			.substring(4, 6)) - 1, parseInt(dateStr.substring(6, 8)),
			parseInt(timeStr.substring(0, 2)),
			parseInt(timeStr.substring(2, 4)),
			parseInt(timeStr.substring(4, 6))).format(sFormatStr);
};
DateUtil.formatDate = function(sDate, ch) {
	var dateStr = DateUtil.validChkDate(sDate);
	var str = dateStr.trim();
	var yyyy = "";
	var mm = "";
	var dd = "";
	if (str.length == 8) {
		yyyy = str.substring(0, 4);
		if (yyyy == "0000") {
			return "";
		}
		mm = str.substring(4, 6);
		if (mm == "00") {
			return yyyy;
		}
		dd = str.substring(6, 8);
		if (dd == "00") {
			return yyyy + ch + mm;
		}
		return yyyy + ch + mm + ch + dd;
	} else if (str.length == 6) {
		yyyy = str.substring(0, 4);
		if (yyyy == "0000") {
			return "";
		}
		mm = str.substring(4, 6);
		if (mm == "00") {
			return yyyy;
		}
		return yyyy + ch + mm;
	} else if (str.length == 4) {
		yyyy = str.substring(0, 4);
		if (yyyy == "0000") {
			return "";
		} else {
			return yyyy;
		}
	} else {
		return "";
	}
};
DateUtil.formatTime = function(sTime, ch) {
	var timeStr = DateUtil.validChkTime(sTime);
	return timeStr.substring(0, 2) + ch + timeStr.substring(2, 4) + ch
			+ timeStr.substring(4, 6);
};
DateUtil.leapYear = function(year) {
	if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
		return "29";
	}
	return "28";
};
DateUtil.isLeapYear = function(year) {
	if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
		return false;
	}
	return true;
};
DateUtil.getToday = function() {
	return DateUtil.getCurrentDate("yyyy-MM-dd");
};
DateUtil.getCurrentDate = function(dateType) {
	var nowDate = new Date();
	if (CommonUtil.isNull(dateType)) {
		return nowDate.format("yyyy-MM-dd");
	} else {
		return nowDate.format(dateType);
	}
};
DateUtil.getRandomDate = function(sDate1, sDate2) {
	var dateStr1 = DateUtil.validChkDate(sDate1);
	var dateStr2 = DateUtil.validChkDate(sDate2);
	var date1 = new Date(parseInt(dateStr1.substring(0, 4)), parseInt(dateStr1
			.substring(4, 6)) - 1, parseInt(dateStr1.substring(6, 8)));
	var date2 = new Date(parseInt(dateStr2.substring(0, 4)), parseInt(dateStr2
			.substring(4, 6)) - 1, parseInt(dateStr2.substring(6, 8)));
	return new Date(date1.getTime() + Math.random()
			* (date2.getTime() - date1.getTime())).format("yyyyMMdd");
};
DateUtil.convertWeek = function(sWeek) {
	var retStr = null;
	if (sWeek == "SUN") {
		retStr = "일요일";
	} else if (sWeek == "MON") {
		retStr = "월요일";
	} else if (sWeek == "TUE") {
		retStr = "화요일";
	} else if (sWeek == "WED") {
		retStr = "수요일";
	} else if (sWeek == "THR") {
		retStr = "목요일";
	} else if (sWeek == "FRI") {
		retStr = "금요일";
	} else if (sWeek == "SAT") {
		retStr = "토요일";
	}
	return retStr;
};
DateUtil.validDate = function(sDate) {
	var dateStr = DateUtil.validChkDate(sDate);
	var date = new Date(parseInt(dateStr.substring(0, 4)), parseInt(dateStr
			.substring(4, 6)) - 1, parseInt(dateStr.substring(6, 8)));
	return date && parseInt(dateStr.substring(0, 4)) == date.getFullYear()
			&& parseInt(dateStr.substring(4, 6)) - 1 == date.getMonth()
			&& parseInt(dateStr.substring(6, 8)) == date.getDate();
};
DateUtil.validDateWeek = function(sDate, sWeek) {
	var dateStr = DateUtil.validChkDate(sDate);
	var date = new Date(parseInt(dateStr.substring(0, 4)), parseInt(dateStr
			.substring(4, 6)) - 1, parseInt(dateStr.substring(6, 8)));
	if ((DateUtil.validDate(sDate)) && (sWeek == date.getDay())) {
		return true;
	}
	return false;
};
DateUtil.validTime = function(sTime) {
	var timeStr = DateUtil.validChkTime(sTime);
	if (timeStr.length < 2) {
		return false;
	}
	var hour = parseInt(timeStr.substring(0, 2));
	var minute = parseInt(timeStr.length >= 4 ? timeStr.substring(2, 4) : "00");
	var second = parseInt(timeStr.length >= 6 ? timeStr.substring(4, 6) : "00");
	if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0
			&& second <= 59) {
		return true;
	} else {
		return false;
	}
};
DateUtil.addYMDtoWeek = function(sDate, year, month, day) {
	var dateStr = DateUtil.validChkDate(sDate);
	dateStr = DateUtil.addYearMonthDay(dateStr, year, month, day);
	var retDate = new Date(parseInt(dateStr.substring(0, 4)), parseInt(dateStr
			.substring(4, 6)) - 1, parseInt(dateStr.substring(6, 8)));
	return retDate.getDay();
};
DateUtil.addYMDtoDayTime = function(sDate, sTime, year, month, day, hour,
		minute, second, formatStr) {
	var dateStr = DateUtil.validChkDate(sDate);
	var timeStr = DateUtil.validChkTime(sTime);
	dateStr = DateUtil.addYearMonthDay(dateStr, year, month, day);
	dateStr = DateUtil.convertDate(dateStr, timeStr, "yyyyMMddHHmmss");
	var date = new Date(parseInt(dateStr.substring(0, 4)), parseInt(dateStr
			.substring(4, 6)) - 1, parseInt(dateStr.substring(6, 8)),
			parseInt(timeStr.substring(0, 2)),
			parseInt(timeStr.substring(2, 4)),
			parseInt(timeStr.substring(4, 6)));
	if (hour != 0) {
		date.setHours(date.getHours() + hour);
	}
	if (minute != 0) {
		date.setMinutes(date.getMinutes() + minute);
	}
	if (second != 0) {
		date.setSeconds(date.getSeconds() + second);
	}
	return date.format(formatStr);
};
DateUtil.datetoInt = function(sDate) {
	return parseInt(DateUtil.convertDate(sDate, "000000", "yyyyMMdd"));
};
DateUtil.timetoInt = function(sTime) {
	return parseInt(DateUtil.convertDate("00000101", sTime, "HHmmss"));
};
DateUtil.validChkDate = function(dateStr) {
	if (CommonUtil.isNull(dateStr)
			|| !(dateStr.trim().length == 8 || dateStr.trim().length == 10)) {
		console.log("Invalid date format: " + dateStr);
		return "";
	}
	if (dateStr.length == 10) {
		return CommonUtil.replaceAll(dateStr, "-", "");
	}
	return dateStr;
};
DateUtil.validChkTime = function(timeStr) {
	if (CommonUtil.isNull(timeStr)
			|| !(timeStr.trim().length == 4 || timeStr.trim().length == 5
					|| timeStr.trim().length == 6 || timeStr.trim().length == 8)) {
		console.log("Invalid time format: " + timeStr);
		return "";
	}
	if (timeStr.length == 5 || timeStr.length == 8) {
		timeStr = CommonUtil.replaceAll(timeStr, ":", "");
	}
	if (timeStr.length == 4) {
		timeStr = timeStr + "00";
	}
	if (timeStr.length != 6) {
		console.log("Invalid time format: " + timeStr);
		return "";
	}
	return timeStr;
};
DateUtil.getCurrentServerDate = function(formatStr, bDateType) {
	if (CommonUtil.isNull(formatStr)) {
		formatStr = "yyyyMMdd";
	}
	if (bDateType == undefined || bDateType == null || bDateType == false) {
		return $w.getCurrentServerDate(formatStr);
	} else {
		var strDate = $w.getCurrentServerDate("yyyyMMddhhmmss");
		return new Date(parseInt(strDate.substring(0, 4)), parseInt(strDate
				.substring(4, 6)) - 1, parseInt(strDate.substring(6, 8)),
				parseInt(strDate.substring(8, 10)), parseInt(strDate.substring(
						10, 12)), parseInt(strDate.substring(12, 14)));
	}
};

CommonUtil.fillZeroAreaCode = function(code) {
	if(code == null) return "";
	var zero = '';
	if (CommonUtil.isNull(code)) 

	while(true){
		if (code.length >= 10) break;
		code += "0"
	}
	return code;
};

CommonUtil.getAreaCodeList = function(type, depth, parentCode, gjsiAt, natdrcAt, agncAt, sortAt, addSidoAt) {
	/*
	var requestData = WebSquare.xml.parse("<map/>");
	var result = requestData.documentElement;
	*/
	var result = {};
	
	if (type.toUpperCase() != 'GOV' && type.toUpperCase() != 'LAW') {
		console.log("type 이 유효한 값이 아닙니다.(type:" + type + ")");
		//return WebSquare.json.XML2JSONString(result);
		return result;
	}
	if (depth != 1 && depth != 2 && depth != 3 && !(depth == 4 && type == 'LAW')) {
		console.log("depth 가 유효한 값이 아닙니다.(depth:" + depth + ")");
		//return WebSquare.json.XML2JSONString(result);
		return result;
	}
	if (depth > 1 && (CommonUtil.isNull(parentCode))) {
		console.log("parentCode 가 유효한 값이 아닙니다. (parentCode:" + parentCode + ")");
		//return WebSquare.json.XML2JSONString(result);
		return result;
	}
	var actionUrl = "/" + CommonUtil.getContextName() + "/com/retrieveAreaCodeList.do";
	var searchInfo = {
		"type"       : type,
		"depth"      : depth,
		"parentCode" : parentCode,
		"gjsiAt"     : CommonUtil.nvl(gjsiAt,    ''),
		"natdrcAt"   : CommonUtil.nvl(natdrcAt,  ''),
		"agncAt"     : CommonUtil.nvl(agncAt,    ''),
		"sortAt"     : CommonUtil.nvl(sortAt,    ''),
		"addSidoAt"  : CommonUtil.nvl(addSidoAt, '')
	};
	var reqAjaxOptions = {
		"action"    : actionUrl,
		"mode"      : "synchronous",
		"reqDoc"    : {"searchInfo" : searchInfo},
		"mediatype" : "application/json"
	};
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxErrorCheck(resultAll, "지역코드 모듈")) {
		result = {};
		return result;
	}
	
	/*
	var sResult = resultAll.areaCodeList;
	for (var i = 0; i < sResult.length; i++) {
		var str = "<map>" + "<areaCode><![CDATA[" + sResult[i].areaCode + "]]></areaCode>" + "<areaName><![CDATA[" + sResult[i].areaName + "]]></areaName>" + "<useAt><![CDATA[" + sResult[i].useAt + "]]></useAt>" + "</map>";
		WebSquare.xml.appendChild(result, WebSquare.xml.parse(str).documentElement);
	}
	result = JSON.parse(WebSquare.json.XML2JSONString(WebSquare.xml.parse(result)));
	if (CommonUtil.isNull(result)) {
		result = {};
	}
	*/
	result = resultAll.areaCodeList;
	return result;
};
/*
 * CommonUtil.getGjsiAt = function(type, areaCode) { var requestData =
 * WebSquare.xml.parse("<map/>"); var result = requestData.documentElement; var
 * actionUrl = "/" + CommonUtil.getContextName() + "/com/retrieveGjsiAt.do"; var
 * searchInfo = { "type" : type, "areaCode" : areaCode }; var reqAjaxOptions = {
 * "action" : actionUrl, "mode" : "synchronous", "reqDoc" : { "searchInfo" :
 * searchInfo }, "mediatype" : "application/json" }; var resultAll =
 * CommonUtil.ajaxRequest(reqAjaxOptions); if
 * (!CommonUtil.ajaxErrorCheck(resultAll, "지역코드 모듈")) { result = {}; return
 * result; } return resultAll.gjsiAt; };
 */
CommonUtil.setAreaCodeList = function(type, depth, parentCode, useAt, selectBoxId, headItemLabel, headItemValue, value, gjsiAt, natdrcAt, agncAt, sortAt, addSidoAt) {
	if (isSkipAreaCodeHandleChange == true) return;
	isSkipAreaCodeHandleChange = true;
	
	if (depth > 1 && (CommonUtil.isNull(parentCode))) {
		selectBoxId.removeAll();
		isSkipAreaCodeHandleChange = false;
		return;
	}
	
	var jsonData = CommonUtil.getAreaCodeList(type, depth, parentCode, gjsiAt, natdrcAt, agncAt, sortAt, addSidoAt);
	if (!CommonUtil.isNull(value)) {
		if (depth == 1) {
			value = value.substring(0, 2);
		}
		else if (depth == 2) {
			if (CommonUtil.getGjsiAt(type, value) == 'Y') {
				value = value.substring(0, 4);
			}
			else {
				value = value.substring(0, 5);
			}
		}
		else if (depth == 3) {
			value = value.substring(0, 8);
		}
	}
	CommonUtil.setJsonToControl(selectBoxId, jsonData, true, headItemLabel, headItemValue, value, "areaName", "areaCode", "useAt", useAt, "combo");
	isSkipAreaCodeHandleChange = false;
};

/*
 * CommonUtil.openBdongCodePopup = function(closeCallbackFnName, site) { var url =
 * "/wq/cmm/popup/bdongCodePopup.xml"; var w = "732"; var h = "502"; if (site ==
 * 'DPF') { w = "902"; h = "602"; } var dataObj = { type : "json", data : { site :
 * site }, name : "rowObj" }; var options = { id : "bdongPopup", type :
 * "window", closeCallbackFnc : closeCallbackFnName, width : w, height : h,
 * popupName : "법정동 코드", modal : true, useIFrame : true, dataObject : dataObj };
 * CommonUtil.openPopup(url, options); };
 */

CommonUtil.openAddrPopup = function(type, closeCallbackFnName, site, isClosedOtherTab, isDetailTab, fixParam, isMapTab, sortAt) {
	var url = "/idsiSFK/neo/cmm/popup/addressPopup.jsp";
	var w = "732";
	var h = "522";
	if (site == 'DPF') {
		w = "902";
		h = "602";
	}
	if (CommonUtil.isNull(fixParam)) {
		fixParam = {
			hdongCd  : '',
			bdongCd  : '',
			roadCd   : '',
			isFixed  : false,
			mntnAt   : '',
			landNum  : '',
			landNum2 : ''
		};
	} 
	else {
		fixParam = {
			hdongCd  : CommonUtil.nvl(fixParam.hdongCd,  ''),
			bdongCd  : CommonUtil.nvl(fixParam.bdongCd,  ''),
			roadCd   : CommonUtil.nvl(fixParam.roadCd,   ''),
			isFixed  : CommonUtil.nvl(fixParam.isFixed,  true),
			mntnAt   : CommonUtil.nvl(fixParam.mntnAt,   '0'),
			landNum  : CommonUtil.nvl(fixParam.landNum,  ''),
			landNum2 : CommonUtil.nvl(fixParam.landNum2, '')
		};
	}
	var dataObj = {
		type : "json",
		data : {
			type             : type,
			site             : site,
			isClosedOtherTab : isClosedOtherTab,
			isDetailTab      : isDetailTab,
			fixParam         : fixParam,
			isMapTab         : isMapTab,
			sortAt           : sortAt || ""
		},
		name : "rowObj"
	};
	var options = {
		id : "addrPopup",
		type : "window",
		closeCallbackFnc : closeCallbackFnName,
		width : w,
		height : h,
		popupName : "주소 찾기",
		modal : true,
		useIFrame : true,
		dataObject : dataObj
	};
	CommonUtil.openPopup(url, options);
};
/*
CommonUtil.getRoadAddrInfo = function(roadAddrCode) {
	var requestData = WebSquare.xml.parse("<map/>");
	var result = requestData.documentElement;
	var actionUrl = "/" + CommonUtil.getContextName()
			+ "/com/retrieveRoadAddrInfo.do";
	var searchInfo = {
		"roadAddrCode" : roadAddrCode,
	};
	var reqAjaxOptions = {
		"action" : actionUrl,
		"mode" : "synchronous",
		"reqDoc" : {
			"searchInfo" : searchInfo
		},
		"mediatype" : "application/json"
	};
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxErrorCheck(resultAll, "주소 모듈")) {
		result = {};
		return result;
	}
	return resultAll.address;
};
CommonUtil.getLandAddrInfo = function(RNU) {
	var requestData = WebSquare.xml.parse("<map/>");
	var result = requestData.documentElement;
	var actionUrl = "/" + CommonUtil.getContextName()
			+ "/com/retrieveLandAddrInfo.do";
	var searchInfo = {
		"lawAreaCode" : RNU.substr(0, 10),
		"mntnAt" : (RNU.substr(10, 1) == '2' ? '1' : '0'),
		"landNum" : Number(RNU.substr(11, 4)).toString(),
		"landNum2" : Number(RNU.substr(15, 4)).toString()
	};
	var reqAjaxOptions = {
		"action" : actionUrl,
		"mode" : "synchronous",
		"reqDoc" : {
			"searchInfo" : searchInfo
		},
		"mediatype" : "application/json"
	};
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxErrorCheck(resultAll, "주소 모듈")) {
		result = {};
		return result;
	}
	return resultAll.address;
};
CommonUtil.goSSOoutUrl = function(destSystemId, baseUrlParam, target, options,
		base64Encoding) {
	var baseSSOParam = "/SSOLegacy.do?pname=spSessionData&app_id="
			+ destSystemId + "&loginProcUrl=";
	var prcUrlParam = "";
	if (typeof base64Encoding == "undefined") {
		prcUrlParam = encodeURI(baseUrlParam);
		prcUrlParam = prcUrlParam.replace(/&/gi, "|");
	} else {
		prcUrlParam = WebSquare.text.BASE64URLEncoder(baseUrlParam);
		prcUrlParam = prcUrlParam.replaceAll('%0A', '');
		prcUrlParam = prcUrlParam.replaceAll('%3D', '');
	}
	var fullSSOUrl = "/" + CommonUtil.getContextName() + baseSSOParam
			+ prcUrlParam;
	if (CommonUtil.isNull(target)) {
		top.location.href = fullSSOUrl;
	} else {
		if (CommonUtil.isNull(options))
			options = "scrollbars=yes,resizable=yes,menubar=yes,status=yes,toolbar=yes";
		window.open(fullSSOUrl, target, options);
	}
};
CommonUtil.getParametersFromString = function(paramString) {
	var params = {};
	var strParamsString = "";
	var arrParamsString = paramString.split("?");
	if (arrParamsString.length == 2)
		strParamsString = arrParamsString[1];
	else
		strParamsString = paramString;
	var arrParams = strParamsString.split("&");
	for ( var i = 0; i < arrParams.length; i++) {
		var arrParamTemp = arrParams[i].split("=");
		if (arrParamTemp.length == 2) {
			params[arrParamTemp[0]] = arrParamTemp[1];
		}
	}
	console.log(">>> params = " + params);
	return params;
}
*/
CommonUtil.openOrgCodePopup = function(closeCallbackFnName, options) {
	var url = "/idsiSFK/neo/cmm/popup/orgCodePopup.jsp";
	var w = "850";
	var h = "710";
	var popupName = "기관 검색";
	var dataObj = {
		type : "json",
		name : "rowObj",
		data : {
			reprsntOrgCd    : options.reprsntOrgCd || "",
			searchCondition : options.searchCondition || "1",
			searchKeyword   : options.searchKeyword || "",
			sort            : options.sort || "1"
		}
	};
	var popupOptions = {
		id               : "orgCodePopup",
		type             : "window",
		closeCallbackFnc : closeCallbackFnName,
		width            : w,
		height           : h,
		popupName        : popupName,
		modal            : true,
		useIFrame        : true,
		dataObject       : dataObj
	};
	CommonUtil.openPopup(url, popupOptions);
};
/*
CommonUtil.getFllOrgNm = function(orgCd) {
	var requestData = WebSquare.xml.parse("<map/>");
	var result = requestData.documentElement;
	var actionUrl = "/" + CommonUtil.getContextName()
			+ "/com/org/retrieveFllOrgNm.do";
	var searchInfo = {
		"orgCd" : orgCd
	};
	var reqAjaxOptions = {
		"action" : actionUrl,
		"mode" : "synchronous",
		"reqDoc" : {
			"searchInfo" : searchInfo
		},
		"mediatype" : "application/json"
	};
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxErrorCheck(resultAll, "기관코드 모듈")) {
		result = {};
		return result;
	}
	return resultAll.fllOrgNm;
};
*/
CommonUtil.openOrganListCodePopup = function(closeCallbackFnName, options, site) {
	var options2 = {
		reprsntOrgCd : options.searchDt || "",
		searchCondition : options.searchGb || "1",
		searchKeyword : ""
	};
	CommonUtil.openOrgCodePopup(closeCallbackFnName, options2);
};
/*
CommonUtil.openOnOrganListCodePopup = function(closeCallbackFnName, orgCd, site) {
	data = JSON.parse(sessionStorage.getItem("idsiSession"));
	var options2 = {
		isReprsntOrg : "Y",
		searchKeyword : data.searchDt || "",
		sort : "1"
	};
	CommonUtil.openOrgCodePopup(closeCallbackFnName, options2);
};
SessionUtil.getMenuLevelList = function() {
	var menuLevelList = JSON.parse(sessionStorage.getItem("menuLevelList"));
	return menuLevelList;
}
CommonUtil.getNavigationPath = function(startLevel, dispViewNameGb) {
	debugger
	if (CommonUtil.isNull(startLevel))
		startLevel = 0;
	var strNavigatonPath = "";
	var menuLevelList = SessionUtil.getMenuLevelList();
	if (!CommonUtil.isNull(menuLevelList)) {
		for (ii = startLevel; ii < menuLevelList.length; ii++) {
			try {
				if (dispViewNameGb == "N" && menuLevelList[ii].menuTyValue == 2) {
				} else
					strNavigatonPath += " > " + menuLevelList[ii].menuNm;
			} catch (e) {
				console.log("err : " + e.message);
			}
		}
	}
	console.log("result : " + strNavigatonPath);
	return strNavigatonPath;
}
CommonUtil.confirmLongWork = function(strMsg, alertGb) {
	if (CommonUtil.isNull(strMsg))
		strMsg = "10초이상 시간이 많이 걸리는 작업입니다. 계속 하시겠습니까?";
	if (!confirm(strMsg)) {
		if (alertGb == "Y")
			alert("작업을 취소합니다.");
		return false;
	}
	return true;
}
*/

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* websquare 제거 필요*/
CommonUtil.getSFKAreaCodeList = function(type, depth, parentCode, gjsiAt,natdrcAt, agncAt, sortAt) {

	if (type.toUpperCase() != 'GOV' && type.toUpperCase() != 'LAW') {
		console.log("type 이 유효한 값이 아닙니다.(type:" + type + ")");
		return {};
	}
	
	if (depth != 1 && depth != 2 && depth != 3 && !(depth == 4 && type == 'LAW')) {
		console.log("depth 가 유효한 값이 아닙니다.(depth:" + depth + ")");
		return {};
	}
	
	if (depth > 1 && (CommonUtil.isNull(parentCode))) {
		console.log("parentCode 가 유효한 값이 아닙니다. (parentCode:" + parentCode + ")");
		return {};
	}
	
	var actionUrl = "/" + CommonUtil.getContextName() + "/sfk/com/retrieveAreaCodeList.do";
	var searchInfo = {
		"type"       : type,
		"depth"      : depth,
		"parentCode" : parentCode,
		"gjsiAt"     : CommonUtil.nvl(gjsiAt, ''),
		"natdrcAt"   : CommonUtil.nvl(natdrcAt, ''),
		"agncAt"     : CommonUtil.nvl(agncAt, ''),
		"sortAt"     : CommonUtil.nvl(sortAt, '')
	};
	
	var reqAjaxOptions = {
		"action" : actionUrl,
		"mode" : "synchronous",
		"reqDoc" : {
			"searchInfo" : searchInfo
		},
		"mediatype" : "application/json"
	};
	
	var resultAll = CommonUtil.ajaxRequest(reqAjaxOptions);
	if (!CommonUtil.ajaxSFKErrorCheck(resultAll, "지역코드 모듈")) {
		if (callbackFnc) {
//			eval(callbackFnc + '(result)')
			window[callbackFnc](result);
		}
		return {};
	}
	
	return resultAll.areaCodeList;
};

CommonUtil.setSFKAreaCodeList = function(type, depth, parentCode, useAt, selectBoxId, headItemLabel, headItemValue, value, gjsiAt, natdrcAt, agncAt, sortAt, addSidoAt) {
	if (isSkipAreaCodeHandleChange == true) return

	isSkipAreaCodeHandleChange = true

	if (depth > 1 && (CommonUtil.isNull(parentCode))) {
		isSkipAreaCodeHandleChange = false;
		return
	}
	
	var jsonData = CommonUtil.getSFKAreaCodeList(type, depth, parentCode, gjsiAt, natdrcAt, agncAt, sortAt, addSidoAt);
	
	if (!CommonUtil.isNull(value)) {
		if (depth == 1) {
			value = value.substring(0, 2)
		} 
		else if (depth == 2) {
			if (gjsiAt == 'N') {
				value = value.substring(0, 5)
			} 
			else {
				value = value.substring(0, 4)
			}
		} 
		else if (depth == 3) {
			value = value.substring(0, 8)
		}
	}
	
	CommonUtil.setJsonToControl(selectBoxId, jsonData, true, headItemLabel, headItemValue, value, "areaName", "areaCode", "useAt", useAt, "combo");
	isSkipAreaCodeHandleChange = false
};
