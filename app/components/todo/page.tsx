"use client";
import React, { useState,useEffect } from 'react';
import { auth,db } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { collection,doc, addDoc,getDoc,updateDoc,deleteDoc, serverTimestamp,onSnapshot} from "firebase/firestore";
const TodoListApp = () => {
  let useId:string
  let collectionRef:any
  const router  = useRouter();

  const [userid, setuserid] = useState("")
  // The tasks state is an array of objects with the shape { id: number, task: string }
  const [tasks, setTasks] = useState<any>([]); // eslint-disable-line no-unused-vars
  // The taskInput state holds the text value of the input field
  const [taskInput, setTaskInput] = useState(''); // eslint-disable-line no-unused-vars

  const userCheck = () => {
    
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/components/user_auth/login/')
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        //useId = uid
        setuserid(uid)
      } else {
        router.push('/components/user_auth/login/')
      }
    });
  },[])
  useEffect(()=>{
    if(userid){
      collectionRef = collection(db, userid);
      onSnapshot(collectionRef, (snapshot:any) => {
        let temp_array:any = []
        Array.from(snapshot.docs).forEach((doc:any) => {
          temp_array.push({...doc.data(),id:doc.id})
        })
        setTasks([...temp_array])
      })
    }  
  },[userid])


  let list = [{ id: 1, task: "Task 1" }, { id: 2, task: "Task 2" }, { id: 3, task: "Task 3" },
  { id: 4, task: "Task 4" }, { id: 5, task: "Task 5" }, { id: 6, task: "Task 6" },
  { id: 7, task: "Task 7" }, { id: 8, task: "Task 8" }, { id: 9, task: "Task 9" },
  ];

  /**
   * handleAddTask function
   *
   * Adds a new task to the tasks state,
   * only if the taskInput value is not empty or whitespace.
   */
  const handleAddTask = async () => {
    if (taskInput.trim() !== '') {
      // setTasks([...tasks, { id: Date.now(), task: taskInput }]);
      //add task
      await addDoc(collection(db, userid), {
        task: taskInput,
        created:serverTimestamp(),
        comment:"comment"
      })
  
    }
  };
  
  /**
   * handleDeleteTask function
   *
   * Removes a task from the tasks state,
   * based on the task ID.
   *
   * @param {number} taskId The ID of the task to delete
   */
  const handleDeleteTask = async (taskId:any) => {
    //onsole.log(taskId)
    //(doc(
    await deleteDoc(doc(db, userid, taskId))

  };

  return (
    <div className='bg-[#0a0909] lg:p-8 p-2 min-h-screen flex flex-col'>
      <div className='flex justify-between items-center'>
        <p className='lg:text-6xl font-bold'>Welcome {auth.currentUser?.displayName}</p>
        <button className='bg-red-500 lg:p-2 lg:px-4 rounded-lg p-1 sm:text-sm lg:text-lg' onClick={handleLogout}>logout</button>
      </div>
      <div className=' my-4'>
      <div className="flex items-center space-x-4 w-full">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="appearance-none lg:text-3xl block w-full px-3 py-2 border-0 border-b-[1px] border-gray-300 placeholder-gray-400 focus:outline-none sm:text-sm bg-transparent text-white"
                placeholder="Enter a task"
              />
              <button
                onClick={handleAddTask}
                className="lg:p-2 lg:px-4 p-1 sm:text-xs lg:text-lg bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Task
              </button>
      </div>
            <div className="p-8 grid sm:grid-cols-1 lg:grid-cols-3 gap-8 rounded-lg h-full">
              {tasks.map((task:any) => (
                <div key={task.id} className="flex flex-col justify-between min-h-80 rounded-lg p-8 pb-4 bg-gray-700">
                  <div>
                    <p className="text-white text-3xl">{task.task}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="py-4 bg-red-600 text-white text-lg rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
      </div>
    </div>
  );
};

export default TodoListApp;
