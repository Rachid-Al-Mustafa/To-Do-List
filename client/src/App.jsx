import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';
import NotFound from './pages/notFound';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Home from './pages/home';
import Analytics from './pages/analytics';
import UserAnalytics from './pages/userAnalytics';

function App() {
  const protectedRoutes = [
    {
      path: '/home',
      element: <Home />,
    },
    {
      path: '/chart',
      element: <Analytics />,
    },
    {
      path: '/userChart',
      element: <UserAnalytics />,
    }
  ];

  const publicRoutes = [
    {
      path: '/',
      element: <SignIn />,
    },
    {
      path: '/register',
      element: <SignUp />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ];

  return (
    <React.StrictMode>
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route element={<ProtectedRoutes />}>
          {protectedRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </React.StrictMode>
  );
}

export default App;
