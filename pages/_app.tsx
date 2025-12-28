
import type { AppProps } from "next/app";
import { wrapper } from "@/reduxstore/store";
import { Provider } from "react-redux";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import React from "react";

export default function App({ Component, ...rest }: AppProps) {
  const { store: wrappedStore, props } = wrapper.useWrappedStore(rest);
  const [url, setUrl] = useState("");
  const [mounted, setMounted] = useState(false);


  useEffect(()=>{
    setMounted(true)
  })

  return (
    mounted &&<>
          <Provider store={wrappedStore}>
            <Component {...props.pageProps} />
          </Provider>
     
     
    </>
  );
}
