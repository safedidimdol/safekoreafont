//중심점좌표
var sidoLatLon = {
	"1100000000": {
		latitude: 37.5665350, longitude: 126.9779690,
		name: "서울특별시",
		zoom: 5, level:15
	},
	"2600000000": {
		latitude: 35.1795540, longitude: 129.0756420,
		name: "부산광역시",
		zoom: 5, level:15
	},
	"2700000000": {
		latitude: 35.8714350, longitude: 128.6014450,
		name: "대구광역시",
		zoom: 6, level:14
	},
	"2800000000": {
		latitude: 37.4962560, longitude: 126.7052060,
		name: "인천광역시",
		zoom: 5, level:15
	},
	"2900000000": {
		latitude: 35.1795450, longitude: 126.8526010,
		name: "광주광역시",
		zoom: 6, level:14
	},
	"3000000000": {
		latitude: 36.3704120, longitude: 127.3845480,
		name: "대전광역시",
		zoom: 6, level:14
	},
	"3100000000": {
		latitude: 35.5383770, longitude: 129.3113600,
		name: "울산광역시",
		zoom: 6, level:14
	},
	"3600000000": {
		latitude: 36.5610279, longitude: 127.2860659,
		name: "세종특별자치시",
		zoom: 6, level:14
	},
	"4100000000": {
		latitude: 37.5184402, longitude: 127.1090698,
		name: "경기도",
		zoom: 4, level:16
	},
	"5100000000": {
		latitude: 37.8206328, longitude: 128.4246826,
		name: "강원특별자치도",
		zoom: 3, level:17
	},
	"4300000000": {
		latitude: 36.8000000, longitude: 127.8500000,
		name: "충청북도",
		zoom: 4, level:16
	},
	"4400000000": {
		latitude: 36.5449494, longitude: 126.9058228,
		name: "충청남도",
		zoom: 4, level:16
	},
	"4500000000": {
		latitude: 35.7180855, longitude: 127.0754242,
		name: "전라북도",
		zoom: 4, level:16
	},
	"4600000000": {
		latitude: 34.8679000, longitude: 126.9910000,
		name: "전라남도",
		zoom: 3, level:17
	},
	"4700000000": {
		latitude: 36.4919000, longitude: 128.8889000,
		name: "경상북도",
		zoom: 3, level:17
	},
	"4800000000": {
		latitude: 35.3006000, longitude: 128.4332000,
		name: "경상남도",
		zoom: 3, level:17
	},
	"5000000000": {
		latitude: 33.3809994, longitude: 126.5432739,
		name: "제주특별자치도",
		zoom: 4, level:16
	}
};

//공통(미세먼지) 중심점좌표
var sidoLatLon_new = {
	"1100000000": {
		latitude: 37.5665350, longitude: 126.9779690,
		name: "서울특별시",
		zoom: 10, level:10
	},
	"2600000000": {
		latitude: 35.1795540, longitude: 129.0756420,
		name: "부산광역시",
		zoom: 10, level:10
	},
	"2700000000": {
		latitude: 35.8714350, longitude: 128.6014450,
		name: "대구광역시",
		zoom: 11, level:9
	},
	"2800000000": {
		latitude: 37.4962560, longitude: 126.7052060,
		name: "인천광역시",
		zoom: 10, level:10
	},
	"2900000000": {
		latitude: 35.1795450, longitude: 126.8526010,
		name: "광주광역시",
		zoom: 11, level:9
	},
	"3000000000": {
		latitude: 36.3704120, longitude: 127.3845480,
		name: "대전광역시",
		zoom: 11, level:9
	},
	"3100000000": {
		latitude: 35.5383770, longitude: 129.3113600,
		name: "울산광역시",
		zoom: 11, level:9
	},
	"3600000000": {
		latitude: 36.5610279, longitude: 127.2860659,
		name: "세종특별자치시",
		zoom: 11, level:9
	},
	"4100000000": {
		latitude: 37.5184402, longitude: 127.1090698,
		name: "경기도",
		zoom: 9, level:11
	},
	"5100000000": {
		latitude: 37.8206328, longitude: 128.4246826,
		name: "강원특별자치도",
		zoom: 8, level:12
	},
	"4300000000": {
		latitude: 36.8000000, longitude: 127.8500000,
		name: "충청북도",
		zoom: 9, level:11
	},
	"4400000000": {
		latitude: 36.5449494, longitude: 126.9058228,
		name: "충청남도",
		zoom: 9, level:11
	},
	"4500000000": {
		latitude: 35.7180855, longitude: 127.0754242,
		name: "전라북도",
		zoom: 9, level:11
	},
	"4600000000": {
		latitude: 34.8679000, longitude: 126.9910000,
		name: "전라남도",
		zoom: 8, level:12
	},
	"4700000000": {
		latitude: 36.4919000, longitude: 128.8889000,
		name: "경상북도",
		zoom: 8, level:12
	},
	"4800000000": {
		latitude: 35.3006000, longitude: 128.4332000,
		name: "경상남도",
		zoom: 8, level:12
	},
	"5000000000": {
		latitude: 33.3809994, longitude: 126.5432739,
		name: "제주특별자치도",
		zoom: 9, level:11
	}
};

// 강우량 중심점좌표
var sidoLatLon_rainInfo = {
	"1100000000": {
		latitude: 37.5665350, longitude: 126.9779690,
		name: "서울특별시",
		zoom: 10, level:10
	},
	"2600000000": {
		latitude: 35.1795540, longitude: 129.0756420,
		name: "부산광역시",
		zoom: 10, level:10
	},
	"2700000000": {
		latitude: 35.8714350, longitude: 128.6014450,
		name: "대구광역시",
		zoom: 11, level:9
	},
	"2800000000": {
		latitude: 37.4962560, longitude: 126.7052060,
		name: "인천광역시",
		zoom: 10, level:10
	},
	"2900000000": {
		latitude: 35.1595450, longitude: 126.8866010,
		name: "광주광역시",
		zoom: 10, level:10
	},
	"3000000000": {
		latitude: 36.3504120, longitude: 127.3845480,
		name: "대전광역시",
		zoom: 10, level:10
	},
	"3100000000": {
		latitude: 35.5583770, longitude: 129.2013600,
		name: "울산광역시",
		zoom: 10, level:10
	},
	"3600000000": {
		latitude: 36.5710279, longitude: 127.2660659,
		name: "세종특별자치시",
		zoom: 10, level:10
	},
	"4100000000": {
		latitude: 37.5184402, longitude: 127.1090698,
		name: "경기도",
		zoom: 8, level:12
	},
	"5100000000": {
		latitude: 37.8206328, longitude: 128.4246826,
		name: "강원특별자치도",
		zoom: 8, level:12
	},
	"4300000000": {
		latitude: 36.7000000, longitude: 127.8500000,
		name: "충청북도",
		zoom: 8, level:12
	},
	"4400000000": {
		latitude: 36.5449494, longitude: 126.9058228,
		name: "충청남도",
		zoom: 8, level:12
	},
	"4500000000": {
		latitude: 35.7180855, longitude: 127.0754242,
		name: "전라북도",
		zoom: 9, level:11
	},
	"4600000000": {
		latitude: 34.8679000, longitude: 126.9910000,
		name: "전라남도",
		zoom: 8, level:12
	},
	"4700000000": {
		latitude: 36.4919000, longitude: 128.8289000,
		name: "경상북도",
		zoom: 8, level:12
	},
	"4800000000": {
		latitude: 35.4606000, longitude: 128.3732000,
		name: "경상남도",
		zoom: 8, level:12
	},
	"5000000000": {
		latitude: 33.3809994, longitude: 126.5432739,
		name: "제주특별자치도",
		zoom: 9, level:11
	}
};

