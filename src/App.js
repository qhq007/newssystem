import React from 'react'
import { useRoutes } from 'react-router-dom'
import { Provider } from 'react-redux'
import {store} from "./redux/store"
import list from "./router"
import "./App.css"

export default function App() {
  const element = useRoutes(list);
  return (
    <Provider store={store}>
      {element}
    </Provider>
  )
}

