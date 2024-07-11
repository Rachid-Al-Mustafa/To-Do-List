import React from 'react';
import Button from '../components/button';
import Input from '../components/input';
import Logo from '../assets/todo.png';
import { MdAlternateEmail } from 'react-icons/md';
import { AiOutlineIdcard } from 'react-icons/ai';
import { FiLock } from 'react-icons/fi';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleChange } from '../utils/handleChange';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addUser } from '../utils/hooks';

function SignUp() {
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');

  const [inputs, setInputs] = useState({});
  const [errors, setError] = useState({ isError: false, type: '', message: '' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { status, error, mutate } = useMutation({
    mutationFn: addUser,
    onSuccess: (newUser) => {
      queryClient.setQueryData(['NewUser'], newUser);
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Signup successful!',
      });
      navigate('/home');
    },
  });


  const handleInputChange = (e) => {
    handleChange(e, setInputs);
  };

  const resetError = () => {
    setTimeout(() => {
      setError({ isError: false, type: '', message: '' });
    }, 3000);
  };

  const handleRegisterError = (error) => {
    const errorMessage = error?.response?.data?.error?.message;
    if (errorMessage === 'User already exists! Login Instead') {
      setError({ isError: true, type: 'email', message: errorMessage });
      resetError();
    } else if (errorMessage === 'Invalid Phone Number!') {
      setError({ isError: true, type: 'username', message: errorMessage });
      resetError();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password } = inputs;

    if (!username || !email || !password) {
      setError({
        isError: true,
        type: 'Missing fields',
        message: 'All fields are requried',
      });
      resetError();
      return;
    } else if (password.length < 8) {
      setError({
        isError: true,
        type: 'password',
        message: 'Password must be at least 8 characters',
      });
      resetError();
      return;
    }

    try {
      mutate(inputs);
    } catch (error) {
      handleRegisterError(error);
      Swal.fire({
        icon: 'error',
        title: 'Signup failed',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleRegister}
        className="text-center flex flex-col gap-8 px-4"
      >
        <div className="flex flex-col gap-4">
          <div className="m-auto w-[98px] h-[98px] bg-grayLight border-[2px] border-grayMedium rounded-full flex items-center justify-center">
            <img className="w-[50px]" src={Logo} alt="Logo" />
          </div>
          <div></div>
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-semibold">
              Get Started My Task Manager!
            </h3>
            <p className="text-grayHard text-lg font-normal">
              Join us and keep you tasks in check.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            handleChange={handleInputChange}
            type="text"
            name="username"
            placeholder="Username"
            icon={<AiOutlineIdcard size={27} color="C1C5C5" />}
          />{' '}
          {errors.isError && errors.type === 'username' && (
            <p className="text-start text-danger">{errors.message}</p>
          )}
          <Input
            handleChange={handleInputChange}
            type="email"
            name="email"
            placeholder="Email"
            icon={<MdAlternateEmail size={27} color="C1C5C5" />}
          />{' '}
          {errors.isError && errors.type === 'email' && (
            <p className="text-start text-danger">{errors.message}</p>
          )}
          <Input
            handleChange={handleInputChange}
            type="password"
            name="password"
            placeholder="Password"
            minLength="8"
            icon={<FiLock color="C1C5C5" size={27} />}
          />{' '}
          {errors.isError && errors.type === 'password' && (
            <p className="text-danger text-start">{errors.message}</p>
          )}
          {errors.isError && errors.type === 'Missing fields' && (
            <p className="text-danger text-start">{errors.message}</p>
          )}
          <p className="text-start text-[#737373]">
            Already have an account?{' '}
            <Link to="/" className="text-blue-900 font-medium">
              Login
            </Link>
          </p>
        </div>
        <Button text="Sign Up" />
      </form>
    </div>
  );
}

export default SignUp;
