// Dependencies
import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";


// Components
import Navbar from "./components/Navbar";

function App() {
    return (
        <div className="h-screen max-h-screen bg-base-100">
            <Routers>
                <Navbar />
                <Routes>
                    
                </Routes>
            </Routers>
            
        </div>
    );
}

export default App
