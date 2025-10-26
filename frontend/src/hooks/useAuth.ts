import { useMutation } from "@tanstack/react-query"
import { login, logout, signup, verify } from "../apis/auth.api"
import { useAuthStore } from "../store/useAuthStore"

export const useAuth = () => {
    const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setUser(data);
            setIsAuthenticated(true);
        },
        onError: (_error) => {
            // Add notif
        }
    });

    const signupMutation = useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            setUser(data);
            setIsAuthenticated(true);
        },
        onError: (_error) => {
            // Add notif
        }
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: (_data) => {
            setUser(null);
            setIsAuthenticated(false);
        },
        onError: (_error) => {
            setUser(null);
            setIsAuthenticated(false);
        }
    });

    const verifyMutation = useMutation({
        mutationFn: verify,
        onMutate:() => {
            setIsLoading(true);
        },
        onSuccess: (data) => {
            setUser(data);
            setIsAuthenticated(true);
        },
        onError: (_error) => {
            setUser(null);
            setIsAuthenticated(false);
        },
        onSettled: () => {
            setIsLoading(false);
        }
    });

    return({loginMutation, verifyMutation, logoutMutation, signupMutation})
};