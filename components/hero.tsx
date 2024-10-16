import React from 'react'
import Container from './container'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { Spotlight } from './ui/Spotlight'
    
const Hero = () => {
  return (
    <div>
        <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
        <Container>
            <div className="flex flex-col items-center justify-center h-[65vh] gap-5">
                <h1 className="text-7xl text-center w-[70%]">Find And Rate Your Favorite Projects.</h1>
                <p className="text-center text-xl mt-2 text-[#85868d]  w-[50%]">Post your projects, gain likes, and engage with comments from developers like you.</p>

                <div>
                    <button className='flex gap-1 items-center btn-primary text-xl p-5'>
                        Explore Projects
                        <ChevronRightIcon className='h-5'/>
                    </button>
                </div>
            </div>
        </Container>
    </div>
  )
}

export default Hero