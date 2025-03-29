import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuth = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {


  const auth = JSON.parse(localStorage.getItem("auth")); 
  const token = auth?.token;
  const user = auth?.user;

  
    if (!user || user.role !== 'admin' && user.role !== 'Admin' || !token) {
      navigate('/Error403');
    }
  }, [navigate]);

  return children;
};

export default AdminAuth;
