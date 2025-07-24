import React from 'react'
import Banner from '../../components/Banner/Banner'
import MapPage from '../../components/CCTVLive/MapPage'
import RoadInsightPanel from '../../components/CCTVLive/RoadInsightPanel'


export default function LivePage() {
  return (
    <>
      <Banner />
      <MapPage />
      <RoadInsightPanel />
    </>
  )
}