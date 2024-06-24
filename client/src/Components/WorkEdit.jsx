import React from 'react'

export default function WorkEdit({wrk}) {
  return (
    <div className='bg-gray-300 dark:bg-[rgb(11,11,11)] px-4 rounded-lg m-2 p-2'>
        <p className='font-medium text-lg'>
            At {wrk.company}
        </p>
        <p className=' font-medium text-base'>
            From {wrk.from} {wrk.to ? "to "+ wrk.to : ""}
        </p>
        <p className='font-medium text-lg'>
            Position: {wrk.position}
        </p>
        <p>
            {wrk.description}
        </p>
    </div>
  )
}
