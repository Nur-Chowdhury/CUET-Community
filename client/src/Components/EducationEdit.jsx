import React from 'react'

export default function EducationEdit({edu}) {
  return (
    <div className='bg-gray-300 dark:bg-[rgb(11,11,11)] px-4 rounded-lg m-2 p-2'>
        <p className='font-medium text-lg'>
            At {edu.institution}
        </p>
        <p className=' font-medium text-base'>
            From {edu.from} {edu.to ? "to "+ edu.to : ""}
        </p>
        <p>
            {edu.description}
        </p>
    </div>
  )
}
