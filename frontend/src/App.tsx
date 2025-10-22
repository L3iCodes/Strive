// Dependencies
import { BrowserRouter as Routers, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

// Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";

// Pages
import BoardPage from "./pages/BoardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import KanbanBoard from "./pages/KanbanBoard";
import ProfilePage from "./pages/ProfilePage";

// Hooks & Context
import { SocketContextProvider } from "./hooks/useSocket";

function App() {
    const { theme } = useThemeStore()
    const { isAuthenticated } = useAuthStore();
    const { verifyMutation } = useAuth();

    useEffect(() => {
        verifyMutation.mutate();
    }, []);

    return (
        <div className="h-screen max-h-screen max-w-screen flex flex-col md:flex-row bg-base-100 relative" data-theme={theme}>
            <SocketContextProvider>
                <Routers>
                    {isAuthenticated && <Navbar />}
                    <div className="h-full w-full flex flex-col overflow-auto"> {/* Right Side */}
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
                                        <Route path="/board/:id" element={isAuthenticated ? <KanbanBoard /> : <Navigate to="/login" />} />
                                        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
                                    </Routes>
                                
                            </div>
                        </div>
                </Routers>
            </SocketContextProvider>
        </div>
    );
}

export default App