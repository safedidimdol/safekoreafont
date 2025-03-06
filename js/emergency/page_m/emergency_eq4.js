var flagParam = true;

$.ajaxSetup({ cache: false});
	/*2024.01.01 경기도 부천시 전환 관련하여 주소 전환 스크립트*/
	function initBucheon(address, type) {
		if(!address.includes('부천')){
			return address;
		}
	
		var originalAddress = address
		var match = originalAddress.match(/\(([^)]+)\)/);
		
		if(match == null){
			return address;
		} // end if
		
		var userInput = match[1];
	
		var addressData = [
		    { BDONG_NM: '원미동', ASIS_BDONG_NM: '경기도 부천시 원미동', TOBE_BDONG_NM: '경기도 부천시 원미구 원미동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 원미구' },
		    { BDONG_NM: '심곡동', ASIS_BDONG_NM: '경기도 부천시 심곡동', TOBE_BDONG_NM: '경기도 부천시 원미구 심곡동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 원미구' },
		    { BDONG_NM: '춘의동', ASIS_BDONG_NM: '경기도 부천시 춘의동', TOBE_BDONG_NM: '경기도 부천시 원미구 춘의동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 원미구' },
		    { BDONG_NM: '도당동', ASIS_BDONG_NM: '경기도 부천시 도당동', TOBE_BDONG_NM: '경기도 부천시 원미구 도당동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 원미구' },
		    { BDONG_NM: '약대동', ASIS_BDONG_NM: '경기도 부천시 약대동', TOBE_BDONG_NM: '경기도 부천시 원미구 약대동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 원미구' },
		    { BDONG_NM: '소사동', ASIS_BDONG_NM: '경기도 부천시 소사동', TOBE_BDONG_NM: '경기도 부천시 원미구 소사동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 원미구' },
		    { BDONG_NM: '역곡동', ASIS_BDONG_NM: '경기도 부천시 역곡동', TOBE_BDONG_NM: '경기도 부천시 원미구 역곡동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 원미구' },
		    { BDONG_NM: '중동', ASIS_BDONG_NM: '경기도 부천시 중동', TOBE_BDONG_NM: '경기도 부천시 원미구 중동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 원미구' },
		    { BDONG_NM: '상동', ASIS_BDONG_NM: '경기도 부천시 상동', TOBE_BDONG_NM: '경기도 부천시 원미구 상동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 원미구' },
		    { BDONG_NM: '소사본동', ASIS_BDONG_NM: '경기도 부천시 소사본동', TOBE_BDONG_NM: '경기도 부천시 소사구 소사본동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 소사구' },
		    { BDONG_NM: '심곡본동', ASIS_BDONG_NM: '경기도 부천시 심곡본동', TOBE_BDONG_NM: '경기도 부천시 소사구 심곡본동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 소사구' },
		    { BDONG_NM: '범박동', ASIS_BDONG_NM: '경기도 부천시 범박동', TOBE_BDONG_NM: '경기도 부천시 소사구 범박동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 소사구' },
		    { BDONG_NM: '괴안동', ASIS_BDONG_NM: '경기도 부천시 괴안동', TOBE_BDONG_NM: '경기도 부천시 소사구 괴안동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 소사구' },
		    { BDONG_NM: '송내동', ASIS_BDONG_NM: '경기도 부천시 송내동', TOBE_BDONG_NM: '경기도 부천시 소사구 송내동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 소사구' },
		    { BDONG_NM: '옥길동', ASIS_BDONG_NM: '경기도 부천시 옥길동', TOBE_BDONG_NM: '경기도 부천시 소사구 옥길동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 소사구' },
		    { BDONG_NM: '계수동', ASIS_BDONG_NM: '경기도 부천시 계수동', TOBE_BDONG_NM: '경기도 부천시 소사구 계수동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 소사구' },
		    { BDONG_NM: '오정동', ASIS_BDONG_NM: '경기도 부천시 오정동', TOBE_BDONG_NM: '경기도 부천시 오정구 오정동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 오정구' },
		    { BDONG_NM: '여월동', ASIS_BDONG_NM: '경기도 부천시 여월동', TOBE_BDONG_NM: '경기도 부천시 오정구 여월동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 오정구' },
		    { BDONG_NM: '작동', ASIS_BDONG_NM: '경기도 부천시 작동', TOBE_BDONG_NM: '경기도 부천시 오정구 작동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 오정구' },
		    { BDONG_NM: '원종동', ASIS_BDONG_NM: '경기도 부천시 원종동', TOBE_BDONG_NM: '경기도 부천시 오정구 원종동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 오정구' },
		    { BDONG_NM: '고강동', ASIS_BDONG_NM: '경기도 부천시 고강동', TOBE_BDONG_NM: '경기도 부천시 오정구 고강동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 오정구' },
		    { BDONG_NM: '대장동', ASIS_BDONG_NM: '경기도 부천시 대장동', TOBE_BDONG_NM: '경기도 부천시 오정구 대장동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 오정구' },
		    { BDONG_NM: '삼정동', ASIS_BDONG_NM: '경기도 부천시 삼정동', TOBE_BDONG_NM: '경기도 부천시 오정구 삼정동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 오정구' },
		    { BDONG_NM: '내동', ASIS_BDONG_NM: '경기도 부천시 내동', TOBE_BDONG_NM: '경기도 부천시 오정구 내동', ASIS_NM: '경기도 부천시', TOBE_NM: '경기도 부천시 오정구' }
		 ];
	
		for (var i = 0; i < addressData.length; i++) {
			if (userInput.includes(addressData[i].BDONG_NM)) {
				
			if(type == 1) return originalAddress.replace(addressData[i].ASIS_NM,addressData[i].TOBE_NM);
			else if(type == 2) return originalAddress.replace(addressData[i].TOBE_NM, addressData[i].ASIS_NM);
			break; // 일치하는 정보를 찾으면 루프 종료
		    }
		} // end for
	} // end function
