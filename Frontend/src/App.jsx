import React, { useState } from 'react';
import Home from './components/home.jsx';
import Footer from './components/footer.jsx';
import Transcript from './components/transcript.jsx';
import Shorts from './components/shorts.jsx';
import Login from './components/login.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'tailwindcss/tailwind.css';


const App = () => {
  const router = createBrowserRouter([
    {path: '/', element: <Home />},
   {path: "/transcript/:ResponseID", element: <Transcript />},
   {path: "/shorts/:ResponseID", element: <Shorts />},
   {path: "/login", element: <Login />},
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      
      <Footer />
    </>
  );
}

export default App;