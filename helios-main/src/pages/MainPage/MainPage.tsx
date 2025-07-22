import React from 'react'
import Banner from '../../components/Banner/Banner'
import Slogan from '../../components/MainPage/Slogan'
import ViewStatus from '../../components/MainPage/ViewStatus'

export default function MainPage() {
  return (
    <>
      <div className='snap-y snap-mandatory h-screen overflow-y-scroll'>
        <div><Banner/></div>
        <div className='snap-start w-full h-screen'><Slogan/></div>
        <div className='snap-start w-full h-screen'><ViewStatus/></div>
      </div>      
    </>
  )
}
