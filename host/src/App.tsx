import React from 'react';
import {MicroFrontWrapper} from "./components/micro-front-wrapper";



const App = () => {
    const [show, setShow] = React.useState(false);

    return (
        <div>
            <button onClick={() => setShow(prev => !prev)}>show</button>
            {show && <MicroFrontWrapper/>}
        </div>
    );
};

export default App;