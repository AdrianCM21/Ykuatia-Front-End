import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetError422 } from '../redux/error422Slice'
interface props{
    children: React.ReactElement,
    open?:boolean
}
const FormHeader = ({children,open}:props) => {
    const dispatch =useDispatch()
    useEffect(() => {
    dispatch(resetError422())
    }, [open])
    
  return (
    <>{children}</>
  )
}

export default FormHeader