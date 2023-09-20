import { type ChangeEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JWT_TOKEN_KEY } from '../constants';

export default function TokenSetter() {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setToken(event.target.value),
    [],
  );

  const onSubmit = useCallback(() => {
    localStorage.setItem(JWT_TOKEN_KEY, JSON.stringify(token));
    navigate('/');
  }, [navigate, token]);

  return (
    <div className="m-4 text-white">
      <p>
        This section is only visible on local. get token from stage and set it
        here
      </p>
      <input className="mt-4 text-black" onChange={handleInputChange} />
      <button className="ml-4 bg-white px-2 text-black" onClick={onSubmit}>
        SUBMIT
      </button>
    </div>
  );
}
