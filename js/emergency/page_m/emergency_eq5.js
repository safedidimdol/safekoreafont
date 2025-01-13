$.ajaxSetup({ cache: false });
var flagParam = true;
var mapIcon = true;
//**************************************************************************
// DataMap
//**************************************************************************
var neoSafeKoreaDataMapList = [

		//****************************************
		// dm_searchInfo
		//****************************************
		{
			id : "dm_searchInfo",
			data : {
				  pageIndex          : "1"
				, pageUnit           : "10"
				, pageSize           : "10"
				, firstIndex         : "1"
				, lastIndex          : "1"
				, recordCountPerPage : "10"
				, q_area_cd_3        : ""
				, q_area_cd_2        : ""
				, q_area_cd_1        : ""
				, searchRstrNm       : ""
				, searchFcltyTy      : ""
				, searchYear         : ""
				, searchChckAirconAt : ""
				, govAreaCode        : ""
				, parntsBdongCd      : ""
				, searchCdKey        : ""
				, searchGb           : ""
				, acmdfclty_cd       : ""
			}
		},

		//****************************************
		// dm_selectCondition
		//****************************************
		{
			id : "dm_selectCondition",
			data : {
				  sidoCd : ""
				, sggCd  : ""
				, emdCd  : ""
			}
		},

		//****************************************
		// dm_resultMap
		//****************************************
		{
			id : "dm_resultMap",
			data : {
				  resultCode  : ""
				, resultMsg   : ""
				, totCnt      : ""
				, pageSize    : ""
				, redirectUrl : ""
			}
		}
];


//**************************************************************************
// DataList
//**************************************************************************
var neoSafeKoreaDataListList = [
		{ id:"comArea1" },
		{ id:"comArea3" },
		{ id:"comArea2" },
		{ id:"comCodeList1" },
		{ id:"acmdFcltyList" }
];


//**************************************************************************
// Submission
//**************************************************************************
var neoSafeKoreaSubmissionList = [

		//******************************************************************
		// getBdongSsgCd_submission
		//******************************************************************
		{
			  id         : "getBdongSsgCd_submission"
			, processMsg : "조회중입니다..."
			, mode       : "synchronous"
			, ref        : {"id":"dm_selectCondition","key":"reqInfo"}
			, target     : [{"id":"comArea2","key":"List"},{"id":"dm_resultMap","key":"rtnResult"}]
			, action     : "/idsiSFK/sfk/ca/cac/are2/bdongSsgList.do"
		},

		//******************************************************************
		// getBdongSidoCd_submission
		//******************************************************************
		{
			  id         : "getBdongSidoCd_submission"
			, processMsg : "조회중입니다..."
			, mode       : "synchronous"
			, ref        : {"id":"dm_selectCondition","key":"reqInfo"}
			, target     : [{"id":"comArea1","key":"List"},{"id":"dm_resultMap","key":"rtnResult"}]
			, action     : "/idsiSFK/sfk/ca/cac/are2/bdongSidoList.do"
		},

		//******************************************************************
		// getSelect_submission
		//******************************************************************
		{
			  id         : "getSelect_submission"
			, processMsg : "조회중입니다..."
			, submitdone : getSelect_submitdone
			, ref        : {"id":"dm_searchInfo","key":"searchInfo"}
			, target     : [{"id":"acmdFcltyList","key":"acmdFcltyList"},{"id":"dm_resultMap","key":"rtnResult"}]
			, action     : "/idsiSFK/sfk/cs/sfc/selectAcmdFcltyList.do"
		},

		//******************************************************************
		// getComArea1_submission
		//******************************************************************
		{
			  id         : "getComArea1_submission"
			, processMsg : "조회중입니다..."
			, mode       : "synchronous"
			, ref        : {"id":"dm_selectCondition","key":"reqInfo"}
			, target     : [{"id":"comArea1","key":"List"},{"id":"dm_resultMap","key":"rtnResult"}]
			, action     : "/idsiSFK/sfk/ca/cac/are2/area2List.do"
		},

		//******************************************************************
		// getComArea2_submission
		//******************************************************************
		{
			  id         : "getComArea2_submission"
			, processMsg : "조회중입니다..."
			, mode       : "synchronous"
			, ref        : {"id":"dm_selectCondition","key":"reqInfo"}
			, target     : [{"id":"comArea2","key":"List"},{"id":"dm_resultMap","key":"rtnResult"}]
			, action     : "/idsiSFK/sfk/ca/cac/are2/area2List.do"
		},

		//******************************************************************
		// getComArea3_submission
		//******************************************************************
		{
			  id         : "getComArea3_submission"
			, processMsg : "조회중입니다..."
			, mode       : "synchronous"
			, ref        : {"id":"dm_selectCondition","key":"reqInfo"}
			, target     : [{"id":"comArea3","key":"List"},{"id":"dm_resultMap","key":"rtnResult"}]
			, action     : "/idsiSFK/sfk/ca/cac/are2/area2List.do"
		},

		//******************************************************************
		// getComCdInfo_submission
		//******************************************************************
		{
			  id         : "getComCdInfo_submission"
			, processMsg : "조회중입니다..."
			, mode       : "synchronous"
			, ref        : {"id":"dm_searchInfo","action":"select","key":"searchInfo"}
			, target     : [{"id":"comCodeList1","key":"cd_list"}]
			, action     : "/idsiSFK/sfk/ca/cma/getComCdList.do"
		},

		//******************************************************************
		// getBdongEmdCd_submission
		//******************************************************************
		{
			  id         : "getBdongEmdCd_submission"
			, processMsg : "조회중입니다..."
			, mode       : "synchronous"
			, ref        : {"id":"dm_selectCondition","key":"reqInfo"}
			, target     : [{"id":"comArea3","key":"List"},{"id":"dm_resultMap","key":"rtnResult"}]
			, action     : "/idsiSFK/sfk/ca/cac/are2/bdongEmdList.do"
		}
];


