import {useState} from 'react'
import styled from 'styled-components';
import { useAppDispatch } from '../store/redux-hooks';
import { registerUser, setUserAuth } from '../store/authSlice';
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;

  & >input { 
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
    margin-top: 25px;
  }
  &> button { 

    margin-top: 15px;
  }

`

const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useAppDispatch();
  return (
    <LoginContainer>
      <h1>Login Form</h1>
        <input 
        type="text" 
        placeholder='email' 
        onChange={e => setEmail(e.target.value)}
        value={email}
        />
        <input 
        type="text" 
        placeholder='password' 
        onChange={e => setPassword(e.target.value)}
        value={password}
        />
        <button onClick={()=>dispatch(setUserAuth({email,password}))}>Login</button>
        <button onClick={()=>dispatch(registerUser({email,password}))}>Register</button>

    </LoginContainer>
  )
}

export default LoginForm