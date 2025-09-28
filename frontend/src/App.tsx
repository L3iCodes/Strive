// Dependencies
import { BrowserRouter as Routers, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";

// Pages
import BoardPage from "./pages/BoardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

function App() {
    const { theme } = useThemeStore()
    const { isAuthenticated, user } = useAuthStore();
    const { verifyMutation } = useAuth();

    useEffect(() => {
        verifyMutation.mutate();
    }, []);

    return (
        <div className="h-screen max-h-screen flex flex-col md:flex-row bg-base-100 relative" data-theme={theme}>
            <Routers>
                {isAuthenticated && <Navbar />}
                <div className="h-full w-full flex flex-col"> {/* Right Side */}
                    {isAuthenticated && <Header />}
                        <div className="w-full h-full p-5 overflow-hidden">
                            {verifyMutation.isPending && (
                                <div className="w-full h-full flex gap-2 absolute top-0 left-0 z-100 bg-base-100 justify-center items-center"> 
                                    <span className="loading loading-infinity loading-xl"></span>
                                    <p>Connecting to Server. Please Wait</p>
                                </div>
                            )}
                            <Routes>
                                <Route path="/" element={isAuthenticated ? <BoardPage /> : <Navigate to="/login" />} />
                                <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
                                <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />
                            </Routes>
                        </div>
                    </div>
            </Routers>
        </div>
    );
}

export default App