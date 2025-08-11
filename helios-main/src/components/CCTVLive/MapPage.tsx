import React, { useEffect } from 'react'

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const mapContainer = document.getElementById('map');
      const mapOption = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3 // 지도의 확대 레벨
      };
      new window.kakao.maps.Map(mapContainer, mapOption);
    }
  }, []);

  return (
    <div id="map" className='fixed h-[100vh] w-[100vw]'></div>
  )
}