import React from 'react';
import { DMProvider } from './pages/mainpage/Content/Home/Direct/DMContext';
import LeftMenu from './pages/mainpage/Menu/LeftMenu/LeftMenu';
// ... other imports

function App() {
  return (
    <DMProvider>
      {/* Your other components */}
      <LeftMenu />
      {/* More components */}
    </DMProvider>
  );
}

export default App;