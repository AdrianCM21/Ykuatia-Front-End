import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetError422 } from '../redux/error422Slice'
interface props{
    children: JSX.Element,
    open?:boolean
}
const FormHeader = ({children,open}:props) => {
    const dispatch =useDispatch()
    useEffect(() => {
    dispatch(resetError422(''))
    }, [open])
    
  return (
    <>{children}</>
  )
}

export default FormHeader