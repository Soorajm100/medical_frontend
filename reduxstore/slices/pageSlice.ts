import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { RootState, THUNKAPI } from '../store'


export interface tabnumber{
    activestage : number, 
    open : boolean
}

const initialState : tabnumber={
    activestage : 1, 
    open : false 
}
                                                                                                                                        
const userSlice = createSlice({
    name:"user", 
    initialState, 
    reducers:{
        changeStateHome : (state)=>{
            state.activestage = 1; 
        }, 
        changeStatePressure:(state)=>{
            state.activestage = 2;
        }, 
        changeStateTemperature: (state)=>{
            state.activestage = 3; 
        }, 
        changeAboutUs : (state)=>{
            state.activestage = 4 ; 
        }, 
        changeContactus : (state)=>{
            state.activestage = 5; 
        }, 
        changeOpen : (state)=>{
            state.open = !state.open ; 
        }
    }, 
    extraReducers:(builder)=>{}
})

export const {changeStateHome,changeOpen ,changeStatePressure, changeAboutUs, changeStateTemperature , changeContactus} = userSlice.actions
export {userSlice}; 