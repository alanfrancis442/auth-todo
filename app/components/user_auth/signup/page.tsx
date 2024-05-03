'use client';
import React, { useState,useEffect } from 'react';
import { auth } from "../../../firebase/config";
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {

  const router = useRouter();
  const [user_name, setuser_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, seterror] = useState('')
  let provider = new GoogleAuthProvider();

  useEffect(() => {
    let user = auth.currentUser
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        router.push('/components/todo/');
      }
    });
  }, []);

  const getErrorString = (str:string) => {
    let start = str.indexOf(":");
    let end = str.indexOf("(");
    return str.substring(start + 1, end);
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Your sign-up logic here
    try{
      let userCredentaials = await createUserWithEmailAndPassword(auth, email, password)
      let user = userCredentaials.user
      await updateProfile(user, {displayName: user_name})
      router.push('/components/todo/')
    }
    catch(error){
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      seterror(getErrorString(errorMessage))
    }

  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      let user = result.user;
      if(user){
        router.push('/components/todo/');
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="min-h-screen bg-[#0a0909] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create an account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-20 px-4 shadow sm:rounded-lg sm:px-10 outline outline-white outline-2">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-white">
                user name
              </label>
              <div className="mt-1">
                <input
                  id="user_name"
                  name="user_name"
                  type="text"
                  autoComplete="user_name"
                  required
                  value={user_name}
                  onChange={(e) => setuser_name(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-0 border-b-[1px] border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-transparent text-white"
                />
              </div>
            </div>
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
                  className="appearance-none block w-full px-3 py-2 border-0 border-b-[1px] border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-transparent text-white"
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-0 border-b-[1px] border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-transparent text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-0 border-b-[1px] border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-transparent text-white"
                />
              </div>
            </div>

            <div>
              <div className='text-red-500'>
                {error}
                
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border-0 border-b-[1px] border-transparent text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign up
              </button>
            </div>
            <div>
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex justify-center py-2 px-4 border-0 border-b-[1px] border-transparent text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                google signup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
