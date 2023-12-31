import React from 'react'
import './Styles.css'
export const Button = ({url,text,onClickProp}:{url?:string,text:string,onClickProp?:()=>void}) => {
  return (
   
    <button className='button' onClick={onClickProp}>{text}</button>
  )
}

