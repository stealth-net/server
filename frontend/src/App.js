import React from 'react';
import { DMProvider } from './pages/mainpage/Content/Home/Direct/DMContext';
import LeftMenu from './pages/mainpage/Menu/LeftMenu/LeftMenu';

function App() {
  return (
    <DMProvider>
      <LeftMenu />
    </DMProvider>
  );
}

export default App;