/* global kakao */
import React, { useEffect } from "react";
//import "../styles/Map.scss";
//import searchPlace from "./SearchPlace";

const { kakao } = window;

const Map = ({ searchPlace }) => {
  useEffect(() => {
    let infowindow = new kakao.maps.InfoWindow({zIndex:1});

    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),//지도의 중심좌표
      level: 3//지도의 확대 레벨
    };

    const map = new kakao.maps.Map(container, options);//지도를 생성
    const ps = new kakao.maps.services.Places();//장소 검색 객체를 생성함

    ps.keywordSearch(searchPlace, placeSerchCB);//키워드로 장소를 검색

    //키워드 검색 완료시 호출되는 콜백함수
    function placeSerchCB(data, status, pagination){
      if(status === kakao.maps.services.Status.OK){
        //검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        //LatLngBounds 객체에 좌표를 추가
        console.log(data);
        console.log(data.length)
        
        let bounds = new kakao.maps.LatLngBounds();
        //밑에 for문 안으로 들어가지를 않는다.

        for(let i=0; i < data.length; i++){
          console.log(data[i]);
          console.log("Dd");

          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        //검색된 장소 위치를 기준으로 지도 범위를 재설정
        console.log(bounds);

        map.setBounds(bounds);
      }
    }
    //지도에 마커를 표시하는 함수
    function displayMarker(place){

      //마커를 생성하고 지도에 표시
      let marker = new kakao.maps.Marker({
        map : map,
        position : new kakao.maps.LatLng(place.y, place.x),
      });

      // //마커에 클릭 이벤트를 등록
      kakao.maps.event.addListener(marker, 'click', function(){
        //마커를 클릭하면 장소명이 인포윈도우에 표시
        infowindow.setContent('<div style = "padding : 5px; font-size : 12px;">'+ `<a href=${place.place_url} target="_blank">`+place.place_name + '</a>' + '</div');
        infowindow.open(map, marker);

        
      })
    }

    console.log("loading kakaomap");
  }, [searchPlace]);

  return (
    <div id='map' style={{
        width : '500px',
        height : '500px'
        }}></div>
  );
}

export default Map;