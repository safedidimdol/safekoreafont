//******************************************************************************************
// global
//******************************************************************************************
if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

if(!String.prototype.replaceAll){
	String.prototype.replaceAll = function(searchStr, replaceStr){
		return this.split(searchStr).join(replaceStr)
	};
}

if(!String.format) {
	String.format = function(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function(match, number) { 
												return typeof args[number] != 'undefined' ? args[number] : match;
	                                       }
		        );
	};
}

function getStringByteLength(str){
    var codeByte = 0;
    for (var idx = 0; idx < str.length; idx++) {
        var oneChar = escape(str.charAt(idx));
        if ( oneChar.length == 1 ) codeByte ++;
        else if (oneChar.indexOf("%u") != -1) codeByte += 2;
        else if (oneChar.indexOf("%")  != -1) codeByte ++;
    }
    return codeByte;
}


function isNull(value){
	if(value == "") return false;
	if(value) return false;
	return true;
}

function isValidDate(dt){
	if(dt == undefined) return false;
	dt = dt.replaceAll("-", "");
	if(dt.length != 8) return false;
	var y = dt.substring(0, 4);
	var m = dt.substring(4, 6);
	var d = dt.substring(6, 8);
	if(parseInt(y) < 1900) return false;
	if(parseInt(m) < 1 ) return false;
	if(parseInt(m) > 12) return false;
	if(parseInt(d) < 1 ) return false;
	if(parseInt(d) > 31) return false;
	return true;
}

function toFormattedNumber(num, decimalPoint){
	if(isNaN(num)) return num;

	num += "";
	var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(num))
        num = num.replace(pattern, "$1,$2");
    return num;
    
    /*
    var pointChar = ".";
	var commaChar = ",";

	num = parseFloat(num);
	var decimalPoint = isNaN(decimalPoint = Math.abs(decimalPoint)) ? 2 : decimalPoint;
	var sign = num < 0 ? "-" : "";
	var i = String(parseInt(num = Math.abs(Number(num) || 0).toFixed(decimalPoint)));
	var j = (j = i.length) > 3 ? j % 3 : 0;
	return sign + (j ? i.substr(0, j) + commaChar : "") + i.substr(j).replace(/(\{3})(?=\pointChar)/g, "$1" + commaChar) + (decimalPoint ? pointChar + Math.abs(num - i).toFixed(decimalPoint).slice(2) : "");
	*/
};


function neoSafeKoreeaFormat(value, format){
	if(value  === undefined) return "";
	if(format === undefined) return value;
	if(format.length == 0  ) return value;
	
	if(format == "######-#######"){ // 주민번호
		if(value.length < 6) return value;
		return value.substring(0,6) + "-" + value.substring(6,13);
	}
	if(format.toLowerCase("") == "yyyy-mm-dd" || format.toLowerCase("") == "####-##-##"){ // 일자
		if(value.length < 8) return value;
		if(value.length > 8) value = value.replaceAll("-", "");
    	return value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8);
	}
	if(format == "####-####"){ // 방재대책대행자 관련 인증서번호
		if(value.length < 4) return value;
		return value.substring(0,4) + "-" + value.substring(4,8);
	}
	if(format.charAt(0) == '#' && format.indexOf(",") >= 0){
		if(format.indexOf(".") < 0){
			return toFormattedNumber(value, 0);
		}
		var p = format.substring(format.indexOf(".")+1);
		return toFormattedNumber(value, p.length);
	}
	if(format == "########-###-####-#"){ // 증명서 발급번호
		if(value.length < 16) return value;
		return value.substring(0,8) + "-" + value.substring(8,11) + "-" + value.substring(11,15) + "-" + value.substring(15,16);
	}
	
	return value;
}

function neoSafeKoreeaUnFormat(value, format){
	if(value  === undefined) return "";
	if(format === undefined) return value;
	if(format.length == 0  ) return value;
	
	if(format == "######-#######"){ // 주민번호
		return value.replaceAll("-", "");
	}
	if(format.toLowerCase("") == "yyyy-mm-dd" || format.toLowerCase("") == "####-##-##"){ // 일자
		return value.replaceAll("-", "");
	}
	if(format == "####-####"){ // 방재대책대행자 관련 인증서번호
		return value.replaceAll("-", "");
	}
	if(format.charAt(0) == '#' && format.indexOf(",") >= 0){
		return value.replaceAll(",", "");
	}
	return value;
}

function getTdTextWidth(td){
	var txt = $(td).html();
	$(td).append('<span id="safekorea_text_ruler" style="display:none"></span>');
    var ruler = $("#safekorea_text_ruler");
    ruler.html(txt);
    var len = ruler.width();
//    ruler.children().remove();
    ruler.remove();
    return len;
}

function neoSafeKoreaShowIng(){
	var _W = 295;
	var _H = 83;
	
	var brWidth = window.innerWidth  ? window.innerWidth  : document.documentElement.clientWidth  ? document.documentElement.clientWidth  : screen.width;
	var brHeight= window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
	var _X = ((brWidth  / 2) - (_W / 2)) + (CommonUtil.isNull(window.pageXOffset) ? window.document.documentElement.scrollLeft : window.pageXOffset);
	var _Y = ((brHeight / 2) - (_H / 2)) + (CommonUtil.isNull(window.pageYOffset) ? window.document.documentElement.scrollTop  : window.pageYOffset);

	var loadingHtml = "<div tabindex=\"1\" class=\"w2modal modal\" id=\"__neoIngBar1\" style=\"left:0px; top:0px; display:block; visibility:visible; z-index:10000; background-color:rgb(17, 34, 51);\"></div>" 
	                + "<div id=\"__neoIngBar2\" style=\"left:" + _X + "px; top:" + _Y + "px; width:" + _W + "px; height:" + _H + "px; overflow:hidden; display:block; visibility:visible; position:absolute; z-index:10001;\">"
	                + "    <iframe id=\"__neoIngBar3\" src=\"/idsiSFK/neo/processMsg.html\" frameborder=\"0\" scrolling=\"no\" style=\"left:0px; top:0px; width:" + _W + "px; height:" + _H + "px; position:absolute;\" allowtransparency=\"true\"></iframe>"
	                + "</div>";
	$("body").append(loadingHtml);
}
function neoSafeKoreaHideIng(){
	$("#__neoIngBar1").remove();
	$("#__neoIngBar2").remove();
}



//******************************************************************************************
// prototype
//******************************************************************************************


