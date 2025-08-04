import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import MainPage from './pages/MainPage/MainPage'
import LivePage from './pages/CCTVLive/LivePage'
import DetectionHistoryPage from './pages/DetectionHistory/DetectionHistoryPage'

function App() {
  

  return (
    <Routes>
      <Route path='/' element= { <MainPage />}></Route>
      <Route path='/MapPage' element= { <LivePage />}></Route>
      <Route path='/DetectionHistory' element= { <DetectionHistoryPage />}></Route>
    </Routes>
  )
}

export default App