var mapIcon = true;
var jdata = [];
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
			, encoding   : "UTF-8"
			, method     : "post"
			, mediatype  : "application/json"
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
			, encoding   : "UTF-8"
			, method     : "post"
			, mediatype  : "application/json"
		},

		//******************************************************************
		// getSelect_submission
		//******************************************************************
		{
			  id         : "getSelect_submission"
			, processMsg : "조회중입니다..."
			, submitdone : getSelect_submitdone
			, mode       : "asynchronous"
			, ref        : {"id":"dm_searchInfo","key":"searchInfo"}
			, target     : [{"id":"acmdFcltyList","key":"acmdFcltyList"},{"id":"dm_resultMap","key":"rtnResult"}]
			, action     : "/idsiSFK/sfk/cs/sfc/selectAcmdFcltyList.do"
			, encoding   : "UTF-8"
			, method     : "post"
			, mediatype  : "application/json"
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
			, encoding   : "UTF-8"
			, method     : "post"
			, mediatype  : "application/json"
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
			, encoding   : "UTF-8"
			, method     : "post"
			, mediatype  : "application/json"
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
			, encoding   : "UTF-8"
			, method     : "post"
			, mediatype  : "application/json"
		},

		//******************************************************************
		// getComCdInfo_submission
		//******************************************************************
		{
			  id         : "getComCdInfo_submission"
			, processMsg : "조회중입니다..."
			, mode       : "synchronous"
			, ref        : {"id":"dm_searchInfo","action":"select","key":"searchInfo"}
			, target     : [{"id":"codeInfo","key":"cd_info"},{"id":"comCodeList1","key":"cd_list"}]
			, action     : "/idsiSFK/sfk/ca/cma/getComCdList.do"
			, encoding   : "UTF-8"
			, method     : "post"
			, mediatype  : "application/json"
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
			, encoding   : "UTF-8"
			, method     : "post"
			, mediatype  : "application/json"
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

	var useAt = 'Y';
	var pageParam = "";

	var pageIndex = null;
	//공통코드 공통 모듈 생성 (인자에 기술된 코드와 코드의 하위 코드들을 조회함)

       // onload
       $(function(){

		init();
       });


	//초기화
	function init() {
		
		var acmdfclty_cd = "2";


		//법정동 시도코드 불러오기
		fn_getBdongSidoCd();


		// pageParam.acmdfclty_cd 체크
		if (acmdfclty_cd=="1"){

			dm_searchInfo.set( "acmdfclty_cd" , "1" );
			dm_searchInfo.set( "searchCdKey" , "C265" );
			$("#title").text("내진성능이 확보된 시설로 지진과 풍수해 등으로 주거시설을 상실하거나 사실상 주거가 불가능한 이재민 및 일시대피자의 임시 거주를 위하여 제공되는 시설물입니다.");
				$("#department").text("소관부서 : 재난구호과 이종우(044-205-5335)");
				$(".level1_title").html("지진 실내구호소");
	
			}else if (acmdfclty_cd=="2"){
	
				dm_searchInfo.set( "acmdfclty_cd" , "2" );
				dm_searchInfo.set( "searchCdKey" , "G000112" );
				$("#title").text("지진발생초기 운동장, 공터 등 구조물 파손 및 낙하물로부터 안전한 외부대피장소입니다.");
	
				//$(".level1_title").html("지진옥외대피장소");
		}

		$.getJSON("/idsiSFK/neo/ext/json/secd/secd_" + dm_searchInfo.get( "searchCdKey" ) + ".do", function(data) {
			for(i = 0; i < data.length; i++) {
				$("#sch20-2").append("<option value='" + data[i].CMMN_CD_VALUE + "'>" + data[i].CMMN_CD_NM + "</option>");
			}
		});


		// 권한별 컬럼 visibility 설정 ( 권한 적용 )
		// 세션값 조회
		//parameter
		var strloginMsg = "";

		// page 정보 셋팅
        pageIndex = CommonUtil.nvl(pageParam.pageIndex, "1");

		// 현재 년도
		var curYear = DateUtil.getToday();

		var searchFcltyTy      = pageParam.searchFcltyTy;
		var searchYear         = curYear.substring(0,4);
		var searchChckAirconAt = pageParam.searchChckAirconAt;
		var searchRstrNm       = pageParam.searchRstrNm;
		var govAreaCode        = pageParam.govAreaCode;

		dm_searchInfo.set( "searchFcltyTy" , searchFcltyTy ? searchFcltyTy  : "");
		dm_searchInfo.set( "searchYear"    , searchYear    ? searchYear     : "");
		dm_searchInfo.set( "searchRstrNm"  , searchRstrNm  ? searchRstrNm   : "");
		dm_searchInfo.set( "govAreaCode"   , govAreaCode   ? govAreaCode    : "");
		dm_searchInfo.set( "pageIndex"     , pageIndex     ? pageIndex      : "");
		dm_searchInfo.set( "searchGb"      , "pageSearch"  );




	}

	function fn_comArea1search() {
		dm_selectCondition.set("upperOrgCd","0");
		dm_selectCondition.set( "searchGb" , "" );
		getComArea1_submission.exec();
	}

	function fn_getBdongSidoCd() {
		$.getJSON("/idsiSFK/neo/ext/json/arcd/bd/bd_sido.do", function(data) {
			for(i = 0; i < data.length; i++) {
				sbLawArea1.addItem( data[i].SIDO_CD , data[i].SIDO_NM , i );
			}
		});
	}
	function sbLawArea1_onchange() {
		// 법정동 시군구 콤보 셋팅 (구제시제외, 출장소제외)
		//	CommonUtil.setSFKAreaCodeList('LAW', 2, sbLawArea1.getValue().substr(0,2), 'Y', sbLawArea2, '시군구', '', '', 'N', '', 'N');
		//dm_selectCondition.set("upperOrgCd", sbLawArea1.getValue() );
		dm_searchInfo.set("q_area_cd_2", "");
		dm_searchInfo.set("q_area_cd_3", "");

		dm_selectCondition.set("sidoCd", sbLawArea1.getValue() );

		// 법정동 시군구 하위 콤보 초기화
		sbLawArea2.removeAll();
		sbLawArea2.addItem( "" , "시군구선택" , 0 );
		sbLawArea3.removeAll();
		sbLawArea3.addItem( "" , "읍면동선택" , 0 );

		$.getJSON("/idsiSFK/neo/ext/json/arcd/bd/" + sbLawArea1.getValue() + "/bd_sgg.do", function(data) {
			for(i = 0; i < data.length; i++) {
				sbLawArea2.addItem( data[i].SGG_CD , data[i].SGG_NM , i );
			}
		});
	};
	function sbLawArea2_onchange() {
		// 법정동 읍면동 콤보 셋팅 (출장소제외)
		//	CommonUtil.setSFKAreaCodeList('LAW', 3, sbLawArea2.getValue(), 'Y', sbLawArea3, '읍면동', '', '', '', '', 'N');
		//dm_selectCondition.set("upperOrgCd", sbLawArea2.getValue() );
		dm_searchInfo.set("q_area_cd_3", "");

		dm_selectCondition.set("sggCd", sbLawArea2.getValue() );

		// 법정동 읍면동 하위 콤보 초기화
		sbLawArea3.removeAll();
		sbLawArea3.addItem( "" , "읍면동선택" , 0 );

		$.getJSON("/idsiSFK/neo/ext/json/arcd/bd/" + sbLawArea1.getValue() + "/" + sbLawArea2.getValue() + "/bd_emd.do", function(data) {
				 _.forEach(data, function(obj1) {
					_.forEach(replaceArr,function(v){
						if(_.includes($('#sbLawArea1 option:selected').html(),v.pr)){
							obj1.EMD_NM = _.replace(obj1.EMD_NM ,v.be, v.af);
						};
					});
				});
			for(i = 0; i < data.length; i++) {
				sbLawArea3.addItem( data[i].EMD_CD , data[i].EMD_NM , i );
			}
		});
	};

	//조회 함수
	function fn_search(param) {
			
		if(typeof param == 'undefined') flagParam = true; else flagParam = false;
		
			
		var sbLawArea1 =  dm_searchInfo.get("q_area_cd_1");	// 시도 코드
		var sbLawArea2 =  dm_searchInfo.get("q_area_cd_2");	// 시군구 코드
		var sbLawArea3 =  dm_searchInfo.get("q_area_cd_3");	// 읍면동 코드
	
			var codeArcd = "";
			//if( sbLawArea3 != "") {
				//codeArcd = sbLawArea3;
			//} else 
		    if(sbLawArea2 != "") {
				codeArcd = sbLawArea2;
		} else if(sbLawArea1 == ""){
		  alert('시도를 선택하시기 바랍니다.');
		  return false;
		}  else if(sbLawArea2 == ""){
		  alert('시군구를 선택하시기 바랍니다.');
		  return false;
		}

		//codeArcd = sbLawArea3;
		dm_searchInfo.set( "govAreaCode" , codeArcd );

		/*
		var numArcd;
		var codeArcd;

		if(sbLawArea1 != ""){
			if( sbLawArea2 != ""){
				if( sbLawArea3 != ""){	//3개 입력
					codeArcd = sbLawArea3;
				}
				else{	//2개 입력
					codeArcd = sbLawArea2;
				}
			}
			else{	//1개 입력
				codeArcd = sbLawArea1;
			}
			dm_searchInfo.set( "govAreaCode" , codeArcd );
		}
		else{
			dm_searchInfo.set("govAreaCode", "");
		}
		*/

		acmdFcltyList.removeAll();
		dm_searchInfo.set( "searchGb" , "pageSearch" );

		// 현재 년도
		var curYear = DateUtil.getToday();
		dm_searchInfo.set( "searchYear" , curYear.substring(0,4));

		// 시설명 검색
		dm_searchInfo.set( "searchRstrNm" , $("#searchKeyword").val() );
		dm_searchInfo.set( "searchChckAirconAt" , $("#search_type_v").val() );
			dm_searchInfo.set( "searchChckAirconAt" , "적용");
	
			//if((CommonUtil.isNull(dm_searchInfo.get( "searchRstrNm" ))) && ($('#sch20-2').val() == "")) {
				var url = "";
	
				if(dm_searchInfo.get( "acmdfclty_cd" ) == "1")
					//url = "/idsiSFK/neo/ext/json/indoorList/indoorList_" + dm_searchInfo.get( "govAreaCode" ) + ".do";		
					url = "/idsiSFK/neo/ext/json/acmdfcltyList/acmdfcltyList_" + dm_searchInfo.get( "govAreaCode" ) + ".do";
				else
					url = "/idsiSFK/neo/ext/json/outhouseList/outhouseList_" + dm_searchInfo.get( "govAreaCode" ) + ".do";

			$.getJSON(url, function(data) {
				jdata = [];
					jdata = data;
	
					//내진설계 적용 (지진겸용 실내)
					if(dm_searchInfo.get( "acmdfclty_cd" ) == "1"){					
						jdata = _.filter(jdata, function(v){
							//console.log(v.ERTHQK_SHUNT_AT);
							return v.ERTHQK_SHUNT_AT == '적용';
						});	
					}
					
					_.forEach(jdata,function(obj1) {
						_.forEach(replaceArr,function(v){
							if(_.includes(obj1.ALL_AREA_NAME,v.pr) || _.includes(obj1.DTL_ADRES,v.pr)){
								obj1.ALL_AREA_NAME = _.replace(obj1.ALL_AREA_NAME ,v.be, v.af);	
								obj1.DTL_ADRES = _.replace(obj1.DTL_ADRES,v.be, v.af);
						 	} 
						})
					});
					
					//필터
					var bd_text = $('#sbLawArea3 option:selected').html();
					
					if(sbLawArea3 != ""){	
						jdata = _.filter(jdata, function(v){
							return !_.isEmpty(_.intersection(_.split(v.ALL_AREA_NAME,' '), _.split(bd_text)));
						});				
					}
									
					//필터 검색
					var search_text = _.trim($('#searchKeyword').val());
					
					if(!_.isEmpty(search_text)){					
						jdata = _.filter(jdata, function(v){
							return _.includes(v.VT_ACMD_FCLTY_NM,search_text);
						});	
					}
					
					//시설 구분
					var fcl_text = $("#sch20-2 option:selected").text();
					
					if(!_.isEmpty(dm_searchInfo.get( "searchFcltyTy" ))){					
						jdata = _.filter(jdata, function(v){
							return v.ACMD_FCLTY_SE_CD == fcl_text;
						});
					}
					
					pageSize = parseInt(jdata.length / 10) + 1;
					if(jdata.length != 0 && parseInt(jdata.length % 10) == 0) {
						pageSize -= 1;
					}
					length = jdata.length;
					
		     	pageIndex = CommonUtil.nvl(dm_searchInfo.get( "pageIndex" ), "1");
				var stRowIndex = 0 ;
				var lastRowIndex = dm_searchInfo.get( "recordCountPerPage" );

				gen.removeAll();

				var cnt;

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
						//gen.getChild( i , "a1" ).setValue( json.ACMD_FCLTY_SE_CD );
						gen.getChild( i , "a2" ).setValue( json.VT_ACMD_FCLTY_NM );
						gen.getChild( i , "am" ).setHref( "javascript:fn_openPop2("+i+")" );
							if(mapIcon) {
								var addr = json.DTL_ADRES;
								
								if(initBucheon(addr,1) != undefined){
									addr = initBucheon(addr,1);
								}
								
								var anc = '<i class="ri-map-pin-2-line"></i>' + addr ;
								anc = anc.replace("강원도", "강원특별자치도");
								anc = anc.replace("경상북도 군위군", "대구광역시 군위군");
								anc = anc.replace("전라북도", "전북특별자치도");
								gen.getChild( i , "a3" ).setValue( anc );
								gen.getChild( i , "a3" ).setHref( "javascript:fn_openPop2("+i+")" );
								$('#'+gen.getChild(i, "a3").id).attr('title', '새창열림');
							} else {
								var addr = json.DTL_ADRES;
								addr = addr.replace("강원도", "강원특별자치도");
								addr = addr.replace("경상북도 군위군", "대구광역시 군위군");
								addr = addr.replace("전라북도", "전북특별자치도");
								if(initBucheon(addr,1) != undefined){
									addr = initBucheon(addr,1);
								}
							gen.getChild( i , "addr" ).setValue( addr );
						}
						gen.getChild( i , "a4" ).setValue( json.FCLTY_AR+"m²" );
						gen.getChild( i , "a5" ).setValue( json.TEL_NO );
						gen.getChild( i , "an1" ).setValue( json.ACMD_FCLTY_SE_CD );
					}
				}
				else{
					dm_resultMap.set( "pageIndex" ,"1");
					dm_resultMap.set( "pageSize"  ,"1");
					dm_resultMap.set( "totCnt"    ,"0");

					//var html = "<tr><td colspan='5'><span>데이터가 없습니다.</span></td></tr>"
		   			//$("#gen").html(html);
				}
				dm_searchInfo.set( "pageSize" , dm_resultMap.get( "pageSize" ) );
				tbpageindex.setValue( dm_searchInfo.get( "pageIndex" ) );
				tbpagetotal.setValue( "/"+dm_searchInfo.get( "pageSize" ) );
				iptpageinput.setValue( dm_searchInfo.get( "pageIndex" ) );
				
				var $pagination = $('#pagination');
	
			    var defaultOpts = {
			        totalPages: 35,
		            visiblePages: 4,
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
			});
			//} else {
				//getSelect_submission.exec();
			//}
	};

	// callback
	//조회 콜백
	function getSelect_submitdone(e) {
	
		if (!CommonUtil.errorCheck(dm_resultMap)) return;
     	pageIndex = CommonUtil.nvl(dm_searchInfo.get( "pageIndex" ), "1");
		var stRowIndex = 0 ;
		var lastRowIndex = dm_searchInfo.get( "recordCountPerPage" );

		gen.removeAll();

		var cnt = acmdFcltyList.getRowCount();
		var totCnt = parseInt(dm_resultMap.get( "totCnt" ));

		if(cnt>0 && totCnt > 0){

			for(var i=0;i<cnt;i++){
				var json = acmdFcltyList.getRowJSON( i );
				gen.insertChild(  );
				//var anc = "신주소 : "+json.acmdFcltySeCd + " " + json.dtlAdres + "<br/>구주소 :" +json.rnDtlAdres + "<span class='gps_imgSet_icon'><i class='ir'>지도보기</i></span>"
					//gen.getChild( i , "a1" ).setValue( json.ACMDFCLTY_SE_CD );
					gen.getChild( i , "a2" ).setValue( json.VT_ACMDFCLTY_NM );
					var dtladdr = json.DTL_ADRES.replace("강원특별자치도", "강원도").replace("경상북도 군위군", "대구광역시 군위군") ;
					if(mapIcon) {						
						var anc = '<i class="ri-map-pin-2-line"></i>' + dtladdr ;
						
						gen.getChild( i , "a3" ).setValue( anc );
						gen.getChild( i , "a3" ).setHref( "javascript:fn_openPop("+i+")" );
					} else {
						var addr = dtladdr;
						if(initBucheon(addr,1) != undefined){
							addr = initBucheon(addr,1);
						}
						gen.getChild( i , "addr" ).setValue( addr );
				}
				gen.getChild( i , "a4" ).setValue( json.FCLTY_AR+"m²" );
				gen.getChild( i , "a5" ).setValue( json.TEL_NO );
			}
		}
		else{
			dm_resultMap.set( "pageIndex" ,"1");
			dm_resultMap.set( "pageSize"  ,"1");
			dm_resultMap.set( "totCnt"    ,"0");

			var html = "<tr><td colspan='5'><span>데이터가 없습니다.</span></td></tr>"
   			$("#gen").html(html);
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
		var facilNm = json.VT_ACMDFCLTY_NM;
		if(json.DTL_ADRES != ""){
			arnm = json.DTL_ADRES;

			var _addr = arnm.split(' ');
			var addr = "";
			for(var i = 0; i < _addr.length; i++){
				if(_addr[i].substring(0,1) == "("){
					break;
				}else if(i == 0){
					addr = _addr[i];
				}else{
					addr += " " + _addr[i];
				}
			}
			arnm = addr;
		}else{
			arnm = json.DTL_ADRES;
		}
	
			addr = addr.split(',')[0];
	
	 		// 주소검색
			var lo = json.LO;
			var la = json.LA;
			url = "/idsiSFK/neo/mapViewPopup_neo_cdn.do?lo="+json.LO+"&la="+json.LA+"&facilNm="+encodeURI(encodeURIComponent(facilNm))+"&addr="+encodeURI(encodeURIComponent(addr));
		    window.open( url, "spamMain", "height=660px; width=660px; left=0; top=0; toolbar=no, menubar=no, location=no, status=yes, realzable=no, fullscreen=no, scrollbars=no, resizable=yes");
		}

	function fn_openPop2(row){		
		var json = jdata[10*(pageIndex-1)+row];
		//console.log("대피시설 json : "+json);
		var arnm ;
		var facilNm = json.VT_ACMD_FCLTY_NM;
		if(json.DTL_ADRES != ""){
			arnm = json.DTL_ADRES;

			var _addr = arnm.split(' ');
			var addr = "";
			for(var i = 0; i < _addr.length; i++){
				if(_addr[i].substring(0,1) == "("){
					break;
				}else if(i == 0){
					addr = _addr[i];
				}else{
					addr += " " + _addr[i];
				}
			}
			arnm = addr;
			}else{
				arnm = json.DTL_ADRES;
			}
	
			addr = addr.split(',')[0];
			var lo = json.LO;
			var la = json.LA;
			var url = "";
			//if( (addr != "" && addr != undefined)){
			//	addr = addr.replace('경상북도 군위군', '대구광역시 군위군');
			//	url = "https://www.safekorea.go.kr/idsiSFK/neo/mapViewPopup.html?addr="+encodeURI(encodeURIComponent(addr))+"&facilNm="+encodeURI(encodeURIComponent(facilNm));
			//} else{
			  	url = "/idsiSFK/neo/mapViewPopup_neo_cdn.do?lo="+json.LO+"&la="+json.LA+"&facilNm="+encodeURI(encodeURIComponent(facilNm))+"&addr="+encodeURI(encodeURIComponent(addr));;
			//}
		    window.open( url, "spamMain", "height=660px; width=660px; left=0; top=0; toolbar=no, menubar=no, location=no, status=yes, realzable=no, fullscreen=no, scrollbars=no, resizable=yes");
	}


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
// 			var submission = getSelect_submission;
// 			submission.action = "/" + CommonUtil.getContextName() + "/sfk/cs/sfc/selectAcmdFcltyList.do";
// 		    getSelect_submission.exec();
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
// 			var submission = getSelect_submission;
// 			submission.action = "/" + CommonUtil.getContextName() + "/sfk/cs/sfc/selectAcmdFcltyList.do";
// 		    getSelect_submission.exec();
			fn_search();
		}
	};

	function apagego_onclick() {
		var pageSize = parseInt(dm_searchInfo.get( "pageSize" )) ;
		var i = parseInt(iptpageinput.getValue());

		if(0 < i && i <= pageSize){
			dm_searchInfo.set( "pageIndex", i );
			dm_searchInfo.set( "searchGb" , "pageSearch" );
// 			var submission = getSelect_submission;
// 			submission.action = "/" + CommonUtil.getContextName() + "/sfk/cs/sfc/selectAcmdFcltyList.do";
// 		    getSelect_submission.exec();
			fn_search();
		}
	};

	// 지도 링크 표시 유무용 관련 메소드 호출(일 쿼터 초과 시 지도 링크 X)
