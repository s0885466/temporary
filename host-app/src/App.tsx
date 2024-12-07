import React from "react";

import { RemoteLoader } from "./components/remote-loader";

const App = () => {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <button onClick={() => setShow((prev) => !prev)}>show</button>
      {show && (
        <RemoteLoader
          remoteUrl="http://localhost:4000/remoteEntry.js"
          scope="microApp"
          moduleName="./moduleName"
        />
      )}
    </div>
  );
};

export default App;
