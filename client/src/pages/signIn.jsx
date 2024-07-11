import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from '../components/button';
import Input from '../components/input';
import Logo from '../assets/todo.png';
import { MdAlternateEmail } from 'react-icons/md';
import { FiLock } from 'react-icons/fi';
import { handleChange } from '../utils/handleChange';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkUser } from '../utils/hooks';
import { AuthContext } from '../Context/AuthContext';

function SignIn() {
  const { dispatch } = useContext(AuthContext);

  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  localStorage.removeItem('resumeData');

  const [inputs, setInputs] = useState({});
  const [errors, setError] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { status, error, mutate } = useMutation({
    mutationFn: checkUser,
    onSuccess: signedUser => {
      queryClient.setQueryData(["Auth"], signedUser)
      dispatch({ type: 'LOGIN_SUCCESS', payload: signedUser });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Login successful!',
      });
      navigate('/home');
    }
  });

  const handleInputChange = (e) => {
    handleChange(e, setInputs);
  };

  const resetError = () => {
    setTimeout(() => {
      setError({ isError: false, type: '', message: '' });
    }, 3000);
  };

  const handleLoginError = (error) => {
    if (error.response.data.error.status === 401) {
      setError({
        isError: true,
        type: 'Wrong credentials',
        message: 'Wrong credentials',
      });
      resetError();
      return;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = inputs;

    if (!email || !password) {
      setError({
        isError: true,
        type: 'missing fields',
        message: 'All fields are required',
      });
      resetError();
      return;
    }

    try {
      mutate(inputs);
    } catch (error) {
      handleLoginError(error);
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    }
 };


  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="text-center flex flex-col gap-8 px-4"
      >
        <div className="flex flex-col gap-4">
          <div className="m-auto w-[98px] h-[98px] bg-grayLight border-[2px] border-grayMedium rounded-full flex items-center justify-center">
            <img className="w-[50px]" src={Logo} alt="Logo" />
          </div>
          <div></div>
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-semibold">Welcome back!</h3>
            <p className="text-grayHard text-lg font-normal">
              Please enter your email and password below
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            handleChange={handleInputChange}
            type="email"
            name="email"
            placeholder="Email"
            icon={<MdAlternateEmail size={27} color="C1C5C5" />}
          />
          <Input
            handleChange={handleInputChange}
            type="password"
            name="password"
            placeholder="Password"
            minLength="8"
            icon={<FiLock color="C1C5C5" size={27} />}
          />{' '}
          {errors.isError &&
            (errors.type === 'Wrong credentials' ? (
              <p className="text-start text-danger font-medium">
                Wrong credentials
              </p>
            ) : (
              <p className="text-start text-danger font-medium">
                All fields are required
              </p>
            ))}
          <p className="text-start text-[#737373]">
            Do not have an account?{' '}
            <Link to="/register" className="text-blue-900 font-medium">
              Register
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button text={'Login'} />
        </div>
      </form>
    </div>
  );
}

export default SignIn;
