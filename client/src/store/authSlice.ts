import { createSlice, createAsyncThunk,PayloadAction} from '@reduxjs/toolkit'
import { IUser } from '../models/IUser';
import AuthService from '../services/AuthService';
import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { API_URL } from '../http';
type AuthSlice = { 
    status: 'idle' | 'loading' | 'finished' | 'error';
    user: IUser;
    isAuth: boolean

}
export const setUserAuth = createAsyncThunk(
    'users/setUserAuth',
    async function({email,password}:{email:string, password: string},{rejectWithValue,dispatch}) {
        try{ 
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            dispatch(setAuth(response.data.user))
        }catch(e:unknown){ 
            if (e instanceof Error) return rejectWithValue(e.message)
            return String(e)
        }
    }
)
export const registerUser = createAsyncThunk(
    'users/registerUser',
    async function(data:{email:string, password: string},{rejectWithValue,dispatch}) {
        try{ 
            console.log(data)
            const response = await AuthService.registration(data.email, data.password);
            localStorage.setItem('token', response.data.accessToken);
            dispatch(setAuth(response.data.user))
        }catch(e:unknown){ 
            if (e instanceof Error) return rejectWithValue(e.message)
            return String(e)
        }
    }
)
export const logoutUser = createAsyncThunk(
    'users/setUserAuth',
    async function(_,{rejectWithValue,dispatch}) {
        try{ 
            await AuthService.logout();
            localStorage.removeItem('token');
            dispatch(logout())
        }catch(e:unknown){ 
            if (e instanceof Error) return rejectWithValue(e.message)
            return String(e)
        }
    }
)
export const checkAuth = createAsyncThunk(
    'users/setUserAuth',
    async function (_,{rejectWithValue,dispatch}) {
        try{ 
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`,{withCredentials:true});
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            dispatch(setAuth(response.data.user))
        }catch(e:unknown){ 
            if (e instanceof Error) return rejectWithValue(e.message)
            return String(e)
        }
    }
)

const initialState:AuthSlice  = {
    status: 'idle',
    user: {} as IUser,
    isAuth : false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state,action) {
            state.isAuth = true;
            state.user = action.payload;
            state.status='finished';

        },
        logout(state){
            state.isAuth = false;
            state.user = {} as IUser;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(setUserAuth.pending, (state)=>{
            state.status = 'loading';
        })
    }
    //     [setUserAuth.rejected]:setError,
    //     [registerUser.pending]:(state)=>{
    //         state.status = 'loading';
    //         state.error = null;
    //     },
    //     [registerUser.rejected]:setError,
    // }
})
export const {setAuth,logout} = authSlice.actions;
export default authSlice.reducer;