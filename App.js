import React from "react";
import { Provider } from 'react-redux';
import store from "./store";
import InstaClone from "./InstaClone";

export default function App() {
  return (
    <Provider store={store}>
      <InstaClone />
    </Provider>
  )
}