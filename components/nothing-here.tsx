import React from 'react'
import { Ghost } from 'lucide-react'

const NothingHere = () => {
  return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <Ghost className="w-24 h-24 text-muted-foreground mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2">Oops! It&apos;s a ghost town here!</h2>
        <p className="text-muted-foreground">
          Be the first person to post under this tag.
        </p>
      </div>
  )
}

export default NothingHere