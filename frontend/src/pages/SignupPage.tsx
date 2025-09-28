import { EyeClosed, Eye, Lock, Mail } from "lucide-react"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

interface Credentials {
    username: string;
    email: string;
    password: string;
};

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState<boolean>(true);
    const [credentials, setCredentials] = useState<Credentials>({username:"", email:"", password:""})
    const navigate = useNavigate();
    
    const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="flex w-full h-full absolute top-0 left-0">
            <div className="w-full flex flex-col items-center justify-center">
                <div className="w-full max-w-xs flex flex-col">
                    <div>
                        <h1 className={`font-bold text-6xl`}>Strive</h1>
                        <p className="text-xs">Start organizing. Start achieving. Start Striving.</p>
                    </div>

                    <form onSubmit={handleSignup} className="w-full mt-10 flex flex-col gap-4 text-xs">
                        <div className="w-full flex flex-col gap-2">
                            <label className="label text-[13px] font-medium">Username</label>
                            <div className="flex items-center border-1 border-base-content/10 text-base-content/50">
                                <Mail className={'m-2'} size={18}/>
                                <input 
                                    type="Email" 
                                    placeholder="janedoe@email.com"
                                    value={credentials.username}
                                    className="w-full px-2 py-2 rounded-xs"
                                    onChange={(e) => setCredentials({...credentials, username: e.currentTarget.value})} 
                                />
                            </div>
                        </div>

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
                                    value={credentials.email}
                                    className="w-full px-2 py-2 rounded-xs"
                                    onChange={(e) => setCredentials({...credentials, password: e.currentTarget.value})}  
                                />
                                {showPassword 
                                    ? (<Eye onClick={() => setShowPassword(false)} className={'m-2 cursor-pointer'} size={18}/>)
                                    : (<EyeClosed onClick={() => setShowPassword(true)} className={'m-2 cursor-pointer'} size={18}/>)
                                }
                            </div>
                        </div>  

                        <p className="text-error font-medium ml-auto opacity-0">Error</p>

                        <button type="submit" className="btn">Login</button>

                        <p className="mt-2 mx-auto md:ml-auto md:mx-0">
                            Already have an account? 
                            <span onClick={() => navigate('/login')} className="text-accent/80 ml-2 cursor-pointer hover:text-accent">Login</span>
                        </p>
                    </form>
                </div>
                
            </div>

            <div className="hidden w-full md:flex flex-col justify-center items-center bg-base-200">
                {/* Art */}
                <div className="flex flex-col gap-2 items-center justify-center">
                    <h1 className="text-xl self-start">One board away from better focus. <br/><span className="font-bold text-accent">Join Strive today.</span></h1>
                    <div className="flex gap-10">
                        <div className="w-[100px] h-[400px] bg-accent rounded-[5px] animate-pulse border-1 border-primary"/>
                        <div className="w-[100px] h-[200px] bg-accent rounded-[5px] animate-pulse border-1 border-primary"/>
                        <div className="w-[100px] h-[500px] bg-accent rounded-[5px] animate-pulse border-1 border-primary"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage