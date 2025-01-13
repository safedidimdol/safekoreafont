$.ajaxSetup({ cache: false });
//전역으로 로드할떄 실
var flagParam = true;
var $li = $('#gen').find('li').clone();

	var mapIcon = true;
	var cggArr = [];
	
	var hdSD;
	var hdSGG;
	
	$(function(){
		// doMapView();

		init_content();
	});

	function init_content(){
		setArcd1Select();
		//setArcdRn1Select();
		//clickAreaBtn(2);
		clickAreaBtn(1);
	}

	var rd_flag = false;
	var bd_flag = false;
	
	//조회 함수
	function fn_search () {
	
		rd_flag = false;
		bd_flag = false;
		flagParam = true;
		
		var arcd="";
		
		if(num==1){
					
			if(isNull(document.getElementById("sbLawArea2").value)) {
				alert("시군구를 선택하시기 바랍니다.");
				return;
			}
			if(isNull(document.getElementById("sbLawArea3").value)) {
				
			arcd = document.getElementById("sbLawArea2").value;
		
			var arr = hdSGG;
			if(arcd == '36110') arr = hdSD; //세종시일때 시도로 검색
			var sgg = _.find(arr ,function(v){
				return v.ARCD.substring(0,5) ==  arcd  
			});
			readJSONFile("evacuateList", sgg.ORG_CD);
				
			} else {
				bd_flag = true;
				arcd = $("#sbLawArea2").val();
				var arr = hdSGG;
				if(arcd == '36110') arr = hdSD; //세종시일때 시도로 검색
				var sgg = _.find(arr ,function(v){
					return v.ARCD.substring(0,5) ==  arcd  
				});
				readJSONFile("evacuateList", sgg.ORG_CD);
				/*
				var jdata1;
				var promise = jQuery.ajax({
			           url:"/idsiSFK/sfk/ca/cac/are2/waterListEmdStr.do",
			           type:"POST",
			           dataType:"json",
			           data:{'cgg_code' :$("#sbLawArea2").val(), 'emd_nm': $('#sbLawArea3 option:selected').text(),'facilSeCode':'2'},
			           async:false
			     });
				promise.done(succFunc);
				*/
			}
		}
		if(num==2){if(isNull(document.getElementById("rdn_code").value)) {
			if($("#sbRnArea1").val() == ""){
				alert('시도를 선택하시기 바랍니다.');
				return false;
			} // end if
			
			if(($("#sbRnArea1").val() != "") && ($("#sbRnArea2").val() == "")){
				alert('시군구를 선택하시기 바랍니다.');
				return false;
			}

			if($("#sbRnArea1").val() !=""){
				if($("#sbRnArea2").val() !=""){
					//시군구 기관코드
					arcd = cggArr[document.getElementById("sbRnArea2").selectedIndex - 1];

					if(arcd == undefined){
						arcd = '5690000';
					}
					readJSONFile("evacuateList", arcd);
				} else{
					alert("시군구를 선택하시기 바랍니다.");
					return;
				}
			}
		} else {
				//arcd = document.getElementById("rdn_code").value;
				
				rd_flag = true;
				arcd = cggArr[document.getElementById("sbRnArea2").selectedIndex - 1];

				if(arcd == undefined){
					arcd = '5690000';
				}
				readJSONFile("evacuateList", arcd);
				
				//setHTMLList();
				
				//evaListRn();
				//도로명 검색
				
				
			}
		
		}
	};

	function succFunc(jdataRn,textStatus){
	
	 	jdata=jdataRn.List;//사용

		pageIndex = 1;
		pageSize = parseInt(jdata.length / 10) + 1;
		if(jdata.length != 0 && parseInt(jdata.length % 10) == 0) {
			pageSize -= 1;
		}
	 	setHTMLList();
	}

	// callback
	//조회 콜백
	function setHTMLList() {
		var length;
		
		_.forEach(jdata,function(obj1) {
			_.forEach(replaceArr,function(v){
				if(_.includes(obj1.FACIL_ADDR,v.pr) || _.includes(obj1.FACIL_RD_ADDR,v.pr)){
					obj1.FACIL_RD_ADDR = _.replace(obj1.FACIL_RD_ADDR ,v.be, v.af);
					obj1.FACIL_ADDR = _.replace(obj1.FACIL_ADDR,v.be, v.af);
				}
			})
		});

		
		//도로명 필터
		var rd_text = $('#rdn_code option:selected').html();
				
		if(rd_flag){
			jdata = _.filter(jdata, function(v){
				return !_.isEmpty(_.intersection(_.split(v.FACIL_RD_ADDR,' '), _.split(rd_text)));
			});
		};	
		
		//법정동 필터
		var bd_text = $('#sbLawArea3 option:selected').html();
		//bd_text = "호명읍";
		
		if(bd_flag){			
			jdata = _.filter(jdata, function(v){
				return !_.isEmpty(_.intersection(_.split(v.FACIL_ADDR,' '), _.split(bd_text)));
			});
		};

		
		pageSize = parseInt(jdata.length / 10) + 1;
		if(jdata.length != 0 && parseInt(jdata.length % 10) == 0) {
			pageSize -= 1;
		}
				
		var totCnt = jdata.length;
		$('#total-num').text(totCnt);
		length = jdata.length;
		
		$('#gen').empty();
		if(totCnt > 0) $('.board-list-nodata').hide(); else $('.board-list-nodata').show();
		if(jdata.length == 0) {
		
			//오류나서 추가
			document.getElementById("tbpageindex").innerHTML = pageIndex;
			document.getElementById("tbpagetotal").innerHTML = "/" + pageSize;
			document.getElementById("iptpageinput").value = pageIndex;
			//document.getElementById("spTotal").innerHTML = totCnt;
			
			return;
		}
		

		if(pageIndex == pageSize) {
			length = (jdata.length % 10) != 0 ? (jdata.length % 10) : 10;
		} else {
			length = 10;
		}

		$li.show();
	
		for(i = 0; i < length; i++) {
									
			//var $cell1 = $li.find('#a1'); //주소
			var $cell2 = $li.find('#a2'); //시설명
			var $cell3 = $li.find('#a3'); //시설면적
			//var $cell4 = $li.find('#a4'); //수용인원
			//var $cell5 = $li.find('#a5');
			
			var $cellm = $li.find('#am'); //도로명
			var $celln1 = $li.find('#an1'); //도로명
			var $celln2 = $li.find('#an2'); //법정동
			var $celln3 = $li.find('#an3'); //수용인원
			var $celln4 = $li.find('#an4'); //시설구분
			var $celln5 = $li.find('#an5'); //시설구분
			
			
			if(mapIcon) {		
				$cellm.attr('onClick',"fn_openPop(" + i + ")");				
				var facil_rd_addr = jdata[10*(pageIndex-1)+i].FACIL_RD_ADDR.replace('강원도','강원특별자치도');
				facil_rd_addr = facil_rd_addr.replace('경상북도 군위군','대구광역시 군위군');
				facil_rd_addr = facil_rd_addr.replace('전라북도','전북특별자치도');
				var facil_addr = jdata[10*(pageIndex-1)+i].FACIL_ADDR.replace('강원도','강원특별자치도');
				facil_addr = facil_addr.replace('경상북도 군위군','대구광역시 군위군');
				facil_addr = facil_addr.replace('전라북도','전북특별자치도');
				
				if(jdata[10*(pageIndex-1)+i].FACIL_RD_ADDR != null){
					var rdAddr = "<a class='ellipsis mapView_link' href='javascript:fn_openPop("+i+")'>" + '<i class="ri-map-pin-2-line"></i>'  + facil_rd_addr + "<br/>"; 
					var bdAddr = "<a class='ellipsis mapView_link' href='javascript:fn_openPop("+i+")'>" + '<i class="ri-map-pin-2-line"></i>' + facil_addr
					
					$celln1.html(rdAddr);
					$celln2.html(bdAddr);
					
					//if(facil_rd_addr == '') rdAddr = "<a class='ellipsis mapView_link' href='javascript:fn_openPop("+i+")'>";
					
					//var addr =  rdAddr + bdAddr;
				
					//$cell1.html(addr);
				} else {
					//$c1.html("도로명 : <br/>법정동 : " + facil_addr);
				}
			} else {
				var facil_rd_addr = jdata[10*(pageIndex-1)+i].FACIL_RD_ADDR.replace('강원도','강원특별자치도');
				facil_rd_addr = facil_rd_addr.replace('경상북도 군위군','대구광역시 군위군');
				facil_rd_addr = facil_rd_addr.replace('전라북도','전북특별자치도');
				var facil_addr = jdata[10*(pageIndex-1)+i].FACIL_ADDR.replace('강원도','강원특별자치도');
				facil_addr = facil_addr.replace('경상북도 군위군','대구광역시 군위군');
				facil_addr = facil_addr.replace('전라북도','전북특별자치도');
				var innerHTML = "도로명 : " + facil_rd_addr + "<br/>법정동 : " + facil_addr;
				$cell1.html(innerHTML);
			}
			innerHTML =  jdata[10*(pageIndex-1)+i].FACIL_NM ;
			$cell2.html(innerHTML);			
			innerHTML = jdata[10*(pageIndex-1)+i].FACIL_POW + jdata[10*(pageIndex-1)+i].FACIL_UNIT ;
			$cell3.html(innerHTML);
			
			//수용인원
			if(jdata[10*(pageIndex-1)+i].FACIL_GBN_NM == "공공시설") {
				innerHTML = parseInt(jdata[10*(pageIndex-1)+i].FACIL_POW/0.825) + "명";
				$celln3.html(innerHTML);
			} else if (jdata[10*(pageIndex-1)+i].FACIL_GBN_NM == "정부지원") {
				innerHTML =  parseInt(jdata[10*(pageIndex-1)+i].FACIL_POW/1.43) + "명";
				$celln3.html(innerHTML);
			}
			
			
			
			//시설구분
			$celln4.html(jdata[10*(pageIndex-1)+i].FACIL_GBN_NM);
			
			//상세코드
			var FACIL_DTL_CODE = jdata[10*(pageIndex-1)+i].FACIL_DTL_CODE;
						
			var bathchair = "";
			
			if(!_.isEmpty(FACIL_DTL_CODE)){
				var chairArr = FACIL_DTL_CODE.split(',');
				if(chairArr[0] != ""){
					if(chairArr.length > 0){
						bathchair = "<a class='' href='javascript:fn_openPop("+i+")'>" + "<img src='/idsiSFK/neo/ext/img/bathchair.png'></img>" + "</a>";	
					}	
				}
				$celln5.parents('.col5').css('display','');  
				$celln5.html('이용가능시설');  
			}
			else{
				$celln5.parents('.col5').css('display','none');
			}
			
			//cell5.innerHTML = "<span style='word-break:break-all'>" + chairArr.toString() + "</span>";
			innerHTML = "<span style='word-break:break-all'>" + bathchair + "</span>";
			//$cell5.html(innerHTML);
	
			$lic = $li.clone();
			$lic.find("[id]").removeAttr("id")
			$('#gen').append($lic);
		}

		document.getElementById("tbpageindex").innerHTML = pageIndex;
		document.getElementById("tbpagetotal").innerHTML = "/" + pageSize;
		document.getElementById("iptpageinput").value = pageIndex;
		//document.getElementById("spTotal").innerHTML = totCnt;
		
		
		var $pagination = $('#pagination');

	    var defaultOpts = {
	        totalPages: 35,
            visiblePages: 4,
            first: '처음', 
            prev : '이전',
            next: '다음',
            last: '마지막'
	    };
	    
	    var totalPages = pageSize;
	            var currentPage = $pagination.twbsPagination('getCurrentPage');
	             if(flagParam) currentPage = 1;
	            $pagination.twbsPagination('destroy');
	            $pagination.twbsPagination($.extend({}, defaultOpts, {
	                startPage: currentPage,
	                totalPages: totalPages
	            }));
	    $pagination.twbsPagination(defaultOpts).on('page', function (event, page) {
			flagParam = false;
    		console.info(page + ' (from event listening)');
    	    pageIndex = page;
    		setHTMLList();
		 });
	};

	function apagebefore_onclick() {
		if(pageIndex != 1){
			pageIndex -= 1;
			document.getElementById("tbpageindex").innerHTML = pageIndex;
			setHTMLList();
		}
	};

	function apagenext_onclick() {
		if(pageIndex < pageSize){
			pageIndex += 1;
			document.getElementById("tbpageindex").innerHTML = pageIndex;
			setHTMLList();
		}
	};

	function apagego_onclick() {
		var i = document.getElementById("iptpageinput").value;

		if(i <= pageSize && i > 0){
			pageIndex = parseInt(i);
			document.getElementById("tbpageindex").innerHTML = pageIndex;
			setHTMLList();
		}
	};

	function fn_openPop(row){
		var json = jdata[10*(pageIndex-1)+row];

		var arnm ;
		if(json.FACIL_RD_ADDR != ""){
			arnm = json.FACIL_RD_ADDR;
			var _addr = arnm.split(' ');
			var addr = "";
			for(var i = 0; i < _addr.length; i++){
				if(_addr[i].substring(0,1) == "("){
					break;
				}
				else if(i == 0){
					addr = _addr[i];
				}
				else{
					addr += " " + _addr[i];
				}
			}
			arnm = addr;
		}
		else{
			arnm = json.FACIL_ADDR;
		}
		var underSe = '지상';
		if(json.JISG_UNDER_SE == '1'){
			underSe = '지하';
		}

		arnm = arnm.split(',')[0];
		
		//배열로
		var facilDtlArr = [];
		if(json.FACIL_DTL_NM != null){
			facilDtlArr = json.FACIL_DTL_NM.split('@').join(', ');		
		}
		//필터
		/*
		var facilDtlFilterArr = facilDtlArr.filter(function(item) {
		    return !item.startsWith('경사');
		});
		*/
		
	 	var param = {
	 		"addr" :  arnm ,
	 		"facilNm" : json.FACIL_NM,
	 		"facilLode" : json.FACIL_LODE,
	 		"facilLomi" : json.FACIL_LOMI,
	 		"facilLose" : json.FACIL_LOSE,
	 		"facilLade" : json.FACIL_LADE,
	 		"facilLami" : json.FACIL_LAMI,
	 		"facilLase" : json.FACIL_LASE,
	 		"jisgUnderse" : underSe,
			"facilDtl" : facilDtlArr.toString()
	 	}
	 	
 		var lo = ""; // 경도 127....
 		var la = ""; // 위도 36.....
 		lo = Number(json.FACIL_LODE) + Number(json.FACIL_LOMI) / 60 + Number(json.FACIL_LOSE) / 3600;
 		la = Number(json.FACIL_LADE) + Number(json.FACIL_LAMI) / 60 + Number(json.FACIL_LASE) / 3600;
 		url = "/idsiSFK/neo/mapViewPopup_neo.html?lo="+lo+"&la="+la+"&facilNm="+encodeURI(encodeURIComponent(param.facilNm)) + '' +  "&facilDtl="+encodeURI(encodeURIComponent(param.facilDtl));
	    window.open( url, "spamMain", "height=660px; width=660px; left=0; top=0; toolbar=no, menubar=no, location=no, status=yes, realzable=no, fullscreen=no, scrollbars=no, resizable=yes");

	}

	// 지역선택(시도)
	function setArcd1Select() {
		var list1 = document.getElementById("sbLawArea1");
		var list2 = document.getElementById("sbLawArea2");
		var list3 = document.getElementById("sbLawArea3");

		var length1 = list1.length;
		var length2 = list2.length;
		var length3 = list3.length;

		for(i = 0; i < length1; i++) {
			//list1.remove(0);
		}
		for(i = 0; i < length2; i++) {
			//list2.remove(0);
		}
		for(i = 0; i < length3; i++) {
			//list3.remove(0);
		}

		var option = document.createElement("option");
		option.value = "";
		option.text = "시도 선택";

		//list1.add(option);

		list1.value = "";
		list2.value = "";
		list3.value = "";

		readJSONFile("/arcd/bd/bd_sido");
		$.getJSON("/idsiSFK/neo/ext/json/arcd/hd/hd_sido.json", function(data) {
			hdSD = data;
		});

		
	}
	// 지역선택(시도) 콜백
	function setArcd1Select_callBack(jdata) {
		var list = document.getElementById("sbLawArea1");

		for(i = 0; i < jdata.length; i++) {
			var option = document.createElement("option");

			option.value = jdata[i].SIDO_CD;
			option.text = jdata[i].SIDO_NM;

			list.add(option);
		}
	}
	// 지역선택(시군구)
	function setArcd2Select() {
		var sido = document.getElementById("sbLawArea1").value;

		var list2 = document.getElementById("sbLawArea2");
		var list3 = document.getElementById("sbLawArea3");

		var length2 = list2.length;
		var length3 = list3.length;
		
		$('#sbLawArea2 option').not("[value='']").remove();
		$('#sbLawArea3 option').not("[value='']").remove();
		
		for(i = 0; i < length2; i++) {
			//list2.remove(0);
		}
		for(i = 0; i < length3; i++) {
			//list3.remove(0);
		}

		if(isNull(sido))
			return;

		var option = document.createElement("option");
		option.value = "";
		option.text = "시군구 선택";

		//list2.add(option);

		list2.value = "";
		list3.value = "";

		var orgCd = hdSD[document.getElementById("sbLawArea1").selectedIndex - 1].ORG_CD;
		
		$.getJSON("/idsiSFK/neo/ext/json/arcd/hd/" + orgCd + "/hd_sgg.json", function(data) {
			hdSGG = data;
		});

		if(sido == "5690000") {
			var option2 = document.createElement("option");
			option2.value = "5690000";
			option2.text = "세종시";

			list2.add(option2);
		} else {
			readJSONFile("/arcd/bd/" + sido + "/bd_sgg");
		}
	}
	// 지역선택(시군구) 콜백
	function setArcd2Select_callBack(jdata) {
		var list = document.getElementById("sbLawArea2");

		for(i = 0; i < jdata.length; i++) {
			var option = document.createElement("option");

			option.value = jdata[i].SGG_CD;
			option.text = jdata[i].SGG_NM;

			list.add(option);
		}
	}
	
	
	// 지역선택(읍면동)
	function setArcd3Select() {
		var sido = document.getElementById("sbLawArea1").value;
		var sgg = document.getElementById("sbLawArea2").value;

		var list3 = document.getElementById("sbLawArea3");

		var length3 = list3.length;

				
		$('#sbLawArea3 option').not("[value='']").remove();
		
		for(i = 0; i < length3; i++) {
			//list3.remove(0);
		}

		if(isNull(sido) || isNull(sgg))
			return;

		var option = document.createElement("option");
		option.value = "";
		option.text = "읍면동 선택";

		//list3.add(option);

		list3.value = "";


		$.getJSON("/idsiSFK/neo/ext/json/arcd/bd/" + sido + "/" + sgg + "/bd_emd.json", function(data) {
				 _.forEach(data, function(obj1) {
					_.forEach(replaceArr,function(v){
						if(_.includes($('#sbLawArea1 option:selected').html(),v.pr)){
							obj1.EMD_NM = _.replace(obj1.EMD_NM ,v.be, v.af);
						};
					});
				});

				var list = document.getElementById("sbLawArea3");
			
					_.forEach(data,function(v){
						var option = document.createElement("option");
						option.value = v.EMD_CD;
						option.text = v.EMD_NM;
						list.add(option);
					});
		});
					
				
			
	}
	// 지역선택(읍면동) 콜백
	function setArcd3Select_callBack(jdata) {
		var list = document.getElementById("sbLawArea3");

		for(i = 0; i < jdata.length; i++) {
			var option = document.createElement("option");

			option.value = jdata[i].ORG_CD;
			option.text = jdata[i].ORG_NM;

			list.add(option);
		}
	}

	// 지역선택(시도)------------도로명-------------
	function setArcdRn1Select() {

		var list1 = document.getElementById("sbRnArea1");
		var list2 = document.getElementById("sbRnArea2");

		var length1 = list1.length;
		var length2 = list2.length;


		for(i = 0; i < length1; i++) {
			list1.remove(0);
		}
		for(i = 0; i < length2; i++) {
			list2.remove(0);
		}

		var option = document.createElement("option");
		option.value = "";
		option.text = "시도 선택";

		list1.add(option);
		list1.value = "";
		list2.value = "";


		readJSONFile("/arcd/hd/hd_sido",'','Y');
	}
	// 지역선택(시도) 콜백
	function setArcdRn1Select_callBack(jdata) {

		var list = document.getElementById("sbRnArea1");

		for(i = 0; i < jdata.length; i++) {
			var option = document.createElement("option");

			option.value = jdata[i].ORG_CD;
			option.text = jdata[i].ORG_NM;

			list.add(option);
		}
	}
	// 지역선택(시군구)
	function setArcdRn2Select(){
		$("#rdn_code").empty();
        $("#rdn_code").append("<option value='' selected='selected'>선택</option>");
        $("#rn").val("").prop("selected", true);
		var sido = document.getElementById("sbRnArea1").value;

		var list2 = document.getElementById("sbRnArea2");

		var length2 = list2.length;


		for(i = 0; i < length2; i++) {
			list2.remove(0);
		}
	
		if(isNull(sido))
			return;
		var option = document.createElement("option");
		if(sido != "5690000"){
		$("#sbRnArea2").attr("Disabled",false);
		$('#sbRnArea2').css('background-color','#ffffff');
		option.value = "";
		option.text = "시군구 선택";
		list2.add(option);

		list2.value = "";
		}

		if(sido == "5690000") {
			option.value = "36110000";
			option.text = "세종시";
			list2.add(option);
			$("#sbRnArea2").attr("Disabled",true);
			$('#sbRnArea2').css('background-color','#c7c7c7');
		} else {
			readJSONFile("/arcd/hd/" + sido + "/hd_sgg",'','Y');

			$.getJSON("/idsiSFK/neo/ext/json/arcd/hd/" + $('#sbRnArea1').val() + "/hd_sgg.json", function(data) {
				cggArr = [];
				for(i = 0; i < data.length; i++) {
					cggArr.push(data[i].ORG_CD);
				}
			});
		}
	}
	
	// 지역선택(시군구) 콜백
	function setArcdRn2Select_callBack(jdata) {
		var list = document.getElementById("sbRnArea2");

		for(i = 0; i < jdata.length; i++) {
			var option = document.createElement("option");
			var ARCD = jdata[i].ARCD.substr(0,5);
			/* alert(ARCD+"a"); */
			option.value = ARCD;
			option.text = jdata[i].ORG_NM;

			list.add(option);
		}
	}

	function setArcdRn3Select(){
		$("#rdn_code").empty();
        $("#rdn_code").append("<option value='' selected='selected'>선택</option>");
        $("#rn").val("").prop("selected", true);
	}
	/**
	* 콤보박스
	*  val : 선택된 코드값, codeStep:코드단계 , type: 1->1단계코드조회, 2->2단계코드조회
	*/
	function fn_doroList(cd1id, cd2id, val, codeStep, type, guBun)
	{
		
		if($("#sbRnArea1").val() == ""){
			alert('시도를 선택하시기 바랍니다.');
			return false;
			$("#rn option:eq(0)").prop("selected", true);
		} // end if
		
		if(($("#sbRnArea1").val() != "") && ($("#sbRnArea2").val() == "")){
			alert('시군구를 선택하시기 바랍니다.');
			return false;
			$("#rn option:eq(0)").prop("selected", true);
		}
		
		if($("#sbRnArea2").val()==""){alert("시군구를 선택하시오");$("#sbRnArea2").focus(); return;}
	     var gubun = guBun == "s" ? "선택" : "선택";

	     if(type == '1'){
	           $('#'+cd1id).attr("disabled",true);
	          
	           if(codeStep == "2" || codeStep == "3"){
	                $('#'+cd1id).attr("disabled",false);
	           }else{
	                $('#'+cd1id).attr("disabled",true);
	           }

	     }

	     jQuery.ajax({
	           url:"/idsiSFK/sfk/ca/cac/are2/RoadNmList.do",
	           type:"POST",
	           dataType:"json",
	           data:{'sggcd' :$("#sbRnArea2").val(), 'rn': val,'type' : type},
	           async:false,
	           success:function(data,textStatus){
	                jQuery("#"+cd1id).empty();
	                jQuery("#"+cd1id).append("<option value='' selected='selected'>"+gubun+"</option>");

	                for(var i=0; i < data.List.length ; i++){

	                     if(val == ''){
	                           jQuery("#"+cd1id).append("<option value="+data.List[i].rncd+">"+data.List[i].rn+"</option>");
	                     }else{
	                           jQuery("#"+cd1id).append("<option value="+data.List[i].rncd+">"+data.List[i].rn+"</option>");
	                     }
	                }

	                if(type == "1")
	                {
	                     jQuery("#"+cd2id).empty();
	                     jQuery("#"+cd2id).append('<option value = "" selected="selected">'+gubun+'</option>');
	                }
	           },
	           error:function(request,status,error){
	               
	              }
	     });
	}

	function clickAreaBtn(num1){
		num=num1;
		if(num == 1){ // 지역구분이 지역일 경우,
			$("#sbRnArea1").val('');
			$("#sbRnArea2").val('');

			$("#sbRnArea1").attr("Disabled",true);
			$("#sbRnArea2").attr("Disabled",true);

			$("#rn").attr("Disabled",true);

			$("#rdn_code").attr("Disabled",true);

			$("#sbLawArea1").attr("Disabled",false);
			$("#sbLawArea2").attr("Disabled",false);
			$("#sbLawArea3").attr("Disabled",false);

			$('#sbRnArea1').css('background-color','#c7c7c7');
			$('#sbRnArea2').css('background-color','#c7c7c7');
			$('#rn').css('background-color','#c7c7c7');
			$('#rdn_code').css('background-color','#c7c7c7');

			$('#sbRnArea1').css('padding-left','10px');
			$('#sbRnArea2').css('padding-left','10px');
			$('#rn').css('padding-left','10px');
			$('#rdn_code').css('padding-left','10px');
			$("#rn").val('');

			$("#rdn_code").val('');


			// 행정동 활성화 및 색상설정
			$('#sbLawArea1').css('background-color','#ffffff');
			$('#sbLawArea2').css('background-color','#ffffff');
			$('#sbLawArea3').css('background-color','#ffffff');
		} else if(num == 2){ // 지역구분이 도로명일 경우,
			// 행정동 비활성화 및 색상설정
			$('#sbLawArea1').attr('readonly',true);
			$('#sbLawArea2').attr('readonly',true);
			$('#sbLawArea3').attr('readonly',true);
			$('#sbLawArea1').css('background-color','#c7c7c7');
			$('#sbLawArea2').css('background-color','#c7c7c7');
			$('#sbLawArea3').css('background-color','#c7c7c7');
			$('#sbLawArea1').css('padding-left','10px');
			$('#sbLawArea2').css('padding-left','10px');
			$('#sbLawArea3').css('padding-left','10px');


			$("#sbLawArea1").attr("Disabled",true);
			$("#sbLawArea2").attr("Disabled",true);
			$("#sbLawArea3").attr("Disabled",true);

			 $("#sbLawArea1").val('');
			 $("#sbLawArea2").val('');
			 $("#sbLawArea3").val('');

			$("#sbRnArea1").attr("Disabled",false);
			$("#sbRnArea2").attr("Disabled",false);
			$("#rn").attr("Disabled",false);
			$("#rdn_code").attr("Disabled",false);

			$('#sbRnArea1').css('background-color','#ffffff');
			$('#sbRnArea2').css('background-color','#ffffff');
			$('#rn').css('background-color','#ffffff');
			$('#rdn_code').css('background-color','#ffffff');
		}
	}