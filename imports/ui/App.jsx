import React, { useState } from 'react';
import "../../client/styles/main.less"
import MessagesContainer from './components/MessagesContainer';
import InputNewMessage from './components/InputNewMessage';

export const App = () => {  

  return (
    <div className="bg-black vh-100 vw-100 d-flex flex-column">
      <MessagesContainer />
      <InputNewMessage />       
    </div>
  );
};