import { useMutation } from "@tanstack/react-query"
import { changePassword, updateProfile } from "../apis/user.api"
import { useAuthStore } from "../store/useAuthStore"

export const useUser = () => {
    const { setUser } = useAuthStore();

    const changePassMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: (data) => {
            setUser(data);
        }
    })

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            setUser(data);
        }
    })

    return ({ changePassMutation, updateProfileMutation });
};