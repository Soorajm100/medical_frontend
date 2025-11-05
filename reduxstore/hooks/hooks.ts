import { rootReducer } from "@/reduxstore/store";
import {TypedUseSelectorHook, useDispatch, useSelector} from  'react-redux'
import {AnyAction} from 'redux'; 
import { ThunkDispatch } from "@reduxjs/toolkit";


type AppState = ReturnType<typeof rootReducer>
type TypedDispatch<T> = ThunkDispatch<T, any, AnyAction>;

export  const useAppDispatch=()=>useDispatch<TypedDispatch<AppState>>()
export const useAppSelector : TypedUseSelectorHook<AppState> = useSelector; 

