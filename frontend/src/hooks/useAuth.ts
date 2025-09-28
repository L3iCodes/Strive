import { useMutation } from "@tanstack/react-query"
import { login, logout, signup, verify } from "../apis/auth.api"
import { useAuthStore } from "../store/useAuthStore"

export const useAuth = () => {
    const { setUser, setIsAuthenticated } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setUser(data);
            setIsAuthenticated(true);
        },
        onError: (error) => {
            // Add notif
        }
    });

    const signupMutation = useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            setUser(data);
            setIsAuthenticated(true);
        },
        onError: (error) => {
            // Add notif
        }
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            setUser(null);
            setIsAuthenticated(false);
        },
        onError: (error) => {
            setUser(null);
            setIsAuthenticated(false);
        }
    });

    const verifyMutation = useMutation({
        mutationFn: verify,
        onSuccess: (data) => {
            setUser(data);
            setIsAuthenticated(true);
        },
        onError: (error) => {
            setUser(null);
            setIsAuthenticated(false);
        }
    });

    return({loginMutation, verifyMutation, logoutMutation, signupMutation})
};