// 하천수위 중심점좌표
var sidoLatLon_RiverStage = {
	"1100000000": {
		latitude: 37.5665350, longitude: 126.9779690,
		name: "서울특별시",
		zoom: 10, level:10
	},
	"2600000000": {
		latitude: 35.1795540, longitude: 129.0756420,
		name: "부산광역시",
		zoom: 10, level:10
	},
	"2700000000": {
		latitude: 35.7914350, longitude: 128.6014450,
		name: "대구광역시",
		zoom: 10, level:10
	},
	"2800000000": {
		latitude: 37.5562560, longitude: 126.7052060,
		name: "인천광역시",
		zoom: 10, level:10
	},
	"2900000000": {
		latitude: 35.1595450, longitude: 126.8126010,
		name: "광주광역시",
		zoom: 10, level:10
	},
	"3000000000": {
		latitude: 36.3504120, longitude: 127.3845480,
		name: "대전광역시",
		zoom: 10, level:10
	},
	"3100000000": {
		latitude: 35.5383770, longitude: 129.3113600,
		name: "울산광역시",
		zoom: 10, level:10
	},
	"3600000000": {
		latitude: 36.5710279, longitude: 127.2660659,
		name: "세종특별자치시",
		zoom: 10, level:10
	},
	"4100000000": {
		latitude: 37.5184402, longitude: 127.1090698,
		name: "경기도",
		zoom: 8, level:12
	},
	"5100000000": {
		latitude: 37.8206328, longitude: 128.4246826,
		name: "강원특별자치도",
		zoom: 8, level:12
	},
	"4300000000": {
		latitude: 36.7000000, longitude: 127.8500000,
		name: "충청북도",
		zoom: 8, level:12
	},
	"4400000000": {
		latitude: 36.5449494, longitude: 126.9068228,
		name: "충청남도",
		zoom: 8, level:12
	},
	"4500000000": {
		latitude: 35.7180855, longitude: 127.0754242,
		name: "전라북도",
		zoom: 9, level:11
	},
	"4600000000": {
		latitude: 34.8679000, longitude: 126.9910000,
		name: "전라남도",
		zoom: 8, level:12
	},
	"4700000000": {
		latitude: 36.4919000, longitude: 128.8889000,
		name: "경상북도",
		zoom: 8, level:12
	},
	"4800000000": {
		latitude: 35.4606000, longitude: 128.2132000,
		name: "경상남도",
		zoom: 8, level:12
	},
	"5000000000": {
		latitude: 33.3809994, longitude: 126.5432739,
		name: "제주특별자치도",
		zoom: 9, level:11
	}
};

//방사선 중심점좌표
var sidoLatLon_radiation = {
	"1100000000": {
		latitude: 37.5665350, longitude: 126.9779690,
		name: "서울특별시",
		zoom: 10, level:10
	},
	"2600000000": {
		latitude: 35.1795540, longitude: 129.0756420,
		name: "부산광역시",
		zoom: 10, level:10
	},
	"2700000000": {
		latitude: 35.8714350, longitude: 128.6014450,
		name: "대구광역시",
		zoom: 11, level:9
	},
	"2800000000": {
		latitude: 37.4962560, longitude: 126.6002060,
		name: "인천광역시",
		zoom: 10, level:10
	},
	"2900000000": {
		latitude: 35.1595450, longitude: 126.8526010,
		name: "광주광역시",
		zoom: 11, level:9
	},
	"3000000000": {
		latitude: 36.3504120, longitude: 127.3845480,
		name: "대전광역시",
		zoom: 10, level:10
	},
	"3100000000": {
		latitude: 35.5383770, longitude: 129.3113600,
		name: "울산광역시",
		zoom: 10, level:10
	},
	"3600000000": {
		latitude: 36.5710279, longitude: 127.2660659,
		name: "세종특별자치시",
		zoom: 12
	},
	"4100000000": {
		latitude: 37.5184402, longitude: 127.1090698,
		name: "경기도",
		zoom: 8, level:12
	},
	"5100000000": {
		latitude: 37.8206328, longitude: 128.4246826,
		name: "강원특별자치도",
		zoom: 8, level:12
	},
	"4300000000": {
		latitude: 36.7000000, longitude: 127.8500000,
		name: "충청북도",
		zoom: 8, level:12
	},
	"4400000000": {
		latitude: 36.5449494, longitude: 126.9058228,
		name: "충청남도",
		zoom: 8, level:12
	},
	"4500000000": {
		latitude: 35.7180855, longitude: 127.0754242,
		name: "전라북도",
		zoom: 8, level:12
	},
	"4600000000": {
		latitude: 34.8679000, longitude: 126.9910000,
		name: "전라남도",
		zoom: 7, level:13
	},
	"4700000000": {
		latitude: 36.4919000, longitude: 128.8889000,
		name: "경상북도",
		zoom: 8, level:12
	},
	"4800000000": {
		latitude: 35.4606000, longitude: 128.2132000,
		name: "경상남도",
		zoom: 8, level:12
	},
	"5000000000": {
		latitude: 33.4009994, longitude: 126.5432739,
		name: "제주특별자치도",
		zoom: 8, level:12
	}
};