$(function(){
	safeKoreaEngineInitializeDataMap(neoSafeKoreaDataMapList);
	safeKoreaEngineInitializeDataList(neoSafeKoreaDataListList);
	safeKoreaEngineInitializeSubmission(neoSafeKoreaSubmissionList);
});
//**************************************************************************
//
//**************************************************************************
        var jdata = [];
        // onload
		var useAt        = 'Y';
		var pageParam    = CommonUtil.getParameters();
		var acmdfclty_cd = "3";
		var pageIndex    = null;

		// onload
		$(function(){
			//doMapView();

			init();
		})

		//초기화
		function init() {

			//법정동 시도코드 불러오기
			fn_getBdongSidoCd();

			// pageParam.acmdfclty_cd 체크
			if (acmdfclty_cd=="1"){
				dm_searchInfo.set( "acmdfclty_cd" , "1" );
				$("#title").text("지진피해 장기화시 주거지가 파손된 이재민등을 대상으로 집단구호를 실시하기 위하여 내진설계가 적용된 시설물입니다.");
			}
			else if (acmdfclty_cd=="2"){
				dm_searchInfo.set( "acmdfclty_cd" , "2" );
				$("#title").text("지진발생초기 운동장, 공터 등 구조물 파손 및 낙하물로부터 안전한 외부대피장소입니다.");
			}
			else if(acmdfclty_cd == "3"){
				$("#title").text("");
			}

			var curYear            = DateUtil.getToday();
			var searchChckAirconAt = pageParam.searchChckAirconAt;

			dm_searchInfo.set( "searchFcltyTy", pageParam.searchFcltyTy );
			dm_searchInfo.set( "searchYear",    curYear.substring(0,4) );
			dm_searchInfo.set( "searchRstrNm",  pageParam.searchRstrNm );
			dm_searchInfo.set( "govAreaCode",   pageParam.govAreaCode );
			dm_searchInfo.set( "pageIndex",     CommonUtil.nvl(pageParam.pageIndex, "1") );
			dm_searchInfo.set( "searchGb",      "pageSearch" );
			dm_searchInfo.set( "acmdfclty_cd" , acmdfclty_cd );
			

			//dm_searchInfo.set( "searchChckAirconAt" , "");
		}

		function fn_comArea1search() {
			dm_selectCondition.set("upperOrgCd","0");
			dm_selectCondition.set( "searchGb" , "" );
			getComArea1_submission.exec();
		}

		function fn_getBdongSidoCd() {
			$.getJSON("/idsiSFK/neo/ext/json/arcd/bd/bd_sido.json", function(data) {
				for(i = 0; i < data.length; i++) {
					var sidoNm = data[i].SIDO_NM;
					//if( sidoNm == "부산광역시" || sidoNm == "울산광역시" || sidoNm == "강원특별자치도" || sidoNm == "경상북도" ){
						sbLawArea1.addItem( data[i].SIDO_CD , sidoNm , i );
					//}
				}
				/*
				  var selectElement = document.getElementById('sbLawArea1');
				  var options = Array.from(selectElement.options);

				  var indexOfGyeongsangbukdo = options.findIndex(function(option) {
				    return option.value === '47';
				  });

				  var indexOfGangwon = options.findIndex(function(option) {
				    return option.value === '51';
				  });

				  if (indexOfGyeongsangbukdo !== -1 && indexOfGangwon !== -1) {
				    // 값을 교환
				    var temp = options[indexOfGyeongsangbukdo];
				    options[indexOfGyeongsangbukdo] = options[indexOfGangwon];
				    options[indexOfGangwon] = temp;

				    // select 태그 업데이트
				    selectElement.innerHTML = '';
				    options.forEach(function(option) {
				      selectElement.add(option);
				    });
				  }
				  */
			});
		}
		function sbLawArea1_onchange() {
			dm_selectCondition.set("sidoCd", sbLawArea1.getValue() );
			//alert(dm_searchInfo.get("q_area_cd_1"));
			dm_searchInfo.set("q_area_cd_2", "");

			// 법정동 시군구 하위 콤보 초기화
			sbLawArea2.removeAll();

			$.getJSON("/idsiSFK/neo/ext/json/arcd/bd/" + sbLawArea1.getValue() + "/bd_sgg.json", function(data) {
				for(i = 0; i < data.length; i++) {
					sbLawArea2.addItem( data[i].SGG_CD , data[i].SGG_NM , i );
				}
			});
		};

		//조회 함수
		function fn_search (param) {
			
			if(typeof param == 'undefined') flagParam = true; else flagParam = false;
				
			var sbLawArea1 =  dm_searchInfo.get("q_area_cd_1");	// 시도 코드
			var sbLawArea2 =  dm_searchInfo.get("q_area_cd_2");	// 시군구 코드

			var numArcd;
			var codeArcd;
			dm_searchInfo.set('q_area_cd_2',  $('#sbLawArea2').val());
			sbLawArea2 = $('#sbLawArea2').val();
				if( sbLawArea2 == "") {
					alert("시군구까지 선택하시기 바랍니다.");

					return;
				}
			

			if(sbLawArea1 != ""){
				if( sbLawArea2 != ""){	//2개 입력
					codeArcd = sbLawArea2;
				}
				else{	//1개 입력
					codeArcd = sbLawArea1;
				}
				dm_searchInfo.set( "govAreaCode" , codeArcd );
			}
			else{
				dm_searchInfo.set("govAreaCode", "");
			}

			acmdFcltyList.removeAll();
			dm_searchInfo.set( "searchGb" , "pageSearch" );

			// 현재 년도
			var curYear = DateUtil.getToday();
			dm_searchInfo.set("searchYear", curYear.substring(0,4));

			// 시설명 검색
			dm_searchInfo.set("searchRstrNm", $("#searchKeyword").val() );

			/*
			dm_searchInfo.set("searchChckAirconAt" , $("#search_type_v").val() );
			if (acmdfclty_cd=="1"){
				dm_searchInfo.set( "searchChckAirconAt" , "적용");
			}
			*/
			var sidoNm = $('#sbLawArea1 option:selected').html();
			if( !(sidoNm == "부산광역시" || sidoNm == "울산광역시" || sidoNm == "강원특별자치도" || sidoNm == "경상북도") ){
				$('#total-num').text('0');				
				$("#gen").empty();
				$('.board-list-nodata').show();
				dm_resultMap.set( "pageSize",1 );
				setPageNav();
				return;
			};

			//if(CommonUtil.isNull(dm_searchInfo.get( "searchRstrNm" ))) {
				$.getJSON("/idsiSFK/neo/ext/json/tsunamiShelterList/tsunamiShelterList_" + dm_searchInfo.get( "govAreaCode" ) + ".json", function(data) {
					//debugger;
					console.log('getJsonData');
					jdata = [];
					if(!CommonUtil.isNull(dm_searchInfo.get( "searchFcltyTy" ))) {
						for(var i = 0; i < data.length; i++) {
							if((data[i].SHEL_DIV_TYPE == $("#sch20-2 option:checked").text()))
								jdata.push(data[i]);
							else
								continue;
						}
					} else
						jdata = data;

			     	pageIndex = CommonUtil.nvl(dm_searchInfo.get( "pageIndex" ), "1");
					var stRowIndex = 0 ;
					var lastRowIndex = dm_searchInfo.get( "recordCountPerPage" );

					gen.removeAll();

					var cnt;
					if(!CommonUtil.isNull(dm_searchInfo.get( "searchRstrNm" ))){
						var filterName = dm_searchInfo.get( "searchRstrNm" );
						jdata = _.filter(jdata, function(v){
							 return _.includes(v.SHEL_NM,_.trim(filterName));							
						});						
					}
					
					dm_resultMap.set( "totCnt" , jdata.length);					
					var totCnt = parseInt(dm_resultMap.get( "totCnt"));
					$('#total-num').text(totCnt);
					dm_resultMap.set( "pageSize" , Math.floor(totCnt / Number(dm_searchInfo.get("recordCountPerPage"))) + Math.floor((totCnt % Number(dm_searchInfo.get("recordCountPerPage")) == 0 ? 0 : 1)));

					if(pageIndex == dm_resultMap.get("pageSize")) {
						cnt = (jdata.length % 10) != 0 ? (jdata.length % 10) : 10;
					} else {
						cnt = 10;
					}

					if(totCnt > 0) $('.board-list-nodata').hide(); else $('.board-list-nodata').show();

					if(cnt>0 && totCnt > 0){

						for(var i=0;i<cnt;i++){
							
							var json = jdata[10*(pageIndex-1)+i];
							gen.insertChild(  );
							//var anc = "신주소 : "+json.acmdFcltySeCd + " " + json.dtlAdres + "<br/>구주소 :" +json.rnDtlAdres + "<span class='gps_imgSet_icon'><i class='ir'>지도보기</i></span>"
							//gen.getChild( i , "a1" ).setValue( json.SHEL_DIV_TYPE );
							gen.getChild( i , "a2" ).setValue( json.SHEL_NM );
							gen.getChild( i , "am" ).setHref( "javascript:fn_openPop2("+i+")" );
							if(mapIcon) {
								//var anc = + "<span class='gps_imgSet_icon'><i class='ir'>지도보기</i></span>";
								var anc = '<i class="ri-map-pin-2-line"></i>' + json.ADDRESS  ;
								gen.getChild( i , "a3" ).setValue( anc );
								gen.getChild( i , "a3" ).setHref( "javascript:fn_openPop2("+i+")" );
								$('#'+gen.getChild(i, "a3").id).attr('title', '새창열림');
							} else {
								var addr = json.ADDRESS;
								gen.getChild( i , "addr" ).setValue( addr );
							}
							gen.getChild( i , "a4" ).setValue( json.SHEL_AV+"명" );
							//gen.getChild( i , "a5" ).setValue( json.TEL );
							
							gen.getChild( i , "an1" ).setValue( json.SHEL_DIV_TYPE );
							if(_.isEmpty(json.SHEL_DIV_TYPE)){								
								$(gen.getChild( i , "an1" )).parents('.col2').remove();
							}
							
							gen.getChild( i , "an2" ).setValue( json.TEL );
							if(_.isEmpty(json.TEL)){								
								$(gen.getChild( i , "an2" )).parents('.col5').remove();
							}
							
						}
					}
					else{
						dm_resultMap.set( "pageIndex" ,"1");
						dm_resultMap.set( "pageSize"  ,"1");
						dm_resultMap.set( "totCnt"    ,"0");

						//var html = "<tr><td colspan='5'><span>해당 지역에 지진해일긴급대피장소가 없습니다.</span></td></tr>"
			   			//$("#gen").html(html);

						$('.board-list-nodata').show();   
					}
					dm_searchInfo.set( "pageSize" , dm_resultMap.get( "pageSize" ) );
					tbpageindex.setValue( dm_searchInfo.get( "pageIndex" ) );
					tbpagetotal.setValue( "/"+dm_searchInfo.get( "pageSize" ) );
					iptpageinput.setValue( dm_searchInfo.get( "pageIndex" ) );

					setPageNav();
				});
			//} else {
				//getSelect_submission.exec();
			//}
		}

		// callback
		//조회 콜백
		function getSelect_submitdone(e) {
			if (!CommonUtil.errorCheck(dm_resultMap)) {
				return;
			}
	     	pageIndex = CommonUtil.nvl(dm_searchInfo.get( "pageIndex" ), "1");
			var stRowIndex = 0 ;
			var lastRowIndex = dm_searchInfo.get( "recordCountPerPage" );

			gen.removeAll();

			var cnt = acmdFcltyList.getRowCount();
			var totCnt = parseInt(dm_resultMap.get( "totCnt"));

			if(cnt>0 && totCnt > 0){
				for(var i=0;i<cnt;i++){
					var json = acmdFcltyList.getRowJSON( i );
					gen.insertChild(  );
					//var anc = "신주소 : "+json.acmdFcltySeCd + " " + json.dtlAdres + "<br/>구주소 :" +json.rnDtlAdres + "<span class='gps_imgSet_icon'><i class='ir'>지도보기</i></span>"
					//gen.getChild( i , "a1" ).setValue( json.SHEL_DIV_TYPE );
					gen.getChild( i , "a2" ).setValue( json.SHEL_NM );
					if(mapIcon) {						
						//var anc = '<i class="ri-map-pin-2-line"></i>' + json.ADDRESS ;
						var anc = '<i class="ri-map-pin-2-line"></i>' + json.ADDRESS  ;
						gen.getChild( i , "a3" ).setValue( anc );
						gen.getChild( i , "a3" ).setHref( "javascript:fn_openPop("+i+")" );
					} else {
						var addr = json.ADDRESS;
						gen.getChild( i , "addr" ).setValue( addr );
					}
					gen.getChild( i , "a4" ).setValue( json.SHEL_AV+"명" );
					//gen.getChild( i , "a5" ).setValue( json.TEL );
				}
			}
			else{
				dm_resultMap.set( "pageIndex" ,"1");
				dm_resultMap.set( "pageSize" ,"1");
				dm_resultMap.set( "totCnt" ,"0");

				//var html = "<tr><td colspan='5'><span>데이터가 없습니다.</span></td></tr>"
    			//$("#gen").html(html);
			}

			dm_searchInfo.set( "pageSize" , dm_resultMap.get( "pageSize" ) );
			tbpageindex.setValue( dm_searchInfo.get( "pageIndex" ) );
			tbpagetotal.setValue( "/"+dm_searchInfo.get( "pageSize" ) );
			iptpageinput.setValue( dm_searchInfo.get( "pageIndex" ) );
		};

		function fn_openPop(row){
			var json = acmdFcltyList.getRowJSON( row );
			//console.log("대피시설 json : "+json);
			var arnm ;
			var facilNm = json.SHEL_NM;
			if(json.ADDRESS != ""){
				arnm = json.ADDRESS;

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
			}else{
				arnm = json.ADDRESS;
			}

			addr = addr.split(',')[0];

	 		// 주소검색
			var url = "/idsiSFK/neo/mapViewPopup_neo.html?addr="+encodeURI(encodeURIComponent(addr))+"&facilNm="+encodeURI(encodeURIComponent(facilNm));
		    window.open( url, "spamMain", "height=660px; width=660px; left=0; top=0; toolbar=no, menubar=no, location=no, status=yes, realzable=no, fullscreen=no, scrollbars=no, resizable=yes");
		}

		function fn_openPop2(row){
			var json = jdata[10*(pageIndex-1)+row];
			var arnm ;
			var facilNm = json.SHEL_NM;
			if(json.ADDRESS != ""){
				arnm = json.ADDRESS;

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
			}else{
				arnm = json.ADDRESS;
			}

			addr = addr.split(',')[0];

			var lo = json.LON;
			var la = json.LAT;
			var url = "";
			if( (lo != "" && lo != undefined) && (la != "" && la != undefined) ){
			  	url = "/idsiSFK/neo/mapViewPopup_neo.html?lo="+json.LON+"&la="+json.LAT+"&facilNm="+encodeURI(encodeURIComponent(facilNm));
			} else {
				url = "/idsiSFK/neo/mapViewPopup_neo.html?addr="+encodeURI(encodeURIComponent(addr))+"&facilNm="+encodeURI(encodeURIComponent(facilNm));
			}
		    window.open( url, "spamMain", "height=660px; width=660px; left=0; top=0; toolbar=no, menubar=no, location=no, status=yes, realzable=no, fullscreen=no, scrollbars=no, resizable=yes");
		}
			
			
	 		// 주소검색
