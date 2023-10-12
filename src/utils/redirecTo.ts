import { useNavigate } from 'react-router-dom';

export const redirectTo=(url:string)=> {
    try {
        const navigate = useNavigate();
  navigate(url);
    } catch (error) {
       console.log(error) 
    }
  
}