Date.prototype.format = function(f) {
	if (!this.valueOf()) return " ";
	var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
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

//******************************************************************************************
//
var __notProcessedDataObjectIdList = [];




// 내부적으로만 사용
// 처리되지 않은 DATALIst에 대한 처리
// ref 처리 (set default value,   & onchange
function doRelDataObjectProcess(dataObj){
	//ref="data:dm_searchInfo.selMenuVal"
	var jQryObjects = $("[ref^='data:" + dataObj.id + ".']");

	for(var i=0; i<jQryObjects.length; i++){
		var obj = jQryObjects[i];
		var ref = $(obj).attr("ref");
		var obj_key = ref.replace("data:", "").split(".");
		if(obj_key.length != 2) return;

		obj.dataObj = dataObj;
		obj.dataKey = obj_key[1];

		// setvalue
		obj.setValue(obj.dataObj.get(obj.dataKey));

		// onchange
		if(obj.tagName == "INPUT" || obj.tagName == "TEXTAREA" || obj.tagName == "SELECT"){
			if(obj.onchange) obj.orgOnChange = obj.onchange;
			obj.onchange = function(e){
				this.dataObj.set(this.dataKey, this.getValue());
				if(this.orgOnChange) this.orgOnChange(e);
			}
		}
	}
}

function __isExistNotProcessedDataObjectList(id){
	for(var i=0; i<__notProcessedDataObjectIdList.length; i++){
		if(id==__notProcessedDataObjectIdList[i]) return true;
	}
	return false;
}


//******************************************************************************************

//******************************************************************************************
// DataMap / DataList 초기화
function safeKoreaEngineInitializeDataMap(dataMapList){
	for(var i=0; i<dataMapList.length; i++){
		var dataMap = dataMapList[i];
		var isNotProc = __isExistNotProcessedDataObjectList(dataMap.id);

		NeoSafeKoreaDataMap.call(dataMap);
		
		if(isNotProc){
			doRelDataObjectProcess(dataMap);
		}
	}
}

function safeKoreaEngineInitializeDataList(dataListList){
	for(var i=0; i<dataListList.length; i++){
		var dataList = dataListList[i];
		NeoSafeKoreaDataList.call(dataList);
	}
}

function safeKoreaEngineInitializeSubmission(submissionList){
	for(var i=0; i<submissionList.length; i++){
		var submission = submissionList[i];
		NeoSafeKoreaSubmission.call(submission);
	}
}


//******************************************************************************************
// 파라메터에 parent를 추가하여 default가 body가 되어 시작할 수 있도록

function safeKoreaInitializeHtmlObject(obj){
	obj.userData = {};
	
	obj.getRefInfo = function(){
		var ref = $(obj).attr("ref");
		if(ref == undefined) return;
		
		var obj_key = ref.replace("data:", "").split(".");
		if(obj_key.length != 2) return;

		if(window[obj_key[0]] == undefined) return;
		
		return {dataObject:window[obj_key[0]], key:obj_key[1]};
	}	
	
	//
	obj.addClass = function(klass){
		$(this).addClass(klass);
	};
	//
	obj.removeClass = function(klass){
		$(this).removeClass(klass);
	};
	
	obj.setStyle = function(prop, style){
		$(this).css(prop, style);
	};
	
	obj.hide = function(){
		$(this).hide();
	};
	
	obj.show = function(){
		$(this).show();
	};

	obj.setUserData = function(key, value){
		obj.userData[key] = value;
	};
		
	obj.getUserData = function(key, value){
		return obj.userData[key];
	};
	
	obj.visible = function(isVisible){
		isVisible ? $(obj).show() : $(obj).hide();
	}
	
	obj.setDisabled = function(isDisabled){
		if(isDisabled){
			$(obj).attr("disabled", "disabled");
			$(obj).find("input").attr("disabled", "disabled");
			$(obj).find("a").attr("disabled", "disabled");
		}
		else {
			$(obj).removeAttr("disabled");
			$(obj).find("input").removeAttr("disabled");
			$(obj).find("a").removeAttr("disabled");
		}
	}

	if(obj.tagName == "IMG"){
		obj.setSrc = function(newSrc){
			$(this).attr("src",newSrc);
		};

		obj.getSrc = function(){
			return $(this).attr("src");
		};
		
		obj.setValue = function(val){
			this.setSrc(val);
		};
	}
	
	//generator 처리
	if($(obj).attr("xtag") == "generator"){
		NeoSafeKoreaGenerator.call(obj);
		return;
	}
	
	if(obj.tagName == "SPAN" || obj.tagName == "DIV" || obj.tagName == "TD" || obj.tagName == "A" || obj.tagName == "H4" || obj.tagName == "H3" || obj.tagName == "H2"){
		
		if(obj.tagName == "DIV"){
			obj.setSize = function(width, height){
				if(width ) $(obj).width (width);
				if(height) $(obj).height(height);
			};
		}
		
		if(obj.tagName == "DIV" && $(obj).attr("xtag") == "mdi"){
			NeoSafeKoreaMDI.call(obj);			
			return;
		}
		
		if((obj.tagName == "DIV" || obj.tagName == "SPAN") && $(obj).attr("xtag") == "radioSelect"){
			NeoSafeKoreaRadioSelect.call(obj);			
			return;
		}
		
		if((obj.tagName == "DIV" || obj.tagName == "SPAN") && $(obj).attr("xtag") == "checkboxSelect"){
			NeoSafeKoreaCheckboxSelect.call(obj);			
			return;
		}
		
		obj.setLabel = function(val)  {
			this.setValue(val);
		};
	
		obj.setValue = function(val)  {
			var format          = $(obj).attr("displayFormat");
			var textBeforeValue = $(obj).attr("textBeforeValue");
			var textAfterValue  = $(obj).attr("textAfterValue");
			
			if(val== undefined) val = "";
			if(isNull(format         ) == false) val = neoSafeKoreeaFormat(val, format);
			if(isNull(textBeforeValue) == false) val = textBeforeValue + val;
			if(isNull(textAfterValue ) == false) val = val + textAfterValue;
			
			if($(obj).attr("xtag") == "radio"){
				$(obj).attr("value", val);
				var $chk = $(obj).find("input[type='radio'][checkedValue='" + val + "']");
				if($chk.length > 0) $chk[0].checked = true;
				return;
			}
			
			this.innerHTML = val;
		};
		
		
		if($(obj).attr("xtag") == "radio"){
			obj.originOnChange = obj.onchange;
			obj.onchange = null;
			$(obj).on("change", function(e){
				var refInfo = this.getRefInfo();
				if(refInfo){
					if(refInfo.dataObject.get(refInfo.key) == this.getValue()) return;
					refInfo.dataObject.set(refInfo.key, this.getValue());
				}
				if(obj.originOnChange) obj.originOnChange(e);
			});
		}
		
		obj.getValue = function(val)  { 
			if($(obj).attr("xtag") == "radio"){
				var $chk = $(obj).find("input[type='radio']:checked");
				return $chk.attr("checkedValue");
			}
			
			var format = $(obj).attr("displayFormat");
			var val = this.innerHTML;
			if(isNull(format) == false) val = neoSafeKoreeaUnFormat(val, format);
			return val; 
		};

		obj.setHref  = function(href) {
			if(obj.tagName == "A"){
				$(obj).attr("href", href);
			}
			else {
				this.innerHTML = "<a href='" + href + "'>" + this.innerHTML + "</a>"; 
			}
		}
		
		obj.removeAll = function(){
			$(obj).html(""); 
		}
		
		if(obj.tagName == "DIV" && $(obj).attr("xtag") == "frame"){
			obj.setSrc = function(subUrl){
				var tgtChildren = $(this).children().remove();
				tgtChildren.remove();
				
				var request = $.ajax({
			    	  url : subUrl, type: "get", async : false
				});
				this.innerHTML = request.responseText;
				safeKoreaInitializeHtmlObjectChild($(obj));

				var orgDiv = document.createElement('div');
				orgDiv.innerHTML = request.responseText;
				
				var scripts = orgDiv.getElementsByTagName('script');
				for (var ix = 0; ix < scripts.length; ix++) {
					var scriptDiv = document.createElement('div');
					var script = document.createElement('script');
					script.innerHTML = scripts[ix].text;
					scriptDiv.appendChild(script);
					$("body").append(scriptDiv);
				}
				$(orgDiv).remove();
			};
		}
		
		if(obj.tagName == "DIV" && $(obj).attr("xtag") == "pageNavi"){
			NeoSafeKoreaPaging.call(obj);			
		}
		
		if($(obj).attr("xtag") == "upload"){
			//upload 처리
			NeoSafeKoreaUpload.call(obj);
		}
		if(obj.tagName == "DIV" && $(obj).attr("xtag") == "gridView"){
			//gridview 처리
			NeoSafeKoreaGridView.call(obj);
		}
		if(obj.tagName == "DIV" && $(obj).attr("xtag") == "treeview"){
			//gridview 처리
			NeoSafeKoreaTreeView.call(obj);
		}
		if(obj.tagName == "DIV" && $(obj).attr("xtag") == "tabControl"){
			//tabControl 처리
			NeoSafeKoreaTabControl.call(obj);
		}
	}

	if(obj.tagName == "INPUT" || obj.tagName == "TEXTAREA" || obj.tagName == "SELECT"){
		if(obj.tagName == "INPUT" && $(obj).attr("type") == "text" && isNull($(obj).attr("notAllowChar")) == false){
			var notAllowChar = $(obj).attr("notAllowChar");
			obj.notAllowChar = notAllowChar.replace("0-9", "01234567789").replace("a-z", "abcdefghijklmnopqrstuvwxyz").replace("A-Z", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
			$(obj).on("keydown", function(e){
				if(e.key.length > 1) return;
				if(this.notAllowChar.indexOf(e.key) == -1) return;
				if(e.preventDefault){
			        e.preventDefault();
			    }
				else{
			        e.returnValue = false;
			    }
			});
		}
		if(obj.tagName == "INPUT" && $(obj).attr("type") == "text" && isNull($(obj).attr("allowChar")) == false){
			var allowChar = $(obj).attr("allowChar");
			obj.allowChar = allowChar.replace("0-9", "01234567789").replace("a-z", "abcdefghijklmnopqrstuvwxyz").replace("A-Z", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
			obj.isKorean = false;
			$(obj).on("compositionstart", function(e){
				this.isKorean = true;
			});
			
			$(obj).on("compositionend", function(e){
				this.isKorean = false;
				var str = this.value;
				var val = "";
			    for (var idx = 0; idx < str.length; idx++) {
			        var oneChar = escape(str.charAt(idx));
			        if (oneChar.indexOf("%u") != -1) continue;
			        val += str.charAt(idx);
			    }
		        this.value = val;
			});
			
			$(obj).on("keydown", function(e){
				if(e.key.length > 1) return;
				if(this.isKorean == false && this.allowChar.indexOf(e.key) >= 0) return;
				if(e.preventDefault){
			        e.preventDefault();
			    }
				else{
			        e.returnValue = false;
			    }
			});
			
			$(obj).on("blur", function(e){
				var str = this.value;
				var val = "";
			    for (var idx = 0; idx < str.length; idx++) {
			        var oneChar = escape(str.charAt(idx));
			        if (oneChar.indexOf("%u") != -1) continue;
			        val += str.charAt(idx);
			    }
			    if(isNull($(this).attr("displayFormat")) == false) {
			    	val = this.getValue();
			    	val = neoSafeKoreeaFormat(val, $(this).attr("displayFormat"));
			    }
		        this.value = val; 
			});
		}
		
		if(obj.tagName == "TEXTAREA"){
			obj.setHTML = function(html){
				$(obj).val(html);
			};
			
			if($(obj).attr("xtag") == "webEditor"){
				initWebEditor();
			}
			if($(obj).attr("xtag") == "smartEditor"){
				NeoSafeKoreaSmartEditor.call(obj);
			}
		}
		if(obj.tagName == "SELECT"){
			obj.removeAll = function(){
				if(this.options.length == 0) return;
				if(this.options[0].value == 0) 
					 this.options.length = 1;
				else this.options.length = 0;
			};
			
			obj.addItem = function(value, text){
				if(value == "") return;
				$(this).append("<option value=\"" + value + "\">" + text + "</option>");
			};
			
			obj.getItemCount = function(){
				return this.options.length;
			}
			
			obj.setSelectedIndex = function(idx){
				if(idx < 0 || idx >= this.options.length) return;
				this.value = this.options[idx].value;
			};
			
			obj.getSelectedIndex = function(){
				if(this.selectedIndex) return this.selectedIndex;
				
				var options = this.options;
				for(var i=0; i<options.length; i++){
					if(this.value == options[i].value) return i;
				}
				return -1;
			};
			
			obj.setItemSet = function(dataList, refValue, refText){
				if(typeof dataList == 'string') dataList = window[dataList];
				if(dataList == undefined) return;
				
				$(this).attr("itemSet", "data:" + dataList.id);
				
				if(refValue) $(this).attr("refValue", refValue);
				if(refText ) $(this).attr("refText",  refText);
				
				this.resetData(dataList.getAllJSON());
			};
			
			obj.resetData = function(data){
				this.removeAll();
				
				var refVal = $(this).attr("refValue");
				var refTxt = $(this).attr("refText");
				for(var i=0; i<data.length; i++){
					var objOption = document.createElement("option");   
					objOption.value = data[i][refVal];
					objOption.text  = data[i][refTxt];
					this.options.add(objOption);
				}
			};
			
			obj.getText = function(){
				return this.options[this.selectedIndex].text
			};
		}
		
		obj.setValue = function(val) { 
			// 일반
			this.value = (val == undefined || val == "undefined") ? this.value = "" : this.value = val; 

			if(this.tagName == "INPUT") {
				// 체크박스 테스트
				if($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio"){
					var checkedValue = $(this).attr("checkedValue");
					this.checked = (val==checkedValue);
				}
				else {
					var format = $(this).attr("displayFormat");
					if(isNull(format) == false) this.value = neoSafeKoreeaFormat(this.value, format);
				}
			}

			if(this.tagName == "SELECT"){
				var isExistValue = false;
				for(var i=0; i<this.options.length; i++){
					if(this.options[i].value != val) continue;
					isExistValue = true;
					break;
				}
				if(isExistValue == false && this.options.length > 0) this.value = this.options[0].value;
			}
			
			if(!this.dataObj) return;
			if(!this.dataKey) return;
			
			// setvalue
			this.dataObj.set(this.dataKey, this.getValue(), true);
		};
		
		obj.getValue = function(val) {
			// 체크박스 테스트
			if($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio"){
				var val;
				if(this.checked) {
					val = $(this).attr("checkedValue");
					if(val == undefined) val = "Y";
				}
				else {
					val = $(this).attr("unCheckedValue");
					if(val == undefined) val = "";
				}
				return val;
			}
			
			if(this.tagName == "INPUT") {
				var format = $(this).attr("displayFormat");
				if(isNull(format) == false){
					return neoSafeKoreeaUnFormat(this.value, format);
				}
			}
			
			// 일반
			return this.value; 
		};
		
		if(obj.tagName == "INPUT" || obj.tagName == "TEXTAREA"){
			obj.setReadOnly = function(isReadOnly){
				if(isReadOnly) $(this).attr("readonly",""); else $(this).removeAttr("readonly");
			}
		}
		
		if(obj.tagName == "INPUT" && $(obj).attr("xtag") == "datePicker"){
			NeoSafeKoreaDatePicker.call(obj);
		}
		else {
			var klass = $(obj).attr("class");
			if(klass && klass.indexOf("calendar_input2") >= 0){
				new Cleave(obj, {
					delimiter: '-',
				    date: true,
		    		datePattern: ['Y', 'm', 'd']
				});
			}
		}

	}

	// ref 처리 (set default value,   & onchange
	obj.setRef = function(newRef){
		if(newRef) $(obj).attr("ref", newRef);
		var ref = $(obj).attr("ref");
		
		/* 주석처리 이유
		 *  input type=radio일 경우 PARENT (DIV, SPAN)에 onchange event를 발생시키려고 하였으나 원래 발생됨  
		if(obj.tagName == "INPUT" && $(obj).attr("type") == "radio"){
			var $xtagRadio = $(obj).closest("[xtag='radio']");
			if($xtagRadio.length > 0){
				obj.onchange = function(e){
					var parentOnChange = $(this).parent()[0].onchange;
					if(parentOnChange) parentOnChange(e);
				}
				return;
			}
		}
		*/
		
		if(ref == undefined || ref == null || ref == "") return;

		var obj_key = ref.replace("data:", "").split(".");
		if(obj_key.length != 2) return;
		obj.dataObj = window[obj_key[0]];
		obj.dataKey = obj_key[1];
		if(!obj.dataObj) {
			__notProcessedDataObjectIdList.push(obj_key[0]);			
			return;
		}
		
		// setvalue
		obj.setValue(obj.dataObj.get(obj.dataKey));

		// onchange
		if(obj.tagName == "INPUT" || obj.tagName == "TEXTAREA" || obj.tagName == "SELECT" || $(obj).attr("xtag") == "radio"){
			if(obj.onchange) obj.orgOnChange = obj.onchange;
			obj.onchange = function(e){
				this.dataObj.set(this.dataKey, this.getValue());
				if(this.orgOnChange) this.orgOnChange(e);
			}
		}
	}
	
	obj.setRef();

	safeKoreaInitializeHtmlObjectChild(obj)
}

function safeKoreaInitializeHtmlObjectChild(obj){
	var children = $(obj).children();
	for(var i=0; i<children.length; i++){
		var child = children[i];
		safeKoreaInitializeHtmlObject(child);
	}
}

function safeKoreaEngineInitializeObject(){
	safeKoreaInitializeHtmlObjectChild($("body")[0]);
}

//******************************************************************************************
// DATAMAP
//******************************************************************************************

function NeoSafeKoreaDataMap() {
	var self = this;
	this.neoSafeKoreaObjectType = "NeoSafeKoreaDataMap";

	var originData = {};
	for (attr in self.data) {
		if(self.data[attr]){
			originData[attr] = self.data[attr];
		}
		else {
			originData[attr] = "";
		}
	}
	this.undo = function(){
		self.setJSON(originData);
	}
	
	
	this.get = function(key){
		return self.data[key];
	};
	
	this.set = function(key, val, doNotChildValueChange){
		if(self.data[key] === val) return;
		self.data[key] = val;
		
		if(doNotChildValueChange) return;
		
		var jQryObjects = $("[ref='data:" + self.id + "." + key + "']");
		for(var i=0; i<jQryObjects.length; i++){
			var obj = jQryObjects[i];
			obj.setValue(val);
		}
	};
	
	this.getJSON = function(){
		return self.data;
	};
	
	this.setJSON = function(json){
		for (attr in self.data) {
			if(json[attr] === undefined){
				//self.set(attr, "");
				continue;
			}
			else {
				if(json[attr] == null) json[attr] = "";
				self.set(attr, json[attr]);
			}
		}
	};

	/* 삭제... 이상 있을 시 다시 주석 풀 것
	// init ref html obj
	for (attr in self.data) {
		if(self.data[attr] == null) self.data[attr] = "";
		self.set(attr, self.data[attr]);
	}
	*/
	
	window[self.id] = self; 
	
};


//******************************************************************************************
// DATALIST
//******************************************************************************************

function NeoSafeKoreaDataList() {
	var self = this;
	
	this.neoSafeKoreaObjectType = "NeoSafeKoreaDataList";

	this.data = [];

	this.getRowCount = function(){
		return self.data.length;
	}
	
	this.getCellData = function(row, col){
		if(row<0) return null;
		return self.data[row][col];
	};
	
	this.setCellData = function(row, col, val){
		if(row<0) return;
		if(typeof val === 'object') return;
		self.data[row][col] = val;
	};
	
	this.insertRow = function(row){
		if(!row) row = self.data.length;

		self.data.splice(row, 0, {});

		var $grid = $("[xtag='gridView'][dataList='" + self.id + "']");
		if($grid.length > 0) $grid[0].refresh();

		return row;
	};
	
	this.appendJSON = function(json){
		var row = {};
		for (attr in json) {
			if(typeof(json[attr]) == 'function') continue;
			if(json[attr] == null) json[attr] = "";
			row[attr] = json[attr];
		}
		return self.data.push(row);
	};
	
	this.insertJSON = function(row, json){
		var data = {};
		for (attr in json) {
			if(typeof(json[attr]) == 'function') continue;
			if(typeof(json[attr]) == 'object') continue;
			if(json[attr] === undefined) data[attr] = ""
			else{
				if(json[attr] == null) json[attr] = "";
				data[attr] = json[attr];
			}
		}
		
		self.data.splice(row, 0, data);
		return self.data.length;
	};
	
	this.deleteRow = function(row){
		return self.data.splice(row, 1);
	};
	
	this.removeRows = function(rowArr){
		for(var i=rowArr.length-1; i>=0; i--){
			self.deleteRow(rowArr[i]);
		}
	};
	
	
	this.removeAll = function(){
		this.data.splice(0, this.data.length);
	};
	
	this.getRowJSON = function(row){
		return self.data[row];
	};
	
	this.setRowJSON = function(row, json){
		for (attr in self.data[row]) {
			if(typeof(this[attr]) == 'function') continue;
			if(typeof(this[attr]) == 'object') continue;
			if(json[attr] == null) json[attr] = "";
			self.data[row][attr] = json[attr];
		}
	};
		
	this.getMatchedJSON = function(colID , dataValue , exactMatch , stRowIndex , lastRowIndex){
		var matchedJSON = [];
		if(stRowIndex   == undefined) stRowIndex   = 0;
		if(lastRowIndex == undefined) lastRowIndex = self.data.length;
		for(var i=stRowIndex; i<lastRowIndex; i++){
			if(exactMatch){
				if(self.data[i][colID] != dataValue) continue;
			}
			else {
				if(self.data[i][colID].indexOf(dataValue) == -1) continue;
			}
			matchedJSON.push(self.data[i]);
		}
		return matchedJSON;
	};
	
	this.getMatchedIndex = function(colID , dataValue , exactMatch , stRowIndex , lastRowIndex){
		var matchedIDXs = [];
		if(stRowIndex   == undefined) stRowIndex   = 0;
		if(lastRowIndex == undefined) lastRowIndex = self.data.length;
		for(var i=stRowIndex; i<lastRowIndex; i++){
			if(exactMatch){
				if(self.data[i][colID] != dataValue) continue;
			}
			else {
				if(self.data[i][colID].indexOf(dataValue) == -1) continue;
			}
			matchedIDXs.push(i);
		}
		return matchedIDXs;
	};
	
	this.setJSON = function(jsonArray, isAppend){
		var newArray = [];
		for(var i=0; i<jsonArray.length; i++) newArray.push($.extend({}, jsonArray[i]));
		if(isAppend){
			self.data = self.data.concat(newArray);
		}
		else {
			self.data = newArray;
		}
	}

	this.getAllJSON = function(){
		return self.data;
	};
	
	this.refreshRefObject = function(obj){
		if(obj){
			obj.removeAll();  // select 및 radio
			var selectJQueryObject = $(obj) 
			var refValue = selectJQueryObject.attr("refValue");
			var refText  = selectJQueryObject.attr("refText");
			for(var k=0; k<	self.data.length; k++){
				var value = self.data[k][refValue];
				var text  = self.data[k][refText];
				obj.addItem(value, text) // select 및 radio
			}
			
			return;
		}
		
		// refreshRefGrid
		var gridObjects = $("[xtag='gridView'][dataList='" + self.id + "']");
		for(var i=0; i<gridObjects.length; i++){
		    gridObjects[i].refresh();
		}

		// refreshRefSelect
		var selectObjects = $("[itemSet='data:" + self.id + "']");
		for(var i=0; i<selectObjects.length; i++){
			/* // only select tag
			if(selectObjects[i].options.length > 0 && selectObjects[i].options[0].value == ""){
				selectObjects[i].options.length = 1;
			}
			else {
				selectObjects[i].options.length = 0;
			}
			*/
			
			// TreeView일경우 수동으로 처리
			if(selectObjects[i].tagName == "DIV" && $(selectObjects[i]).attr("xtag") == "treeview") continue;
			
			selectObjects[i].removeAll();  // select 및 radio
			var selectJQueryObject = $(selectObjects[i]) 
			var refValue = selectJQueryObject.attr("refValue");
			var refText  = selectJQueryObject.attr("refText");
			for(var k=0; k<	self.data.length; k++){
				var value = self.data[k][refValue];
				var text  = self.data[k][refText];
				selectObjects[i].addItem(value, text) // select 및 radio
			}
		}
	};
	
	window[self.id] = self; 
	
	var gridObjects = $("[xtag='gridView'][dataList='" + self.id + "']");
	for(var i=0; i<gridObjects.length; i++){
	    gridObjects[i].refresh();
	}
	
};

//******************************************************************************************
// SUBMISSION
//******************************************************************************************
function NeoSafeKoreaSubmission() {
	var self = this;
	this.type = "NeoSafeKoreaSubmission";


	if(this.method     == undefined) this.method     = "post";
	if(this.mediatype  == undefined) this.mediatype  = "application/json";
	if(this.encoding   == undefined) this.encoding   = "UTF8";
	if(this.mode       == undefined) this.mode       = "asynchronous";
	if(this.processMsg == undefined) this.processMsg = "처리중입니다.";
	
	window.__processMsg = this.processMsg;
	
	this.exec = function(){
		var paramObj = {};
		
		if(self.ref){
			if(Array.isArray(self.ref)){
				for(var i=0; i<self.ref.length; i++){
					paramObj[self.ref[i].key] = window[self.ref[i].id].data;
				}
			}
			else {
				paramObj[self.ref.key] = window[self.ref.id].data;
			}
		}
		
		var paramStr  = JSON.stringify(paramObj);
		var path      = $(location).attr('pathname');
		var actionUrl = $(location).attr('protocol') + "//" + $(location).attr('host');   
		actionUrl += self.action;

		neoSafeKoreaShowIng();

        var request = $.ajax({
            url        : actionUrl 
          , type       : self.method
          , data       : paramStr
          , async      : (self.mode == "asynchronous")
          , dataType   : "json"
          , beforeSend : self.onBeforeSend
          , success    : self.onPreSubmitDone
	      , error      : window[self.onSubmitError]
	      , complete   : self.onPreComplete
        });
	};
	
	// Submission 요청 전 선처리. return false시 submission 수행 안함.
	this.onSubmit = function(){
	};
	
	this.onPreComplete = function(e){
		neoSafeKoreaHideIng();
		if(self.onComplete) self.onComplete(e);
	};

	// Response Status 코드 값이 정상 일 경우 동작.
	this.onSubmitDone = function(result){
		//alert("onSubmitDone\n" + self.action);
	};
	
	// Response Status 코드가 오류 (200 미만 300 이상) 일 경우 동작.
	this.onSubmitError = function(e){
		alert("onSubmitError\n" + self.action);
	}

	this.onBeforeSend = function(xhr) {
	    xhr.setRequestHeader('Accept', "application/json");
	    xhr.setRequestHeader('content-Type', "application/json; charset=UTF-8");
	    return self.onSubmit(xhr);
	}

	this.onPreSubmitDone = function(result){
		if(result == "null" || result == null) {
			self.responseJSON = null;
			if(self.submitdone) self.submitdone(self);		
			return;
		}
		
		function setDataObj(data, dataObj){			
			if(dataObj.neoSafeKoreaObjectType == "NeoSafeKoreaDataList" && Array.isArray(data)){
				dataObj.removeAll();
				for(var x=0; x<resultObj.length; x++){
					dataObj.appendJSON(data[x]);
				}
				dataObj.refreshRefObject();
			}
			else if(targetObj.neoSafeKoreaObjectType == "NeoSafeKoreaDataMap"){
				dataObj.setJSON(data);
			}
		}

		if(self.target != undefined) {
			if(self.target.length){
				for(var i=0; i< self.target.length; i++){
					var targetObj = window[self.target[i].id];
					if(!targetObj) continue;
					
					var resultObj = result[self.target[i].key];
					if(!resultObj) continue;
					
					setDataObj(resultObj, targetObj);
				}
			}
			else {
				var targetObj = window[self.target.id];
				if(targetObj) {
					var resultObj = result[self.target.key];
					if(resultObj) {
						setDataObj(resultObj, targetObj);
					}
				}
			}
		}
		
		self.responseJSON = result;

		if(self.submitdone) self.submitdone(self);		
	};
	
	window[self.id] = self; 
};


//******************************************************************************************
// GENERATOR
//******************************************************************************************

function NeoSafeKoreaGenerator(){
	var self = this;
	this.orgChildContents = [];
	this.childContentsLength = 0;
	
	
	var chilrenLength = $(self).children().length;
	for(var i=0; i<chilrenLength; i++){
		var content = $(self).children()[i];
		self.orgChildContents.push(content);
	}
	$(self).children().remove();

	
	this.getLength = function(){
		return self.childContentsLength;
	};
	
	this.insertChild = function(){
		function resetChildrenID(rowIdx, child){
			var oldID = $(child).attr("id");
			if(oldID != undefined && oldID != "") {
				var newID = self.id + "_" + rowIdx + "_" + oldID;
				$(child).attr("id", newID);
			}
			else {
				if(child.tagName = "INPUT" && $(child).attr("type") == "radio") {
					//$(child).attr("g_Index", rowIdx);
				}
			}
			
			var oldFor = $(child).attr("for");
			if(oldFor != undefined && oldFor != "") {
				var newFor = self.id + "_" + rowIdx + "_" + oldFor;
				$(child).attr("for", newFor);
			}
			
			$(child).attr("g_Index", rowIdx);
			
			
			for(var i=0; i<$(child).children().length; i++){
				resetChildrenID(rowIdx, $(child).children()[i]);
			}
		}

		var rowIdx = self.childContentsLength;
		
		for(var i=0; i<self.orgChildContents.length; i++){
			var newCont = $(self.orgChildContents[i]).clone();
			
			$(self).append(newCont);
			
			var children = $(self).children();
			var child = children[children.length - 1];
			resetChildrenID(rowIdx, child);
			
			safeKoreaInitializeHtmlObject(child);		
		}
		
		self.childContentsLength++;
		return rowIdx;
	};
	
	this.insert = function(){
		return self.insertChild();
	}
	
	this.getChild = function(rowIdx, id){
		var objID = self.id + "_" + rowIdx + "_" + id;

		var childJQueryObj = $("#" + objID);
		if(childJQueryObj.length > 0) return childJQueryObj[0];
		
		childJQueryObj = $(this).find("[id^='" + self.id + "_" + rowIdx + "'][id$='" + id + "']")
		if(childJQueryObj.length > 0) return childJQueryObj[0];
	};
	
	this.deleteChild = function(rowIdx){
		var $child = $(self).find("[g_index='" + rowIdx + "']");
		$child.remove();
		for(var i=rowIdx+1; i<self.childContentsLength; i++){
			var $exChild = $(self).find("[g_index='" + i + "']");
			$exChild.attr("g_index", i - 1);

			var $exChildId = $(self).find("[id^='" + self.id + "_" + i + "']");
			for(var k=0; k<$exChildId.length; k++){
				var id = $($exChildId[k]).attr("id");
				id = id.replace(self.id + "_" + i, self.id + "_" + (i-1));
				$($exChildId[k]).attr("id", id);
			}
		}
		self.childContentsLength--;
	}
	
	this.removeAll = function(){
		$(self).children().remove();
		self.childContentsLength = 0;
	};
};


//******************************************************************************************
//FileUpload
//******************************************************************************************

function NeoSafeKoreaUpload() {
	var self = this;
	var $self = $(self);
	var maxFilesize = $self.attr("maxFileSize");
	var isShowFilesizeMessage = $self.attr("maxFileSizeMessage") != "false";
	var classPrefix = $self.attr("classPrefix");
	var subSystem   = $self.attr("subSystem");
	this.action     = $self.attr("action");
	if(!subSystem) subSystem = "SFK"
	
	var userOnChange = $self.attr("onInputValueChange")
	var userOnDone   = $(self).attr("ondone");
	if(userOnChange != undefined) userOnChange = userOnChange.replace("(", "").replace(")", "").replace(" ", "");
	if(userOnDone   != undefined) userOnDone   = userOnDone.replace("(", "").replace(")", "").replace(" ", "");
	
	if(!classPrefix) classPrefix = "sfk_";
	
	function initialize(){
		
		//fileUpload list
    	var formString = '<form name="form_@" id="form_@" enctype="multipart/form-data" method="post" target="targetFrame_@">'
			           + '<input name="tempFlie_@" id="tempFlie_@" type="text" class="' + classPrefix + 'upload_input" readonly="readonly">'
                       + '<span id="span_@" class="' + classPrefix + 'upload_image">'
				       + '<input name="upload" id="fakeinput_@" class="' + classPrefix + 'upload_fakeInput" type="file" style="width:100%;cursor:pointer">'
			           + '</span>'
			           + '<input class="' + classPrefix + 'upload_submit" type="submit" value="쿼리 전송" style="display:none">'
				       + '<input name="subSystem" type="hidden" value="' + subSystem + '">'
		               + '</form>';
		var textString = "";
		if(isShowFilesizeMessage){
			textString = '<div class="' + classPrefix + 'upload_txt">파일용량은 500MB 이하로 제한합니다.</div>';
			if(maxFilesize) textString = '<div class="' + classPrefix + 'upload_txt">파일용량은 ' + maxFilesize + ' 이하로 제한합니다.</div>';
		}
		var listString = '<div id="uploadlist_@"></div>';
		var framString = '<iframe name="targetFrame_@" title="파일 업로드를 위한 임시 프레임" frameborder="0" scrolling="no" style="width: 0px; height: 0px; display:none"></iframe>';

		formString = formString.replaceAll("@", self.id);
		listString = listString.replaceAll("@", self.id);
		framString = framString.replaceAll("@", self.id);
				
		//form
		$(self).html(formString + textString + listString + framString);

		//targetFrame
		$("#fakeinput_" + self.id).change(function(e){
			if(userOnChange) {
				$("#tempFlie_" + self.id).val(this.value);
				window[userOnChange](this.value);
			}
			else self.submit();
			e.stopPropagation();
		});

		if(userOnDone && userOnDone != ""){
			self.ondone = window[userOnDone];
		}
	}
	
	
	this.onchange = function(){
		self.submit();
	}
	
	this.reset = function(){
		$self.find("input").val("");
	}
	
	this.getValue = function(){
		return $("#fakeinput_" + self.id).val();
	}
	
	this.submit = function(){
		var form = $("#form_" + self.id)[0];
		
		var uploadAction = "/idsiSFK/neoUpload.do?callback=" + self.id + ".uploadCallback";
		if(isNull(self.action) == false) uploadAction = self.action;
		$(form).attr("action", uploadAction);
		
		//
		var fileName = $("#fakeinput_" + self.id).val();
		if(fileName == ""){
			self.ondone({localFileName:"", storedFileName:""});
			return;
		}		
		var fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
		var validExt = $self.attr("ext");
		if(isNull(validExt) == false){
			var extList = validExt.split(",");
			var isValidExt = false;
			for(var i=0; i<extList.length; i++){
				if(extList[i] != fileExt) continue;
				isValidExt = true;
				break;
			}
			if(isValidExt == false){
				var errMsg = "아래와 같은 파일형식만을 지원합니다.\n";
				for(var i=0; i<extList.length; i++){
					if(i>0) errMsg += ", ";
					errMsg += "*." + extList[i];
				}
				alert(errMsg);
				return;
			}
		}
		
		/* >>>>>>>>>> 웹필터 체크 시작 <<<<<<<<<< */
		// 웹필터 파일폼 AJAX 전송
		var wfformData = new FormData($("#form_" + self.id)[0]);
		var wfCheckAjax = sendWebFilter(wfformData);

		// 웹필터 체크 결과값(wfCheckAjax)이 false 이면 작업 중지
		if(!wfCheckAjax){
			return false;
		}
		/* >>>>>>>>>> 웹필터 체크 종료 <<<<<<<<<< */
		
		//
		form.submit();
	};
	
	//callback
	this.uploadCallback = function(rtnJSON){
		if(self.ondone) self.ondone(rtnJSON);
	}
	
	this.ondone = function(rtnJson){
		$("#tempFlie_" + self.id).val("");		
//		if(userOnChange.indexOf("(") > -1 || userOnChange.indexOf(")") > -1) 
//			eval(userOnChange);
//		else
			window[userOnChange]();
	}
	initialize();	
}	


//******************************************************************************************
// radio select
//******************************************************************************************
function NeoSafeKoreaRadioSelect(){
	var self = this;
	var $self = $(self);
	
	var colCount = $self.attr("cols");
	if(colCount == undefined || colCount == "") colCount = 1; else colCount = parseInt(colCount);
	var rowCount = $self.attr("rows");
	if(rowCount == undefined || rowCount == "") rowCount = -1; else rowCount = parseInt(rowCount);
	if(rowCount == 1) colCount = 999;
	
	var usrOnChange = $self.attr("onchange");
	if(usrOnChange) usrOnChange = usrOnChange.replace("(", "").replace(")", "").replace(" ", ""); 

	if($self.find("table").length == 0){
		$self.append("<table class=\"radio_main\" cellspacing=\"0\" cellpadding=\"0\"></table>");
	}
	
	this.removeAll = function(){
		$self.find("table").children().remove();
	};
	
	this.addItem = function(value, label){
		var inputId = $self.attr("id") + "_input"
		
		var itemCount = $self.find(".radio_input").length;
		var isNewTr   = (itemCount % colCount == 0);

		var html = "";
		if(isNewTr) html = "<tr class=\"radio_row\">"; 
		
		html += "<td class=\"radio_td_input\">"
			  + "<input name=\"" + inputId + "_input\" checkedValue=\"" + value + "\" value=\"" + value + "\" title=\"" + label + "\" class=\"radio_input\" id=\"" + inputId + "_" + itemCount + "\" type=\"radio\" index=\"" + itemCount + "\">"
			  + "</td>"
			  + "<td class=\"radio_td_label\">"
			  + "<label class=\"radio_label\" for=\"" + inputId + "_" + itemCount + "\" index=\"" + itemCount + "\">" + label + "</label>"
			  + "</td>";

		if(isNewTr) html += "</tr>";
		
		if(isNewTr) $self.find("table").append(html); else $self.find("tr:last").append(html);
	};
	
	this.setValue = function(val){
		var $checkedRadio = $self.find("input[value='" + val + "']");
		if($checkedRadio.length > 0) $checkedRadio[0].checked = "true"; 
	};
	
	this.getValue = function(val){
		var $chkRadio = $self.find("input[type='radio']:checked");
		var val = $chkRadio.attr("checkedValue");
		return val;
	};
	
	this.setSelectedIndex = function(idx){
		var $radio = $self.find("input:eq(" + idx + ")");
		$radio.attr("checked", "checked");
	};
	
	this.setDisabled = function(isDisable) {
		$self.attr("disabled", isDisable);
		$self.find("input").attr("disabled", isDisable);
		if(isDisAble){
			$self.find("label").addClass("radio_disabled");
		}
		else{
			$self.find("label").removeClass("radio_disabled");
		}
	};
	
	this.getDisabled = function(){
		return $self.attr("disabled");
	};
	
	this.onchange = function(e){
		var refInfo = self.getRefInfo();
		if(refInfo){
			refInfo.dataObject.set(refInfo.key, self.getValue());
		}
		
		if(usrOnChange && window[usrOnChange]) window[usrOnChange](e);
	};	
}

//******************************************************************************************
//checkbox select
//******************************************************************************************
function NeoSafeKoreaCheckboxSelect(){
	var self = this;
	var $self = $(self);
	var colCount = $self.attr("cols");
	if(colCount == undefined || colCount == "") colCount = 1; else colCount = parseInt(colCount);
	
	var usrOnChange = $self.attr("onchange");
	if(usrOnChange) usrOnChange = usrOnChange.replace("(", "").replace(")", "").replace(" ", ""); 

	var usrOnClick = $self.attr("oncheckboxclick");
	if(usrOnClick) usrOnClick = usrOnClick.replace("(", "").replace(")", "").replace(" ", ""); 

	if($self.find("table").length == 0){
		$self.append("<table class=\"radio_main\" cellspacing=\"0\" cellpadding=\"0\"></table>");
	}
	
	this.removeAll = function(){
		$self.find("table").children().remove();
	}
	
	this.addItem = function(value, label){
		var html = "";
		var itemCount = $self.find(".checkbox_input").length;
		var isNewTr   = (itemCount % colCount == 0);
		
		if(isNewTr) html = "<tr class=\"checkbox_row\">"; 


		var inputId = $self.attr("id") + "_input"
		var cnt  = $self.find("tr").children().length;
		html += "<td class=\"checkbox_td_input\">"
			 + "<input name=\"" + inputId + "_input\" value=\"" + value + "\" title=\"" + label + "\" class=\"checkbox_input\" id=\"" + inputId + "_" + cnt + "\" type=\"checkbox\" index=\"" + cnt + "\">"
			 + "</td>"
			 + "<td class=\"checkbox_td_label\">"
			 + "<label class=\"checkbox_label\" for=\"" + inputId + "_" + cnt + "\" index=\"" + cnt + "\">" + label + "</label>"
			 + "</td>";

		if(isNewTr) html += "</tr>"; 

		if(isNewTr) $self.find("table").append(html); else $self.find("tr:last").append(html);
	}
	
	this.setValue = function(val){
		val = "" + val;
		var valArr = val.replaceAll(" ", ",").split(",");
		
		for(var i=0; i<valArr.length; i++){
			var $checkedcheckbox = $self.find("input[value='" + valArr[i] + "']");
			if($checkedcheckbox.length > 0) $checkedcheckbox[0].checked = "true"; 
		}
	};
	
	this.getValue = function(){
		var $chk = $self.find("input[type='checkbox']:checked");
		var val = "";
		$chk.each(function(){
			if(val != "")  val += ",";
			val += this.value;
		});
		return val;
	};
	
	this.setDisabled = function(isDisable) {
		$self.attr("disabled", isDisable);
		$self.find("input").attr("disabled", isDisable);
		if(isDisAble){
			$self.find("label").addClass("checkbox_disabled");
		}
		else{
			$self.find("label").removeClass("checkbox_disabled");
		}
	};
	
	this.getDisabled = function(){
		return $self.attr("disabled");
	};
	
	this.onchange = function(e){
		var refInfo = self.getRefInfo();
		if(refInfo){
			refInfo.dataObject.set(refInfo.key, self.getValue());
		}
		
		if(usrOnChange && window[usrOnChange]) window[usrOnChange](e);
		if(usrOnClick && window[usrOnClick]) {
			var index = $(e.target).attr("index");
			var check = e.target.checked;
			var value = e.target.value;
			window[usrOnClick](parseInt(index), check, value);
		}
	};	
}




//******************************************************************************************
//DatePicker
//******************************************************************************************
var neoDateOption = {
		  dayNamesMin    : [ "월", "화", "수", "목", "금", "토", "일" ]
		, monthNamesShort: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
	    , monthNames     : [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ]
	
		, yearSuffix  : " - "
		, duration    : "fast"
		, currentText : "오늘"
		, closeText   : "닫기"
		, showOn      : "button"
		, dateFormat  : "yy-mm-dd"
	    , buttonImage : "/idsiSFK/neo/ext/img/icon_calendar.gif" 
		, buttonText  : "클릭하시면 달력이 표시됩니다."

		, buttonImageOnly   : true
		, changeYear        : true
		, changeMonth       : true
		, showButtonPanel   : true
		, showMonthAfterYear: true

};

var neoGridViewDateOption = $.extend({}, neoDateOption);
neoGridViewDateOption.showOn = "focus";
neoGridViewDateOption.buttonImageOnly = false;
{
	var year = (new Date()).getFullYear();
	neoGridViewDateOption.yearRange = (year - 80) + ":" + year;
}



function NeoSafeKoreaDatePicker(defaultDate){
	var self = this;
	var $self = $(self);

	new Cleave(self, {
		delimiter: '-',
	    date: true,
		datePattern: ['Y', 'm', 'd']
	});
	
	this.minYear = $self.attr("minYear");
	this.maxYear = $self.attr("maxYear");
	this.minYear = this.minYear ? parseInt(this.minYear) : 1970; 
	this.maxYear = this.maxYear ? parseInt(this.maxYear) : 2030; 

	var dateOption = $.extend({yearRange:this.minYear + ":" + this.maxYear}, neoDateOption);
	if(defaultDate) dateOption.defaultDate = defaultDate; //defaultDate y, m, w, d

	this.onChange4User = null;
	this.onBlur4User = null;
	
	this.getValue = function(){
		var val = $self.val().replaceAll("-", "");
	    return val.substring(0, 8);
	}

	this.setValue = function(val){
	    $(self).val(val);
	    self.onchange();
	}

	this.onchange = function(e){
		var dt = $(self).val();
		if(dt.length == 8){
			dt = dt.replaceAll("-", "");
			dt = dt.substring(0,4) + "-" + dt.substring(4,6) + "-" + dt.substring(6,8);
			$self.val(dt);
		}

		var refInfo = self.getRefInfo();
		if(refInfo){
			refInfo.dataObject.set(refInfo.key, self.getValue());
		}
		
		if(self.onChange4User) self.onChange4User(e);
	}
	
	this.onblur = function(e){
		var dt = self.getValue();
		var isValid = true;
		var invalidMsg = "일자 형식이 잘못되었습니다.";
		if(dt.length > 1 && dt.length < 8) {
			isValid = false;
		}
		
		if(isValid){
			var y = parseInt(dt.substring(0, 4));
			var m = parseInt(dt.substring(4, 6));
			var d = parseInt(dt.substring(6, 8));
			if(y < self.minYear || y > self.maxYear) {
				isValid = false;
				invalidMsg += "\n년도의 범위는 " + self.minYear + "~" + self.maxYear + " 사이만 가능합니다.";
			}
			if(m < 1    || m >   12) {
				isValid = false;
				invalidMsg += "\n월의 범위는 1~12입니다.";
			}
			if(d < 1    || d >   31) {
				isValid = false;
				invalidMsg += "\n일자의 범위는 1~31입니다.";
			}
		}
		if(isValid == false){
			alert(invalidMsg);
			setTimeout(function(){self.focus()}, 10);
		}
		
		if(self.onBlur4User) self.onBlur4User(e);
	}
	
	function initialize(){
		var minY = $self.attr("minYear");
		if(isNull(minY) == false) self.minYear = minY;
		
		var maxY = $self.attr("maxYear");
		if(isNull(maxY) == false) self.maxYear = minY;
		
		var usrOnChange = $self.attr("onchange");
		var userOnBlur  = $self.attr("onblur");
		if(usrOnChange) self.onChange4User = window[usrOnChange];
		if(userOnBlur ) self.onBlur4User   = window[userOnBlur ];
		$self.attr("maxlength", "10");
		$self.datepicker(dateOption);
	}
	
	initialize();
}

//******************************************************************************************
// TabControl
//******************************************************************************************
function NeoSafeKoreaTabControl(){
	var self = this;
	var $self = $(self);
	var id   = this.id
	
	this.selectedTabIndex = 1;
	this.tabCount = $self.find(".tabcontrol_li").length;
	
	this.getSelectedTabIndex = function(){
		return self.selectedTabIndex;
	}
	this.setSelectedTabIndex = function(idx){
		if(idx<1 || idx>self.tabCount) return;
		if(idx == self.selectedTabIndex) return;
		var $tab, $page;
		
		$tab  = $self.find(".tabcontrol_li[index='"      + idx + "']");
		$page = $self.find(".tabcontrol_content[index='" + idx + "']");
		
		$tab.addClass("tabcontrol_active");
		$page.show();
		$page.find("[xtag='gridView']").pqGrid("refreshDataAndView");
		
		$tab  = $self.find(".tabcontrol_li[index='"      + self.selectedTabIndex + "']");
		$page = $self.find(".tabcontrol_content[index='" + self.selectedTabIndex + "']");
		$tab.removeClass("tabcontrol_active");
		$page.hide();
		
		self.selectedTabIndex = idx;
		
		if(self.onchange) self.onchange($tab.attr("id"), idx);
	}
	
	this.hideTab = function(idx){
		if(idx<1 || idx>self.tabCount) return;

		var $tab, $page;
		$tab  = $self.find(".tabcontrol_li[index='"      + idx + "']");
		$page = $self.find(".tabcontrol_content[index='" + idx + "']");
		
		$tab.hide();
		$page.hide();
	}
	
	
	function initialize(){
		$self.find(".tabcontrol_li").click(function(){
			if($(this).attr("disabled") == "disabled") return;
			var idx = $(this).attr("index");
			idx = parseInt(idx);
			self.setSelectedTabIndex(idx);
		});

		var onchangeAttr = $self.attr("onchange");
		if(isNull(onchangeAttr)) return;
		onchangeAttr = onchangeAttr.replace("()", "");
		if(typeof window[onchangeAttr] == "function"){
			self.onchange = window[onchangeAttr];
		}
	}
	
	initialize();
}



//******************************************************************************************
//TreeView
//******************************************************************************************

function NeoSafeKoreaTreeView(){
	var self  = this;
	var $self = $(self);
	var id    = this.id;
	
	this.selectedValue;
	this.selectedIndex;
	this.selectedLabel = "";
	
	var userOnClickHandler = $self.attr("onlabelclick");
	if(userOnClickHandler != undefined) userOnClickHandler = userOnClickHandler.replace("(", "").replace(")", "").replace(" ", "");

	var hasCheckBox = ($self.attr("checkbox") == "true");
	var refDataList = $self.attr("itemSet").replace("data:", "");
	var dataList = window[refDataList];
	var refLabel = $self.attr("refLabel");
	var refValue = $self.attr("refValue");
	var refDepth = $self.attr("refDepth");
	var refCheck = $self.attr("refCheckBox");
	var checkBoxTrueValue = $self.attr("checkBoxTrueValue");
	
	var defTopDepth = $self.attr("defTopDepth");
	if(defTopDepth == undefined) defTopDepth = 1; else defTopDepth = parseInt(defTopDepth);			

	//
	this.getSelectedIndex = function(){
		return self.selectedIndex;
	};
	
	this.getSelectedValue = function(){
		return self.selectedValue;
	};
	
	this.getSelectedLabel = function(){
		return self.selectedLabel;
	};
	
	this.getCheckedValues = function(){
		var values = [];
		var $checked = $self.find("input[type='checkbox']:checked");
		$checked.each(function(){
			if($(this).hasClass("w2treeview_partialselect") == false) {
				var checkedIndex = parseInt(this.id.replace(id + "_checkbox_", ""));
				var value = dataList.getCellData(checkedIndex, refValue);
				values.push(value);
			}
		});
		return values;
	} 
	
	this.getCheckedindexes = function(){
		var indexes = [];
		var $checked = $self.find("input[type='checkbox']:checked");
		$checked.each(function(){
			if($(this).hasClass("w2treeview_partialselect") == false) {
				var checkedIndex = parseInt(this.id.replace(id + "_checkbox_", ""));
				indexes.push(checkedIndex);
			}
		});
		return indexes;
	} 
	
	this.findNodeByIndex = function(index, isSelect){
		return $self.find("div[id='" + id + "_group_" + index + "']");
	};

	this.findNodeByValue = function(value, isSelect){
		return $self.find("table[treenodevalue='" + value + "']").parent();
	};

	this.getChildrenNodeByIndex = function(index, isSelect){
		if(index == -1){
			return $self.find(".w2treeview_group[depth='1']");
		}
		return $self.find("#" + id + "_child_" + index).children(".w2treeview_group");
	};

	this.getParentNodeByIndex = function(index, isSelect){
		var $node = self.findNodeByIndex(index);
		var $childDiv = $node.closest("div.w2treeview_child");
		if($childDiv.length == 0) return $self;
		
		var parentIdx = $childDiv.attr("id");
		parentIdx = parentIdx.replace(id + "_child_", "");
		return self.findNodeByIndex(parseInt(parentIdx));
	};

this.getParentNodeByValue = function(value, isSelect){
	var $node = self.findNodeByValue(value);
	var $childDiv = $node.closest("div.w2treeview_child");
	if($childDiv.length == 0) return $self;
	
	var parentIdx = $childDiv.attr("id");
	parentIdx = parentIdx.replace(id + "_child_", "");
	return self.findNodeByIndex(parseInt(parentIdx));
};

	this.selectNode = function(index){
		var $node  = self.findNodeByIndex(index);
		var $label = $("#" + id + "_label_" + index);
		
		$self.find("span").removeClass("w2treeview_select_node");
		$label.addClass("w2treeview_select_node");
		self.selectedIndex = index;
		self.selectedValue = $self.find("table[index='" + index + "']").attr("treenodevalue");
		self.selectedLabel = $label.html();
	};
	
this.getNodeInfo = function($node){
	var nodeInfo = {
		index : $node.attr("index"), 	
		depth : $node.attr("depth"), 	
		value : $node.attr("treenodevalue") 	
	};
	return nodeInfo;
};
	
	this.expand = function(index){
		if (hasChildNodeByDataList(index) == false) return;
		
		//
		var $parent  = self.getParentNodeByIndex(index);
		if($parent.length > 0){
			var parentIdx = $parent.attr("index");
			if(parentIdx){
				var $sibling = self.getChildrenNodeByIndex(parseInt(parentIdx));
				$sibling.each(function(){
					var idx = $(this).attr("index");
					if(idx) self.collapse(parseInt(idx));
				});
			}
		}
		
		var $ctrlDiv  = $(".w2treeview_icon_navi[index='" + index + "']");
		var $childDiv = $("#" + id + "_child_" + index);

		$childDiv.removeClass("w2treeview_none");
		$ctrlDiv.closest("table").removeClass("w2treeview_close_child");
		$ctrlDiv.closest("table").addClass("w2treeview_open_child");
	}
	
	this.collapse = function(index){
		if (hasChildNodeByDataList(index) == false) return;
		
		var $ctrlDiv  = $(".w2treeview_icon_navi[index='" + index + "']");
		var $childDiv = $("#" + id + "_child_" + index);

		$childDiv.addClass("w2treeview_none");
		$ctrlDiv.closest("table").removeClass("w2treeview_open_child");
		$ctrlDiv.closest("table").addClass("w2treeview_close_child");
	}
	
	function checkDataList(){
		if(dataList) return dataList;
		var refDataList = $self.attr("itemSet").replace("data:", "");
		dataList = window[refDataList];
		if(dataList == undefined) return false;
		return true;
	}

	function hasChildNodeByDataList(index){
		if(checkDataList() == false) return;
		if(index + 1 >= dataList.getRowCount()) return false;
		var currDepth = parseInt(dataList.getCellData(index,   refDepth));
		var nextDepth = parseInt(dataList.getCellData(index+1, refDepth));
		return (currDepth+1 == nextDepth);
	}
	
	function getHtml(index, label, value, depth, checked){
		depth -= defTopDepth;
		var hasChild = (index === undefined) ? true : hasChildNodeByDataList(index)
		
		var html = "<div tabindex=\"-1\" class=\"w2treeview_group\" id=\"" + id + "_group_" + index + "\" index=\"" + index + "\" depth=\"" + depth + "\" label=\"" + label + "\" treenodevalue=\"" + value + "\">"
		if(hasChild){
	         html += "<table class=\"w2treeview_node w2treeview_table_node w2treeview_close_child\" id=\"" + id + "_node_" + index + "\" cellspacing=\"0\" cellpadding=\"0\" index=\"" + index + "\" depth=\"" + depth + "\" treenodevalue=\"" + value + "\">"
		}
		else {
	         html += "<table class=\"w2treeview_node w2treeview_table_node\""                   + " id=\"" + id + "_node_" + index + "\" cellspacing=\"0\" cellpadding=\"0\" index=\"" + index + "\" depth=\"" + depth + "\" treenodevalue=\"" + value + "\">"
		}
		html += "<tr class=\"w2treeview_row_parent w2treeview_row_depth" + depth + "\">"
		      + "<td class=\"w2treeview_col_icon_navi\" id=\"" + id + "_col_icon_navi_" + index + "\">";
		if(hasChild){
			html += "<div class=\"w2treeview_icon_navi\" index=\"" + index + "\"></div>";
		}
		else {
			html += "<div class=\"w2treeview_icon_none\"></div>";
		}
		html += "</td>"
		      + "<td class=\"w2treeview_none\"></td>";
		if(hasCheckBox){
			if(checked) checked = "checked "; else checked = "";
			html += "<td class=\"w2treeview_col w2treeview_col_icon_checkbox\">"
			      + "<div class=\"w2treeview_partialdiv\" style=\"left: 4px; top: -1px;\">"
			      + "<input type=\"checkbox\" tabindex=\"-1\" class=\"w2treeview_checkbox\" id=\"" + id + "_checkbox_" + index + "\" " + checked + "style=\"left: 0px; top: 0px;\">"
			      + "</div>"
			      + "</td>";
		}
		html +="<td class=\"w2treeview_col_label\">"
		      + "<span class=\"w2treeview_label\" id=\"" + id + "_label_" + index + "\" index=\"" + index + "\">" + label + "</span>"
		      + "</td>"
		      + "</tr>";
		if(hasChild){
	        html += "<tr class=\"w2treeview_row_child\">"
	              + "<td class=\"w2treeview_noguideline w2treeview_col_depth" + depth + "\" id=\"" + id + "_guideline_" + index + "\"></td>"
	              + "<td colspan=\"2\">"
	              + "<div class=\"w2treeview_child w2treeview_none\" id=\"" + id + "_child_" + index + "\">" 
	              + getChildHtml(index, depth)			
	              + "</div>"
	              + "</td>"
	              + "</tr>";
		}
		html +="</table></div>";
		return html;		
	}
	
	function getChildHtml(parentIndex, parentDepth) {
		if(parentIndex === undefined) {
			parentIndex = -1;
			parentDepth = defTopDepth;
		}
		else {
			parentDepth += defTopDepth;
		}

		var html = "";
		
		if(checkDataList() == false) return;
		var rowCount = dataList.getRowCount();
		for(var i=(parentIndex+1); i<rowCount; i++){
			var label = dataList.getCellData(i, refLabel);
			var value = dataList.getCellData(i, refValue);
			var depth = parseInt(dataList.getCellData(i, refDepth));
			var checked = false;
			if(hasCheckBox) checked = (dataList.getCellData(i, refCheck) == checkBoxTrueValue);
			
			
			if(depth <= parentDepth  ) break;
			if(depth != parentDepth+1) continue;
			
			html += getHtml(i, label, value, depth, checked);
		}
		
		return html;
	}
	
	function shouldRefreshChild(index){
		if(checkDataList() == false) return;
		var rowCount = dataList.getRowCount();
		index = parseInt(index);
		if(index+1 >= rowCount) return false;
		
		var currDepth = parseInt(dataList.getCellData(index,   refDepth));
		var nextDepth = parseInt(dataList.getCellData(index+1, refDepth));

		return (currDepth + 1 == nextDepth);
	}
	
	function checkChildCheckBox($node){
		var index = parseInt($node.attr("index"));
		if(index == -1) return;

		var $childDiv = $("#" + id + "_child_"    + index);
		var $check    = $("#" + id + "_checkbox_" + index);

		var $allChild = $childDiv.find("input[type='checkbox']");
		var $checkedChild = $childDiv.find("input[type='checkbox']:checked");
		
		if($checkedChild.length == 0) {
			$check.removeClass("w2treeview_partialselect");
			$check[0].checked = false;
		}
		else if($checkedChild.length == $allChild.length) {
			$check.removeClass("w2treeview_partialselect");
			$check[0].checked = true;
		}
		else {
			$check.addClass("w2treeview_partialselect");
			$check[0].checked = true;
		}
		
		checkChildCheckBox(self.getParentNodeByIndex(index));
	}
	
	function createChildren(index, depth){
		var $childDiv = $self;
		if(index === undefined) $childDiv = $self;
		else {
			$childDiv = $("#" + id + "_child_" + index);
		}

		$childDiv.append(getChildHtml(index, depth));

		var ctrlSelector = ".w2treeview_icon_navi";
		ctrlSelector += ", span";
		//if(userOnClickHandler == undefined) ctrlSelector += ", span";

		var $ctrl = $childDiv.find(ctrlSelector);
		$ctrl.on("click", function(e){
			var index = parseInt($(this).attr("index"));
			var $ctrlDiv  = $(".w2treeview_icon_navi[index='" + index + "']");
			
			if($ctrlDiv.closest("table").hasClass("w2treeview_close_child")) {
				self.expand(index);
			}
			else if($ctrlDiv.closest("table").hasClass("w2treeview_open_child" )) {
				self.collapse(index)
			}
		});
		
		if(userOnClickHandler) {
			var $label = $childDiv.find(".w2treeview_label");
			$label.on("click", function(e){
				var index = parseInt($(this).attr("index"));
				self.selectNode(index);
				if(userOnClickHandler) window[userOnClickHandler](self.selectedValue, self.selectedIndex, self.selectedLabel);
			});
		}
		
		if(hasCheckBox){
			var $chk = $childDiv.find("input[type='checkbox']");
			$chk.on("change", function(e){
				$chk.removeClass("w2treeview_partialselect");

				var index = $(this).attr("id");
				index = index.replace(id + "_checkbox_", "");
				index = parseInt(index);

				var $node = self.findNodeByIndex(index);
				if(this.checked){
					$node.find("input[type='checkbox']").each(function(){this.checked = true;});
				}
				else {
					$node.find("input[type='checkbox']").each(function(){this.checked = false;});
				}
				
				checkChildCheckBox(self.getParentNodeByIndex(index));
			});

			var $chk = $childDiv.find("input[type='checkbox']:checked");
			$chk.each(function(){$(this).trigger("change");});
		}
		
	};
	
	this.refresh = function(){
		$self.attr("index", "-1");
		$self.children().remove();
		createChildren();
	}
	
	//self.refresh();
}


//******************************************************************************************
//WEB EDITOR
//******************************************************************************************

// NeoSafeKoreaWebEditorGlobal
_editor_url = "/idsiSFK/neo/ext/js/htmlarea3.0/";
_editor_lang = "kr";

var _is_editor_initialized = false;
var _is_editor_loaded      = false;
var _web_editor_config_;

function onloadWebEditor(){
	if(_is_editor_loaded == true) return;
	_is_editor_loaded = true;
	
	
	_web_editor_config_ = new HTMLArea.Config();	
	_web_editor_config_.toolbar = [
					                  	[ 
					                  	  "fontname", "space", "fontsize", "space", "formatblock", "space", "bold", "italic", "underline", "separator",
					                  	  "strikethrough", "subscript", "superscript", "separator",
					                  	  "copy", "cut", "paste", "space", "undo", "redo" 
					                  	],
				
					                  	[ "justifyleft", "justifycenter", "justifyright", "justifyfull", "separator",
					            		  "orderedlist", "unorderedlist", "outdent", "indent", "separator",
						                  "forecolor", "hilitecolor", "textindicator", "separator",
						                  "inserthorizontalrule", /*"createlink", "insertimage",*/ "inserttable", "htmlmode"
						                ]
	];
	
	var $webEditors = $("[xtag='webEditor']");
	for(var i=0; i<$webEditors.length; i++){
		NeoSafeKoreaWebEditor.call($webEditors[i]);
	}
};

function initWebEditor(){
	if(_is_editor_initialized == true) return;
	_is_editor_initialized = true;
	HTMLArea.init();
	//HTMLArea.onload = onloadWebEditor;
	onloadWebEditor();
}




function NeoSafeKoreaWebEditor(){
	var self  = this;
	var $self = $(self);
	
	//var isHidden = $(self).css("display") == "none"; 
	var isHidden = $(self).attr("isHidden") == "true"; 
	
	var editor = HTMLArea.replace($self.attr("id"), _web_editor_config_);

	if(isHidden) {
		$(editor._htmlArea).hide();
	}
	
	this.showWebEditor = function(){
		$(editor._htmlArea).show();
	};
	
	this.showHideEditor = function(){
		$(editor._htmlArea).hide();
	};
	
	this.setHTML = function(html){
		try{
			$self.val(html);
			//editor = HTMLArea.replace($self.attr("id"), _web_editor_config_);
			editor.setHTML(html);
		}
		catch(e){
			console.log(e);
		}
	};

	this.getHTML = function(html){
		return editor.getHTML();
		//editor.generate();
	};
}



//******************************************************************************************
//SmartEditor
//******************************************************************************************

var oEditors = [];

// 추가 글꼴 목록
//var aAdditionalFontSet = [["MS UI Gothic", "MS UI Gothic"], ["Comic Sans MS", "Comic Sans MS"],["TEST","TEST"]];

function NeoSafeKoreaSmartEditor(){
	var self  = this;
	var $self = $(self);
	var myID  = $self.attr("id");
	
	
	this.showWebEditor = function(){
		$("#div_" + myID).show();
	};
	
	
	var hideIntervalID;
	var isHideFinish = true;
	this.hideWebEditor = function(){
		if(isHideFinish == false) return;
		isHideFinish = false;
		//$("#div_" + myID).hide();
		hideIntervalID = setInterval(function(){
			var h = $("#div_" + myID).find("iframe").css("height");
			var hh = parseInt(h.replace("px", ""));
console.log(hh)			
			if(hh > 400 && hh < 500 ){
console.log("clearInterval hide");			
				clearInterval(hideIntervalID);
				$("#div_" + myID).hide();
				isHideFinish = true;
				
			}
		}, 100);
	};
	
	this.setHTML = function(html){
		try{
			$self.val(html);
			oEditors.getById[myID].exec("PASTE_HTML", [html]);
			//$("#div_" + myID).find("iframe").css("height", myHeight);
		}
		catch(e){
			console.log(e);
		}
	};

	this.getHTML = function(html){
		return oEditors.getById[myID].getIR();
	};
	
	
	var myHeight = $self.css("height");

	//var isHidden = $(self).css("display") == "none"; 
	var isHidden = $(self).attr("isHidden") == "true"; 

	$self.wrap("<div id=\"div_" + myID + "\" class=\"htmlarea\" style=\"margin:0px;padding:0px\"></div");
	$self.css("display", "none");
	
	nhn.husky.EZCreator.createInIFrame({
		oAppRef: oEditors,
		elPlaceHolder: myID,
		sSkinURI: "/idsiSFK/neo/ext/js/smarteditor2-master/workspace/SmartEditor2Skin.html",	
		htParams : {
			bUseToolbar : true,				// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
			bUseVerticalResizer : true,		// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
			bUseModeChanger : true,			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
			//bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
			//aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
			fOnBeforeUnload : function(){
				//alert("완료!");
			},
			I18N_LOCALE : "ko_KR"  // 언어 (ko_KR/ en_US/ ja_JP/ zh_CN/ zh_TW), default = ko_KR
		}, //boolean
		fOnAppLoad : function(){
			//예제 코드
			//oEditors.getById["ir1"].exec("PASTE_HTML", ["로딩이 완료된 후에 본문에 삽입되는 text입니다."]);
		},
		fCreator: "createSEditor2"
	});

	var $editor = $("#div_" + myID + " iframe");
	this.editor = null;
	if($editor.length > 0) this.editor = $editor[0];

	if(isHidden) {
		this.hideWebEditor();
	}
	
}


//******************************************************************************************
// GridView
//******************************************************************************************
function NeoSafeKoreaGridView(){
	var self  = this;
	var $self = $(self);
	var id    = this.id

	this.onbeforeinitialize;
	var beforeInit = $(self).attr("onbeforeinitialize");
	if(beforeInit) {
		beforeInit = beforeInit.replace("(", "").replace(")", "").replace(" ", "");
		this.onbeforeinitialize = window[beforeInit];
	}
	
	var lastAtoCellMergeColIndex = $(self).attr("lastAutoCellMergeColumnIndex");
	if(lastAtoCellMergeColIndex == undefined || isNaN(lastAtoCellMergeColIndex)) 
		 lastAtoCellMergeColIndex = 999;
	else lastAtoCellMergeColIndex = parseInt(lastAtoCellMergeColIndex);
		
	this.columnsInfo = [];
	this.selectedIndex = -1;
	
	this.getDataList = function(){
		var dataListAttr = $(self).attr("dataList");
		if(window[dataListAttr]) this.dataList = window[dataListAttr];
		return self.dataList;
	};
	
	this.getColumnID = function(idx){
		var colInfo = self.columnsInfo[idx];
		return colInfo.dataIndx;
	};
	
	this.getColumnIndex = function(id){
		if(typeof id === 'number') return id;

		for(var i=0; i<self.columnsInfo.length; i++){
			if(self.columnsInfo[i].dataIndx == id) return i;
		}
		return -1;
	};
	
	this.setCellChecked = function(row, col, checked){
		var idx = self.getColumnIndex(col);
		var $tr = $self.find(".pq-grid-row[pq-row-indx=" + row + "]");
		var $check = $tr.find("td[pq-col-indx='" + idx + "']").find("input[type=checkbox], input[type=radio]");
		if($check.length > 0) $check[0].checked = checked;
	};
	
	this.getCheckedJSON = function(col){
		var idx    = self.getColumnIndex(col);
		var $chkTr = $self.find("[pq-col-indx='" + idx + "']").find("input:checked").closest("tr");
		
		var jsonArr = [];
		for(var i=0; i<$chkTr.length; i++){
			var row  = $($chkTr[i]).attr("pq-row-indx");
			var json = self.dataList.getRowJSON(parseInt(row));
			jsonArr.push(json);
		}
		return jsonArr;
	};
	
	this.getCheckedIndex = function(col){
		var idx    = self.getColumnIndex(col);
		var $chkTr = $self.find("[pq-col-indx='" + idx + "']").find("input:checked").closest("tr");

		if($chkTr.length == 0) return -1;
		var row = $($chkTr[0]).attr("pq-row-indx");
		return parseInt(row);
	};
	
	this.setReadOnly = function(isReadOnly){
		$self.pqGrid({editable:(isReadOnly == false)} );
	};
	this.setCellReadOnly = function(row, col, isReadOnly){
		var idx = self.getColumnIndex(col);
		var colM = $self.pqGrid("option" , "colModel");
		colM[idx].editable = (isReadOnly == false);
		$self.pqGrid("option", "colModel", colM);
	};
	
	this.setDisabled = function(isDisabled){
		if(isDisabled == true){
			$self.find("td").attr("disabled", "disabled");
			$self.addClass(".w2grid_disabled");
			$self.css("opacity", "0.7");
			$self.css("filter",  "alpha(opacity=70)");
		}
		else {
			$self.find("td").removeAttr("disabled");
			$self.css("opacity", "");
			$self.css("filter",  "");
		}
	};
	this.setCellDisabled = function(row, col, isDisabled){
		var idx = self.getColumnIndex(col);
		
		var $tr = $self.find(".pq-grid-row[pq-row-indx=" + row + "]");
		var $td = $tr.find("td[pq-col-indx='" + idx + "']");
		if(isDisabled == true){
			$td.attr("disabled", "disabled");
			$td.css("opacity", "0.7");
			$td.css("filter",  "alpha(opacity=70)");
		}
		else {
			$td.removeAttr("disabled");
			$td.css("opacity", "");
			$td.css("filter",  "");
		}
	};
	this.setFocusedCell = function(rowIndx, dataIndx){
		var colIndx = self.getColumnIndex(dataIndx);
		$self.pqGrid("setSelection", {rowIndx:2, focus : true} );
//		$self.pqGrid("setSelection", {rowIndx:rowIndx, colIndx:colIndx, focus : true} );
		
		
//		$self.pqGrid("editCell", {rowIndx:rowIndx, colIndx:colIndx} );
	};
	
    this.gridOptions = {
    	  isAutoCellMerge : ("true" == $(self).attr("autoCellMerge"))
    	, showNoRows     : ("false" != $(self).attr("showNoRows"))
    	, lastAutoCellMergeColumnIndex : lastAtoCellMergeColIndex
    	, showTop        : false
    	, showHeader     : true                      //default true
    	, showBottom     : $self.attr("showBottom") == "true" //default true
    	, rowBorders     : $self.attr("rowBorders") == "true" //default true
    	, columnBorders  : $self.attr("colBorders") == "true" //default true
    	, numberCell     : {show : ($self.attr("showRowNo") == "true")}
	    , width          : "100%"
	    , height         : $self.attr("height")	    
	    , flexHeight     : $self.attr("height") == "flex"                     //내용높이로 조정되어 수직 스크롤바 사라짐 default false
		, scrollModel    : {autoFit:true}            // autoFit, 
		, selectionModel : { type: null, mode:null}  // default {type : 'row', mode : 'range', 모두 : null, cbAll : null, cbHeader : null}
		, numberCell     : { show: false }           // number 추가  default true
    	, hoverMode      : "row"                     // 셀 및 행의 호버 (mouseenter 및 mouseleave) 동작을 제공합니다. default row
       	, editable       : ($(self).attr("editable") == "true") // 편집 활성화 default true
    	, sortable       : false                     // 정렬 활성화 default true	  
    	, wrap           : $self.attr("wrap") == "true"
    	, dragColumns    : { enabled: false }
		, stripeRows     : $self.attr("stripeRows") != "false" // default true
		, autoTooltip    : $self.attr("autoTooltip") != "false" // default true
    	
/*
	    , flexWidth  : false                                 //내용넓이로 조정되어 수평 스크롤바 사라짐 default false
		, pageModel : { type: "local", rPP: 10, strRpp: "{0}", strDisplay: "{0} to {1} of {2}" }
*/

//    	, colModel  : self.columnsInfo  이후에....
    	, cellClick : function (event, ui) {
    			var row = ui.rowIndx;
    			var col = ui.colIndx;
    	    	self.selectedIndex = ui.rowIndx;
		    	if(self.onCellClick4User) self.onCellClick4User(row, col);
		  }
    	, rowClick : function (event, ui) {
			var row = ui.rowIndx;
	    	if(self.onRowClick4User) self.onRowClick4User(row);
    	  }
		, columnResize: function( event, ui ) {
				if(self.gridOptions.autoTooltip) refreshToolTip();
		  }
	};
    
	this.getCheckedAllRowIndex = function(){
		var rows = [];
		var $checked = $self.find("input[type='checkbox']:checked");
		for(var i=0; i<$checked.length; i++){
			var chkObj = $checked[i];
			var $tr = $(chkObj).closest("tr");
			var idx = $tr.attr("pq-row-indx");
			rows.push(parseInt(idx));
		}
		
		return rows;
	};
	
	this.setHeaderValue = function(id, value){
		var colModel=$self.pqGrid("option", "colModel");
		var idx = -1;
		for(var i=0; i<colModel.length; i++){
			if(colModel[i].dataIndx == id) {
				idx = i;
				break;
			} 
		}
		if(idx == -1) return;
		colModel[i].title = value;
		$self.pqGrid("option", "colModel", colModel);
		$self.pqGrid( "refreshHeader" );
	};
	
	this.getHeaderValue = function(id){
		var colModel=$self.pqGrid("option", "colModel");
		var idx = -1;
		for(var i=0; i<colModel.length; i++){
			if(colModel[i].dataIndx == id) {
				idx = i;
				break;
			} 
		}
		if(idx == -1) return;
		return colModel[i].title;
	};
	
	this.setColumnVisible = function(colIndex, isVisible, isNotRefresh){
		if(colIndex == -1) return;
		var colModel = $self.pqGrid("option", "colModel");
		colModel[colIndex].hidden = !(isVisible);
		$self.pqGrid("option", "colModel", colModel);
		if(isNotRefresh == false) self.refresh();
	}
	
    this.onCellClick4User = null;
    this.onRowClick4User = null;
	
    this.refresh = function(){
    	self.selectedIndex = -1;
    	var dataListAttr = $(self).attr("dataList");
    	if(window[dataListAttr]) self.dataList = window[dataListAttr];
    	if(self.dataList){
        	for(var i=0; i<self.dataList.data.length; i++){
        		var data = self.dataList.data[i];
        		var attr = {};
        		for(var key in data) {
        			attr[key] = {title : data[key]};
        		}
        		data.pq_cellattr = attr;
        	}
    		$(self).pqGrid("option", "dataModel",  { data: self.dataList.data } );
    	}
		$(self).pqGrid("refreshDataAndView");
		$(self).pqGrid("refresh");

		if(self.gridOptions.showNoRows == false){
			$self.find(".pq-grid-norows").hide();
		}
		
		if(self.gridOptions.autoTooltip) refreshToolTip();
	};

	function refreshToolTip(){
		$(self).find("td").each(function() {
					if (getTdTextWidth(this) + 10 > this.offsetWidth) {
							this.title = $(this).text();
							//$(this).tooltip();
					} 
					else {
						this.title = "";
					}
		});
	}
	
	this.insertRow = function(row){
		$(self).pqGrid("addRow", {rowData:{}, rowIndx: row})	
	};
	
	this.deleteRow = function(row){
		$(self).pqGrid( "deleteRow", {rowIndx:row} ); 		
	};
	
	this.getRowData = function(row){
		var rowData = $(self).pqGrid("getRowData", {rowIndxPage:row} );
		return rowData;
	};
	
	this.getAllRowData = function(){
		var columnList = [];
		for(var i=0, idx=0; i<self.columnsInfo.length; i++){
			var colModel = self.columnsInfo[i];
			if(colModel.dataIndx) columnList.push(colModel.dataIndx);
			if(colModel.colModel){
				for(var k=0; k<colModel.colModel.length; k++){
					var childColModel = colModel.colModel[k];
					if(childColModel.dataIndx) columnList.push(childColModel.dataIndx);
					if(childColModel.colModel){
						for(var m=0; m<childColModel.colModel.length; m++){
							var childChildColModel = childColModel.colModel[m];
							if(childChildColModel.dataIndx) columnList.push(childChildColModel.dataIndx);
						}
					}
				}
			}
		}

		var data = $(self).pqGrid( "getData", { dataIndx: columnList} );
		return data;
	};
	
	
	this.setDisplayFormat = function(dataIndx, format){
		for(var i=0; i<self.columnsInfo.length; i++){
			if(self.columnsInfo[i].dataIndx != dataIndx) continue;
			self.columnsInfo[i].displayFormat = format;
			break;
		}
	};
	
	this.getColumnsInfo = function(){
		return self.columnsInfo;
	};
	
	this.setColumnsInfo = function(colsInfo){
		self.columnsInfo = colsInfo;
	};
	
	this.getGridOption = function(){
		return self.gridOptions;
	};
	
	this.setGridOption = function(opt){
		self.gridOptions = opt;
	};
	
	// column정보를 child <columns> 하위의 <column>에서 읽어와 setting한다.
	function getColumnInfoFromChildColumnHtml(){
		var retColModels = [];
		var gridChildren = self.children;
		for(var i=0; i<gridChildren.length; i++){
			if(gridChildren[i].nodeName != "COLUMNS") continue;
			var columnNodes = gridChildren[i].children;
			for(var k=0; k<columnNodes.length; k++){
				if(columnNodes[k].nodeName != "COLUMN") continue;
				var column = {};
				column.dataIndx      = columnNodes[k].getAttribute("id");
				column.title         = columnNodes[k].getAttribute("title");
				column.align         = columnNodes[k].getAttribute("textAlign");
				column.width         = columnNodes[k].getAttribute("width");
				column.minWidth      = columnNodes[k].getAttribute("minWidth");
				column.maxWidth      = columnNodes[k].getAttribute("maxWidth");
				column.resizable     = (columnNodes[k].getAttribute("resizable") != "false");
				column.displayFormat = columnNodes[k].getAttribute("displayFormat");
				column.button        = columnNodes[k].getAttribute("button");
				column.buttonClass   = columnNodes[k].getAttribute("buttonClass");
				column.buttonStyle   = columnNodes[k].getAttribute("buttonStyle");
				column.onButtonClick = columnNodes[k].getAttribute("onButtonClick");
				column.buttonPosition= columnNodes[k].getAttribute("buttonPosition");
				column.editable      = (columnNodes[k].getAttribute("editable") == "true");
				column.type          = columnNodes[k].getAttribute("type");
				column.cls           = columnNodes[k].getAttribute("cls")
				column.hiddeen       = (columnNodes[k].getAttribute("hidden") == "true");
				column.isRadio       = columnNodes[k].getAttribute("isRadio")
				column.isCheckbox    = columnNodes[k].getAttribute("isCheckbox")
				column.checkedValue  = columnNodes[k].getAttribute("checkedValue")
				column.uncheckedValue= columnNodes[k].getAttribute("uncheckedValue")

				if(isNull(column.displayFormat) == false ) column.render = displayFormatRenderProc;
				if(isNull(column.button)        == false ) column.render = buttonRenderProc;
				if(column.isRadio               == "true") column.render = radioRenderProc;
				if(column.isCheckbox            == "true") column.render = checkboxRenderProc;

				var editor = columnNodes[k].getAttribute("editor");
				if(editor == "date"){
					var dtOption = columnNodes[k].getAttribute("dateOption");
					if(isNull(dtOption) == true) {
						dtOption = neoGridViewDateOption;
					}
					else{
						if(window[dtOption] == undefined) 
							dtOption = neoGridViewDateOption;
						else
							dtOption = window[dtOption];
					}
					
	                dtOption.showAnim = '';
	                dtOption.onSelect = function(){
	                    this.firstOpen = true;
	                };
	                dtOption.beforeShow = function (input, inst) {
	                    return !this.firstOpen;
	                };
	                dtOption.onClose = function() {
	                    //this.focus();
	                };
	                dtOption.onSelect = function(dateText, inst) {
	                	//inst.input.val()
	                };
					
			        var dateEditor = function (ui) {
			            var $inp = ui.$cell.find("input");
			            $inp.val(neoSafeKoreeaFormat(ui.cellData, "yyyy-mm-dd"));
			            $inp.datepicker(dtOption);
			        }					
					column.editor = { type: 'textbox', init:dateEditor };
					column.editor.getData = function(ui){
						var data = ui.$cell.find("input").val();
						return neoSafeKoreeaUnFormat(data, "yyyy-mm-dd");
					}
					column.render = function (ui) {
							var cellData = ui.cellData;
							if (cellData) {
								return neoSafeKoreeaFormat(cellData, "yyyy-mm-dd");
							}
							else {
								return "";
							}
					};
					column.validations = [];
				}
				else  column.editor = JSON.parse(editor)

				var headerColSpan = columnNodes[k].getAttribute("headerColSpan");
				if(isNaN(headerColSpan) == false) column.headerColSpan = parseInt(headerColSpan);
				
				column.halign = "center";
				if(column.width<1) column.hidden=true;
				retColModels.push(column);
			}
		}
		return retColModels;
	}
	
	function displayFormatRenderProc(ui){
    	var colData = ui.rowData[ui.dataIndx];
    	if(colData == null) colData = "";
    	
    	var colModel = self.columnsInfo[ui.colIndx];

    	// DisplayFormat
		if(colModel.displayFormat != undefined && colModel.displayFormat != ""){
        	colData = neoSafeKoreeaFormat(colData, colModel.displayFormat);
		} 
        
        return colData;
	}
	
	function buttonRenderProc(ui){
		var colModel = self.columnsInfo[ui.colIndx];
        if(isNull(colModel.button) == true) return ui.cellData;

        var colData = ui.cellData;
    	if(colData == null) colData = "";
    	
    	var onButtonClick = colModel.onButtonClick;
    	if(onButtonClick == undefined) onButtonClick = "";
    	else {
    		var p = onButtonClick.indexOf("(");
    		if(p >= 0) onButtonClick.substring(0, p);
    		onButtonClick = onButtonClick.replace("(", "");
    		onButtonClick = onButtonClick.replace(")", "");
    		onButtonClick = onButtonClick.replace(" ", "");
    		onButtonClick = " onclick=\"" + onButtonClick + "(" + ui.rowIndx + "," + ui.colIndx + ",'" + ui.dataIndx + "')\""
    	}
    	
    	var buttonStyle = colModel.buttonStyle;
    	if(buttonStyle == undefined) buttonStyle = " style=\"width:100%; height:30px;\"";
    	else {
    		buttonStyle = " style=\"" + buttonStyle + "\"";
    	}
    	
    	var buttonHtml = "<button class=\"gridViewButton " + colModel.buttonClass + "\"" + buttonStyle + onButtonClick + ">" + colModel.button + "</button>";
    	if(colModel.buttonPosition == "frist") 
    		colData = buttonHtml + colData;
    	else
    		colData = colData + buttonHtml;
        
        return colData;
	}
	
	function radioRenderProc(ui){
		var colModel = self.columnsInfo[ui.colIndx];
		
        var colData = ui.cellData;
    	if(isNull(colData) == true) colData = "N";
    	
    	var checked = "";
    	if(colData == colModel.checkedValue) checked = "checked";  

    	var onclick = "";
    	if(colModel.checkedValue || colModel.uncheckedValue){
        	onclick = " onclick=\"this.checked" 
		            + "?" + this.dataList.id + ".setCellData(" + ui.rowIndx + "," + ui.dataIndx + "','" + colModel.checkedValue + "')"
		            + ":" + this.dataList.id + ".setCellData(" + ui.rowIndx + "," + ui.dataIndx + "','" + colModel.uncheckedValue + "')"
		            + "\"";
    	}
    	
    	var html = "<input type=\"radio\" name=\"" + self.id + "_" + ui.dataIndx + "\" " + checked + " " + onclick + " style=\"outline:0px\">";

    	return html;
	}
	
	function checkboxRenderProc(ui){
		var colModel = self.columnsInfo[ui.colIndx];
		
        var colData = ui.cellData;
    	if(isNull(colData) == true) colData = "N";
    	
    	var checked = "";
    	if(colData == colModel.checkedValue) checked = "checked";  

    	var onclick = "";
    	if(colModel.checkedValue || colModel.uncheckedValue){
        	onclick = " onclick=\"this.checked" 
		            + "?" + this.dataList.id + ".setCellData(" + ui.rowIndx + "," + ui.dataIndx + "','" + colModel.checkedValue + "')"
		            + ":" + this.dataList.id + ".setCellData(" + ui.rowIndx + "," + ui.dataIndx + "','" + colModel.uncheckedValue + "')"
		            + "\"";
    	}
    	
    	var html = "<input type=\"checkbox\" name=\"" + self.id + "_" + ui.dataIndx + "\" " + checked + " " + onclick + " style=\"outline:0px\">";

    	return html;
	}
	
	function checkboxRenderProc(ui){
		var colModel = self.columnsInfo[ui.colIndx];
		
        var colData = ui.cellData;
    	if(isNull(colData) == true) colData = "N";
    	
    	var checked = "";
    	if(colData == colModel.checkedValue) checked = "checked";  
    		
    	var onclick = "";
    	if(colModel.checkedValue || colModel.uncheckedValue){
	    	onclick = " onclick=\"this.checked" 
	    	        + "?" + this.dataList.id + ".setCellData(" + ui.rowIndx + "," + ui.dataIndx + "','" + colModel.checkedValue + "')"
	    	        + ":" + this.dataList.id + ".setCellData(" + ui.rowIndx + "," + ui.dataIndx + "','" + colModel.uncheckedValue + "')"
	    	        + "\"";
    	}
    	
    	var html = "<input type=\"checkbox\" name=\"" + self.id + "_" + ui.dataIndx + "\" " + checked + " " + onclick + " style=\"outline:0px\">";

    	return html;
	}
	
	function initialize(colsInfo){
		if(colsInfo === undefined) self.columnsInfo = getColumnInfoFromChildColumnHtml();
		if(self.onbeforeinitialize) self.onbeforeinitialize();
		
		var usrOnCellClick = $(self).attr("oncellclick");
		if(usrOnCellClick) usrOnCellClick = usrOnCellClick.replace("()", ""); 
		if(usrOnCellClick) self.onCellClick4User = window[usrOnCellClick];
		
		var dataListAttr = $(self).attr("dataList");
		if(window[dataListAttr]) self.dataList = window[dataListAttr];
		
		var dataListAttr = $(self).attr("dataList");
		if(window[dataListAttr]) self.dataList = window[dataListAttr];
	    
		self.gridOptions.colModel = self.columnsInfo;
	    $(self).pqGrid(self.gridOptions);
	    
	    if(self.dataList) self.refresh();

	
		var arrangedColumnsInfo = [];
		for(var i=0, idx=0; i<self.columnsInfo.length; i++){
			var colModel = self.columnsInfo[i];
			if(colModel.dataIndx) arrangedColumnsInfo.push(colModel);
			if(colModel.colModel){
				for(var k=0; k<colModel.colModel.length; k++){
					var childColModel = colModel.colModel[k];
					if(childColModel.dataIndx) arrangedColumnsInfo.push(childColModel);
					if(childColModel.colModel){
						for(var m=0; m<childColModel.colModel.length; m++){
							var childChildColModel = childColModel.colModel[m];
							if(childChildColModel.dataIndx) arrangedColumnsInfo.push(childChildColModel);
						}
					}
				}
			}
		}
		self.columnsInfo = arrangedColumnsInfo;
	}
	initialize();
}


//******************************************************************************************
// GridView edit type select 관련 초기화 
//******************************************************************************************
function neoInitGridSelectColumn(gridView, gridColIndx, gridDataIndx, dataList, valueID, textID){
	if(gridView.selectColumnIndexArr == undefined) gridView.selectColumnIndexArr = [];
	gridView.selectColumnIndexArr.push(gridColIndx);
	var colModel = $(gridView).pqGrid("option", "colModel");

	colModel[gridColIndx].editor = { type: "select"};
	
	//
	colModel[gridColIndx].editor.mapValueText = {};
	colModel[gridColIndx].editor.mapTextValue = {};
	colModel[gridColIndx].editor.options = [];
	for(var i=0; i<dataList.getRowCount(); i++){
		var value = dataList.getCellData(i, valueID);
		var text  = dataList.getCellData(i, textID);
		colModel[gridColIndx].editor.mapValueText[value] = text;
		colModel[gridColIndx].editor.mapTextValue[text] = value;
		colModel[gridColIndx].editor.options.push(text);
	}
	
	colModel[gridColIndx].editor.init = function(ui){
        var $select = ui.$cell.find("select");
        var columnIndx = this.getColumnIndex(ui.dataIndx);
        $select.val(this.columnsInfo[columnIndx].editor.mapValueText[ui.cellData]);
	};
	
	//
    colModel[gridColIndx].render = function(ui) {
		return this.columnsInfo[ui.colIndx].editor.mapValueText[ui.cellData];
    };

    $(gridView).pqGrid("option", "colModel", colModel);

	//
	$(gridView).pqGrid({
	    change: function(event, ui) {
	    	if(ui.rowList.length == 0) return;

	    	for(var i=0; i<this.selectColumnIndexArr.length; i++){
	    		var selectColumnIndx = this.selectColumnIndexArr[i]
	    		var dataIndx = this.columnsInfo[selectColumnIndx].dataIndx;

	    		if(ui.rowList[0].newRow == undefined) continue;
		    	var value = ui.rowList[0].newRow[dataIndx];
	    		if(value == undefined) continue;
		    		ui.rowList[0].rowData[dataIndx] = this.columnsInfo[selectColumnIndx].editor.mapTextValue[value];
	    	}
	    }
	});
}	


//******************************************************************************************
//pageList
//******************************************************************************************
function NeoSafeKoreaPaging(){
	var self = this;
	var $self = $(self);

	var classPrefix = $self.attr("classPrefix");
	if(isNull(classPrefix)) classPrefix = "";
	
	var naviClass    = classPrefix + "pageNavi";
	var pageClass    = classPrefix + "pagelist_label";
	var curPageClass = classPrefix + "pagelist_label_selected";
	
	this.pageMap  = null;
	this.pageSize = "";
	
    this.pageHeader = "";
    this.pageBody   = "";
    this.pageFooter = "";
		           
    this.pageCount     = 0;
    this.selectedIndex = 0;
    
    this._drawPageCount_ = 10;
    this._bgnPageIdx_    = 0; 
    this._endPageIdx_    = 0; 
    
    this.pageType        = "pageType2";

    this.setCount = function(cnt){
    	cnt =  (cnt=="") ? 0 : parseInt(cnt);
    	self.pageCount = cnt;
    	drawPageList();
    }

    this.getCount = function(){
    	return self.pageCount;
    }

    this.setSelectedIndex = function(idx){
    	idx = parseInt(idx);
    	self.selectedIndex = idx;
    	
    	if(idx<self._bgnPage_ || idx>self._endPage_){
    		drawPageList();
    	}
    	else {
	    	$(self).children("span").removeClass(curPageClass);
	    	$(self).find("[pageIndex=" + idx + "]").addClass(curPageClass);
    	}
    }

    this.getSelectedIndex = function(){
    	return self.selectedIndex;
    }

    this.onPageClick = function(e){
    	var idx = $(e.target).attr("pageIndex");
    	if(idx == "frst") idx = 1;
    	else if(idx == "prev") {
    		//idx = self._bgnPage_ - 1;
    		if(self.selectedIndex == 1) return;
    		idx = self.selectedIndex - 1;
    	}
    	else if(idx == "next") {
    		//idx = self._endPage_ + 1;
//    		if(self.selectedIndex == self._endPage_) return;
    		if(self.selectedIndex == self.pageCount) return;
    		idx = self.selectedIndex + 1;
    	}
    	else if(idx == "last") idx = self.pageCount;
    	else idx = parseInt(idx);
    	if(idx < 1) idx = 1;
    	if(idx > self.pageCount) idx = self.pageCount;
    	
    	if(self.selectedIndex == idx) return;

    	self.selectedIndex = idx;
    	
    	if(self.onpageclick) self.onpageclick(idx);
    	
    	self.setSelectedIndex(idx); // 테스트용 나중에 삭제 할 것
    };
    
    
    function initialize(){
        $(self).addClass(naviClass);
		var pgSize = $(self).attr("pageSize");
		if(isNaN(pgSize) == false) self._drawPageCount_ = parseInt(pgSize);

		var onClickAttr = $(self).attr("onclick");
		if(onClickAttr){
			onClickAttr = onClickAttr.replace("(", "").replace(")", "").replace(" ", ""); 
			self.onpageclick = window[onClickAttr];
		}
		self.onclick = null;
		
		var pageListhtml = "";
		var pagePrefix  = '<table class="' + classPrefix + 'pageList_table" cellspacing="0" cellpadding="0"><tbody><tr>'
                        + '<td title="첫 페이지"     class="' + classPrefix + 'pageList_first_btn" role="button" aria-pressed="false" pageIndex="frst"></td>'
                        + '<td title="이전 페이지"   class="' + classPrefix + 'pageList_prev_btn"  role="button" aria-pressed="false" pageIndex="prev"></td>';
		var pagePostfix = '<td title="다음 페이지"   class="' + classPrefix + 'pageList_next_btn"  role="button" aria-pressed="false" pageIndex="next"></td>'
                        + '<td title="마지막 페이지" class="' + classPrefix + 'pageList_last_btn"  role="button" aria-pressed="false" pageIndex="last"></td>'
                        + '</tr></tbody></table>';
		$(self).html(pagePrefix + pagePostfix);
		
		drawPageList();                                    
	}
	
	function drawPageList(){
        $(self).find("." + classPrefix + "pageList_label_td").remove();
      
        var startPage = Math.floor((Math.abs(self.selectedIndex - 1)) / self._drawPageCount_) * self._drawPageCount_ + 1;
        var endPage   = startPage + self._drawPageCount_ - 1;
		
		self._bgnPage_ = startPage;
		self._endPage_ = Math.min(endPage, self.pageCount);
		
		var goPrevObj = $(self).find("." + classPrefix + "pageList_next_btn");

		for(var i=startPage; i<=endPage; i++){
			if(i>self.pageCount) break;
			var pgClass = pageClass;
			if(i == self.selectedIndex) pgClass += ' ' + curPageClass;
			var pgHtml = '<td class="' + classPrefix + 'pageList_label_td">'
				       + '<div title="' + i + '" class="' + pgClass + '" role="button" aria-pressed="false" pageIndex="' + i +'">' + i + '</div>'
				       + '</td>';    				
			goPrevObj.before(pgHtml);
		}
      
		var pageSpanObj = $(self).find("div, ." + classPrefix + "pageList_first_btn, ." + classPrefix + "pageList_prev_btn, ." + classPrefix + "pageList_next_btn, ." + classPrefix + "pageList_last_btn");
		pageSpanObj.unbind("click");
		pageSpanObj.bind("click", self.onPageClick);
	}
	
	initialize();
}

function NeoSafeKoreaPaging2(){

	var self    = this;
	var pageTag ="span";
	
	var onClickAttr  = $(self).attr("onclick");
	self.onpageclick = window[onClickAttr];
	self.onclick     = null;
	
	this.pageSize      = 1;
	this.selectedIndex = 1;

	this.setCount = function(cnt){
		cnt = parseInt(cnt);
		self.pageSize = cnt;
		drawPageList();
	}
	
	this.getCount = function(){
		return self.pageCount;
	}
	
	this.setSelectedIndex = function(idx){
		idx = parseInt(idx);
		self.selectedIndex = idx;
	}
	
	this.onPageClick = function(e){

    	var idx = $(e.target).attr("pageIndex");
    	if(idx == "prev") idx = self.selectedIndex-1;
    	else if(idx == "prev") {
    		idx = self._bgnPage_ - 1;
    	}
    	else if(idx == "next") {
    		if(self.selectedIndex + 1 > self.pageSize ) return;
    		idx = self.selectedIndex + 1;
    	}
    	else if(idx == "search"){
    		idx = $("#bbs_page").val();
    	}
    	else idx = parseInt(idx);
    	if(idx < 1) idx = 1;
    	if(idx > self.pageCount) idx = self.pageCount;
    	
    	if(self.selectedIndex == idx) return;

    	self.selectedIndex = idx;
    	
    	if(self.onpageclick) self.onpageclick(idx);
    	
    	self.setSelectedIndex(idx); // 테스트용 나중에 삭제 할 것

    };
	
	
	function drawPageList(){
		var pageIndex = "1";
		var pageSize  = "1";
		var maxPage   = self.pageSize;
		var selectedIndex = self.selectedIndex;
			
		var pageList2Html = '<'+ pageTag + ' style="float:left;" class="pageNaveGoPrev2" pageIndex="prev" title="이전페이지" tabindex="0" role="button" area-prossed="false">[ < ]</span>' 
				          + '<div style="float:left;">'
				          + '<span id="minPage">'+selectedIndex+'</span> / <span id="maxPage">'+maxPage+'</span>'
				          + '</div>'
				          + '<'+ pageTag + ' float:left class="pageNaveGoNext2" pageIndex="next" title="다음페이지" tabindex="0" role="button" area-prossed="false">[ > ]</span>'
				          + '<input id="bbs_page" type="text" style="width:30px; height:17px;" value ="">'
				          + '<'+ pageTag + ' class="pageSearch2" pageIndex="search" title="페이지이동" tabindex="0" role="button" area-prossed="false">이동</span>';
	
		$(self).html(pageList2Html);
		
		var pageSpanObj = $(self).children("span");
		pageSpanObj.unbind("click");
		pageSpanObj.bind("click", self.onPageClick);
		
	}
	
	drawPageList();
}


//******************************************************************************************
// ready
//******************************************************************************************
$(function() {
	safeKoreaEngineInitializeObject();
});