/* 	function doMapView() {
		try {
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
		} catch (e) {
			return false;
		}
	} */

	function search_btn_onclick() {
		dm_searchInfo.set( "pageIndex", 1 );
		dm_searchInfo.set( "searchGb" , "pageSearch" );

		fn_search();
	}
	
	
	$(function () {
		/*
        window.pagObj = $('#pagination').twbsPagination({
            totalPages: 35,
            visiblePages: 5,
            first: '처음', 
            prev : '이전',
            next: '다음',
            last: '마지막',
            onPageClick: function (event, page) {
                console.info(page + ' (from options)');
            }
        }).on('page', function (event, page) {
            console.info(page + ' (from event listening)');
        });
        */
    });

	//시군구
	/*function sbArea1_onchange() {

		if($("#sbArea1 option:selected").text() == "시도 선택" ){
			dm_searchInfo.set( "sbArea1Nm", "" );
			$('#sbArea2 option').remove();
			$('#sbArea2').append("<option value='0'>시군구</option>");

		}else{
			dm_searchInfo.set( "sbArea1Nm", $("#sbArea1 option:selected").text() );
		}

		var d_sbArea1 = dm_searchInfo.get( 'sbArea1' );

		if(sbArea1 == ""){
			d_sbArea1 ="0";
		}

		CommonUtil.setSFKAreaCodeList('LAW', 2, d_sbArea1, 'Y', sbArea2, '시군구 선택', '', dm_searchInfo.get( "sbArea2"), '', '', 'N');

	};

	function sbArea2_onchange() {
		if($("#sbArea2 option:selected").text() == "시군구 선택" ){
			dm_searchInfo.set( "sbArea2Nm", "" );
		}else{
			dm_searchInfo.set( "sbArea2Nm", $("#sbArea2 option:selected").text() );
		}
	};*/