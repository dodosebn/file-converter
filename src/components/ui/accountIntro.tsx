import React from 'react'
 type accountIntroType = {
    heading: string;
    paragraph: string;
 }
const AccountIntro:React.FC<accountIntroType> = ({heading, paragraph}) => {
  return (
     <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
{heading}          </h1>
          <p className="text-sm font-normal text-gray-500">
            {paragraph}
          </p>
        </div>
  )
}

export default AccountIntro;
