// Dependencies
import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

// Components
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
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

function App() {
    const { theme } = useThemeStore()
    const { verifyMutation } = useAuth();

    useEffect(() => {
        verifyMutation.mutate();
    }, []);

    return (
        <div className="h-screen max-h-screen max-w-screen flex flex-col md:flex-row bg-base-100 relative" data-theme={theme}>
            <SocketContextProvider>
                <Routers>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <BoardPage />
                                    </AppLayout>
                                </ProtectedRoute>
                            } />
                        <Route
                            path="/login"
                            element={
                                <ProtectedRoute requireAuth={false}>
                                    <div className="w-full h-full p-5">
                                        <LoginPage />
                                    </div>
                                </ProtectedRoute>
                            } />
                        <Route
                            path="/signup"
                            element={
                                <ProtectedRoute requireAuth={false}>
                                    <div className="w-full h-full p-5">
                                        <SignupPage />
                                    </div>
                                </ProtectedRoute>
                            } />
                        <Route
                            path="/board/:id"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <KanbanBoard />
                                    </AppLayout>
                                </ProtectedRoute>
                            } />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <ProfilePage />
                                    </AppLayout>
                                </ProtectedRoute>
                            } />
                    </Routes>
                </Routers>
            </SocketContextProvider>
        </div>
    );
}

export default App