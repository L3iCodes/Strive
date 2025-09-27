// Dependencies
import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import { useThemeStore } from "./store/useThemeStore";

// Pages
import BoardPage from "./pages/BoardPage";

function App() {
    const { theme } = useThemeStore()
    return (
        <div className="h-screen max-h-screen flex flex-col md:flex-row bg-base-100 relative" data-theme={theme}>
            <Routers>
                <Navbar />
                <div className="h-full w-full flex flex-col"> {/* Right Side */}
                    <Header />
                        <div className="w-full h-full p-2 overflow-hidden">
                            <Routes>
                                <Route path="/" element={<BoardPage />} />
                            </Routes>
                        </div>
                    </div>
            </Routers>
        </div>
    );
}

export default App