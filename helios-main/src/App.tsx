import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import MainPage from './pages/MainPage/MainPage'
import MapPage from './pages/CCTVLive/MapPage'

function App() {
  

  return (
    <Routes>
      <Route path='/' element= { <MainPage />}></Route>
      <Route path='/MapPage' element= { <MapPage />}></Route>
    </Routes>
  )
}

export default App
