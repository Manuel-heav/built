import Header from '@/components/header'
import Hero from '@/components/hero'
import React from 'react'

const Home = () => {
  return (
    <div className='absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'>
      <Header />
      <Hero />
    </div>
  )
}

export default Home