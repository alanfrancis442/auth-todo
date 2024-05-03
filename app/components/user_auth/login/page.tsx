'use client';
import React, { useState,useEffect } from 'react';
import { auth } from "../../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const LoginPage = () => {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState('')
  const provider = new GoogleAuthProvider();

  //function to check if user is logged in
  useEffect(() => {
    let user = auth.currentUser
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        router.push('/components/todo/');
      } else {
        router.push('/components/user_auth/login/');
      }
    });
  }, []);
  const getErrorString = (str:string) => {
    let start = str.indexOf("/");
    let end = str.indexOf(")");
    return str.substring(start + 1, end);
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      let user = result.user;
      if(user){
        router.push('/components/todo/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    // Your login logic here
    try{
      let user = await signInWithEmailAndPassword(auth, email, password)
      if(user){
        router.push('/components/todo/');
      }
          
    }catch(error){
      const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
          seterror(getErrorString(errorMessage))
        } 
    }

  return (
    <div className="min-h-screen bg-[#0a0909] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-20 px-4 shadow sm:rounded-lg sm:px-10 outline outline-white outline-2">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-0 border-b-[1px] border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-transparent text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-0 border-b-[1px] border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-transparent text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className='text-red-500'>
                  {error}
                </div>
                <a href="/components/user_auth/signup" className="font-medium ">
                  Don&#39;t have a account?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border-0 border-b-[1px] border-transparent text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex justify-center py-2 px-4 border-0 border-b-[1px] border-transparent text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Google Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;

