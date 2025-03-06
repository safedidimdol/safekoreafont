$.ajaxSetup({ cache: false });
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




	$(function(){
		safeKoreaEngineInitializeDataMap(neoSafeKoreaDataMapList);
		//safeKoreaEngineInitializeDataList(neoSafeKoreaDataListList);
	//	safeKoreaEngineInitializeSubmission(neoSafeKoreaSubmissionList);
	});


	//**************************************************************************
	//
	//**************************************************************************


	var useAt = 'Y';
	var pageParam = "";

	var pageIndex = null;
	//공통코드 공통 모듈 생성 (인자에 기술된 코드와 코드의 하위 코드들을 조회함)

   
   $(function(){
   		fn_search();
   });

		//조회 함수
		function fn_search() {
				var url = "";
				url = "/idsiSFK/neo/ext/json/disasterNewsList/disasterNewsList.do";

				
				$.getJSON(url, function(data) {
					
					jdata = [];
					jdata = data;

					//console.log(data);
					
			     	pageIndex = CommonUtil.nvl(dm_searchInfo.get( "pageIndex" ), "1");
					var stRowIndex = 0 ;
					var lastRowIndex = dm_searchInfo.get( "recordCountPerPage" );

					gen.removeAll();

					var cnt;
					dm_resultMap.set( "totCnt" , jdata.length);
					$('#totCnt').text(jdata.length);
					var totCnt = parseInt(dm_resultMap.get( "totCnt"));
					dm_resultMap.set( "pageSize" , Math.floor(totCnt / Number(dm_searchInfo.get("recordCountPerPage"))) + Math.floor((totCnt % Number(dm_searchInfo.get("recordCountPerPage")) == 0 ? 0 : 1)));

					if(pageIndex == dm_resultMap.get("pageSize")) {
						cnt = (jdata.length % 10) != 0 ? (jdata.length % 10) : 10;
					} else {
						cnt = 10;
					}
					$('#total-num').text(totCnt);

					if(cnt>0 && totCnt > 0){

						for(var i=0;i<cnt;i++){
							var json = jdata[10*(pageIndex-1)+i];
							gen.insertChild(  );
							
							//var anc = "신주소 : "+json.acmdFcltySeCd + " " + json.dtlAdres + "<br/>구주소 :" +json.rnDtlAdres + "<span class='gps_imgSet_icon'><i class='ir'>지도보기</i></span>"
							//gen.getChild( i , "a1" ).setValue( json.BBS_ORDR );
							gen.getChild( i , "a2" ).setValue( json.SJ );						       
							//gen.getChild( i , "a2" ).setHref('/idsiSFK/neo/emp/er/emergency_er1_d.html?bbsOrdr=' + json.BBS_ORDR);
							gen.getChild( i , "a2" ).setHref( '/idsiSFK/neo/emp_m/er/emergency_er2_d.do?bbsOrdr=' + json.BBS_ORDR  );
							//gen.getChild( i , "a3" ).setValue( json.USR_NM );
							gen.getChild( i , "a3" ).setValue( json.FRST_REGIST_DT );
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
				            $pagination.twbsPagination('destroy');
				            $pagination.twbsPagination($.extend({}, defaultOpts, {
				                startPage: currentPage,
				                totalPages: totalPages
				            }));
				    $pagination.twbsPagination(defaultOpts).on('page', function (event, page) {
	            		console.info(page + ' (from event listening)');
	            		dm_searchInfo.set( "pageIndex" , page);
	            		fn_search();
	       			 });
				});
			
		};

		

		
		 function apagebefore_onclick() {
		    var pageindex = parseInt(dm_searchInfo.get( "pageIndex" )) ;
			if(pageindex!=1){
				dm_searchInfo.set( "pageIndex", (pageindex-1)+"");
				dm_searchInfo.set( "searchGb" , "pageSearch" );
//	 			var submission = getSelect_submission;
//	 			submission.action = "/" + CommonUtil.getContextName() + "/sfk/cs/sfc/selectAcmdFcltyList.do";
//	 		    getSelect_submission.exec();
				fn_search();
			}
		};

		function apagenext_onclick() {
			var pageSize = parseInt(dm_searchInfo.get( "pageSize" )) ;
			var pageindex = parseInt(dm_searchInfo.get( "pageIndex" )) ;
			if(pageindex < pageSize){
				dm_searchInfo.set( "pageIndex", (pageindex+1)+"" );
				dm_searchInfo.set( "searchGb" , "pageSearch" );
//	 			var submission = getSelect_submission;
//	 			submission.action = "/" + CommonUtil.getContextName() + "/sfk/cs/sfc/selectAcmdFcltyList.do";
//	 		    getSelect_submission.exec();
				fn_search();
			}
		};

		function apagego_onclick() {
			var pageSize = parseInt(dm_searchInfo.get( "pageSize" )) ;
			var i = parseInt(iptpageinput.getValue());

			if(0 < i && i <= pageSize){
				dm_searchInfo.set( "pageIndex", i );
				dm_searchInfo.set( "searchGb" , "pageSearch" );
//	 			var submission = getSelect_submission;
//	 			submission.action = "/" + CommonUtil.getContextName() + "/sfk/cs/sfc/selectAcmdFcltyList.do";
//	 		    getSelect_submission.exec();
				fn_search();
			}
		};

	
		function search_btn_onclick() {
			dm_searchInfo.set( "pageIndex", 1 );
			dm_searchInfo.set( "searchGb" , "pageSearch" );

			fn_search();
		}