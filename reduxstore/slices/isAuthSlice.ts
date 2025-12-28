import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { RootState, THUNKAPI } from '../store'

const initialState : any={
    authToken : "", 
    name : "" , 
    role : ""  , 
    user_id : "" , 
    user_email :"" , 
    mobilenumber : "" , 
    ambulance_id : ""
}
const authSlice = createSlice({
    name:"user", 
    initialState, 
    reducers:{
        setAuthToken : (state, action)=>{

            console.log("inside the setAuthToken action" , action.payload)
            state.authToken = action.payload.token; 
            state.name = action.payload.name; 
            state.role = action.payload.user_role ; 
            state.user_id = action.payload.user_id; 
            state.user_email = action.payload.user_email;
            state.mobilenumber = action.payload.mobilenumber ; 
            if(action.payload.user_role==="ambulance-driver"){
                state.ambulance_id= action.payload.ambulance_id ; 
                console.log("inside the if condoritip")
            }

              console.log("inside the if condoritip" , action.payload.user_role)
        }
    }, 
    extraReducers:(builder)=>{}
})


export const {setAuthToken} = authSlice.actions
export {authSlice};