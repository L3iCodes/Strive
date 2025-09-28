import { EyeClosed, Eye, Lock, Mail } from "lucide-react"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

// Hooks and store
import { useAuth } from "../hooks/useAuth";
import type { User } from "../store/useAuthStore";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [credentials, setCredentials] = useState<User>({email: "", password:""})
    const { loginMutation } = useAuth();
    const navigate = useNavigate();
    
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginMutation.mutate(credentials);
    };

    return (
        <div className="flex w-full h-full absolute top-0 left-0">
            <div className="w-full flex flex-col items-center justify-center">
                <div className="w-full max-w-xs flex flex-col">
                    <div>
                        <h1 className={`font-bold text-6xl`}>Strive</h1>
                        <p className="text-xs">Your boards are waiting. Time to Strive</p>
                    </div>

                    <form onSubmit={handleLogin} className="w-full mt-10 flex flex-col gap-4 text-xs">
                        <div className="w-full flex flex-col gap-2">
                            <label className="label text-[13px] font-medium">Email</label>
                            <div className="flex items-center border-1 border-base-content/10 text-base-content/50">
                                <Mail className={'m-2'} size={18}/>
                                <input 
                                    type="Email" 
                                    placeholder="janedoe@email.com"
                                    value={credentials.email}
                                    className="w-full px-2 py-2 rounded-xs"
                                    onChange={(e) => setCredentials({...credentials, email: e.currentTarget.value})} 
                                />
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <label className="label text-[13px] font-medium">Password</label>
                            <div className="flex items-center border-1 border-base-content/10 text-base-content/50">
                                <Lock className={'m-2'} size={18}/>
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    placeholder="password"
                                    value={credentials.password}
                                    className="w-full px-2 py-2 rounded-xs"
                                    onChange={(e) => setCredentials({...credentials, password: e.currentTarget.value})}  
                                />
                                {showPassword 
                                    ? (<Eye onClick={() => setShowPassword(false)} className={'m-2 cursor-pointer'} size={18}/>)
                                    : (<EyeClosed onClick={() => setShowPassword(true)} className={'m-2 cursor-pointer'} size={18}/>)
                                }
                            </div>
                        </div>  

                        <p className={`text-error font-medium ml-auto ${!loginMutation.isError && 'opacity-0'}`}>
                            {loginMutation.error instanceof Error
                                ? loginMutation.error.message
                                : "Something went wrong"
                            }
                        </p>

                        <button 
                            type="submit" 
                            className="btn"
                        >
                            {loginMutation?.isPending 
                                ? (<span className="loading loading-dots loading-xs"></span>) 
                                : 'Log In'
                            }
                        </button>

                        <p className="mt-2 mx-auto md:ml-auto md:mx-0">
                            Don't have an account? 
                            <span onClick={() => navigate('/signup')} className="text-accent/80 ml-2 cursor-pointer hover:text-accent">Create Account</span>
                        </p>
                    </form>
                </div>
                
            </div>

            <div className="hidden w-full md:flex flex-col justify-center items-center bg-base-200">
                {/* Art */}
                <div className="flex flex-col gap-2 items-center justify-center">
                    <h1 className="text-xl self-start">Pick up where you left off <br/>— stay productive with <span className="font-bold text-accent">Strive</span></h1>
                    <div className="flex gap-10">
                        <div className="w-[100px] h-[400px] bg-accent rounded-[5px] animate-pulse border-1 border-primary"/>
                        <div className="w-[100px] h-[200px] bg-accent rounded-[5px] animate-pulse border-1 border-primary"/>
                        <div className="w-[100px] h-[500px] bg-accent rounded-[5px] animate-pulse border-1 border-primary"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage