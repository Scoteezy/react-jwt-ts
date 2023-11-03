import './App.css'
import {useEffect, useState} from 'react'
import LoginForm from './components/LoginForm'
import { useAppDispatch,useAppSelector } from './store/redux-hooks'
import { checkAuth,logoutUser } from './store/authSlice'
import { IUser } from './models/IUser'
import UserService from './services/UserService'
function App() {
  const store = useAppSelector(store => store.auth);
  const [users,setUsers] = useState<IUser[]>([])
  const dispatch = useAppDispatch();
  useEffect(()=>{
    if(localStorage.getItem('token')){
      dispatch(checkAuth());
    }
  },[])
  const getUsers=async ()=>{
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data)
    } catch(e:unknown){ 
      if (e instanceof Error) 
      {console.log(e.message)}
      else{console.log(String(e))}
  }
  }
  if(store.status==='loading'){
    return(<div>Loading...</div>)
  }
    if(!store.isAuth){
      return(
      <LoginForm/>
      )
    }
  return (
    <>
    <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : "Пользователь неавторизован"}</h1>
      <h1>{store.user.isActivated ?"Аккаунт подтвержден" : "Подтвердите аккаут"} </h1>
    <button onClick={()=>dispatch(logoutUser())}>LogOut</button>
    <button onClick={getUsers}>Получить пользователей</button>
    {users.map((user:IUser)=>{
      <div key={user.email}>{user.email}</div>
    })}
    </>
  )
}

export default App
