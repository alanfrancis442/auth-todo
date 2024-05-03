'use client'
import React from 'react';
import Head from 'next/head';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  router.push('/components/user_auth/login/');
  return (
    <div>
      
    </div>
  );
}

