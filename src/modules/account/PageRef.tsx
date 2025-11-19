import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageRef() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
}
