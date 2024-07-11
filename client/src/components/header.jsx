import React from 'react';
import Button from '../components/button';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signoutUser } from '../utils/hooks';

const Header = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { status, error, mutate } = useMutation({
    mutationFn: signoutUser,
    onSuccess: (signedOutUser) => {
      queryClient.setQueryData(['Signout'], signedOutUser);
      dispatch({ type: 'LOGOUT', payload: signedOutUser });
      navigate('/');
    },
  });

  const handleLogout = async () => {
    mutate({id: user._id});
  };

  return (
    <div className="flex justify-between px-8 py-4 bg-white shadow-md w-full">
      <h1 className="text-xl font-bold text-gray-800"><Link to={'/home'}>ToDo List</Link></h1>
      <div className="flex justify-between">
        <div onClick={handleLogout}>
          <Button text={'Log Out'} />
        </div>
      </div>
    </div>
  );
};

export default Header;