/* 			var url = "https://www.safekorea.go.kr/idsiSFK/neo/mapViewPopup.html?addr="+encodeURI(encodeURIComponent(addr))+"&facilNm="+encodeURI(encodeURIComponent(facilNm));
		    window.open( url, "spamMain", "height=660px; width=660px; left=0; top=0; toolbar=no, menubar=no, location=no, status=yes, realzable=no, fullscreen=no, scrollbars=no, resizable=yes");
		}
 */

      	function searchRstrNm_onkeydown(e) {

			if(e.keyCode == 13) {
				//엔터를 쳤을 눌렀을 경우
				search();
			}
		};

		 function apagebefore_onclick() {
		    var pageindex = parseInt(dm_searchInfo.get( "pageIndex" )) ;
			if(pageindex!=1){
				dm_searchInfo.set( "pageIndex", (pageindex-1)+"");
				dm_searchInfo.set( "searchGb" , "pageSearch" );
				fn_search();
			}
		};

		function apagenext_onclick() {
			var pageSize = parseInt(dm_searchInfo.get( "pageSize" )) ;
			var pageindex = parseInt(dm_searchInfo.get( "pageIndex" )) ;
			if(pageindex < pageSize){
			//debugger;
				dm_searchInfo.set( "pageIndex", (pageindex+1)+"" );
				dm_searchInfo.set( "searchGb" , "pageSearch" );
				fn_search();
			}
		};

		function apagego_onclick() {
			var pageSize = parseInt(dm_searchInfo.get( "pageSize" )) ;
			var i = parseInt(iptpageinput.getValue());

			if(0 < i && i <= pageSize){
				dm_searchInfo.set( "pageIndex", i );
				dm_searchInfo.set( "searchGb" , "pageSearch" );
				fn_search();
			}
		};

		// 지도 링크 표시 유무용 관련 메소드 호출(일 쿼터 초과 시 지도 링크 X)
/* 		function doMapView()
		{
			// 주소-좌표 변환 객체를 생성합니다
			var geocoder = new daum.maps.services.Geocoder();

			// 주소로 좌표를 검색합니다
			geocoder.addressSearch("대구", function(result, status) {
				console.log(status);
				if(status === daum.maps.services.Status.OK){
					mapIcon = true;
				}else{
					mapIcon = false;
				}
			});
		}
	 */
		function btnSearch(){
			dm_searchInfo.set( "pageIndex", 1 );
			dm_searchInfo.set( "searchGb" , "pageSearch" );

			fn_search();
		}
		
		var setPageNav = function(){
			var $pagination = $('#pagination');
	
			var defaultOpts = {
				totalPages: 35,
				visiblePages: 10,
				first: '처음', 
				prev : '이전',
				next: '다음',
				last: '마지막'
			};
			
			var totalPages = dm_resultMap.get( "pageSize" );
					var currentPage = $pagination.twbsPagination('getCurrentPage');
					 if(flagParam) currentPage = 1;
					$pagination.twbsPagination('destroy');
					$pagination.twbsPagination($.extend({}, defaultOpts, {
						startPage: currentPage,
						totalPages: totalPages
					}));
			$pagination.twbsPagination(defaultOpts).on('page', function (event, page) {						
				console.info(page + ' (from event listening)');
				dm_searchInfo.set( "pageIndex" , page);
				fn_search(false);
			});
		}