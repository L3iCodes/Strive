import { ChevronLeft, Kanban, User, Settings, Menu, Bell } from "lucide-react"
import { useRef, useState } from "react"
import { useLocation } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { useAuth } from "../hooks/useAuth";

const navbarContent = [
    {id: "/", name: "Boards", icon: <Kanban size={18}/>},
    {id: "/profile", name: "Profile", icon: <User size={18}/>},
    {id: "/settings", name: "Settings", icon: <Settings size={18}/>}
];

const Navbar = () => {
    const [navOpen, setNavOpen] = useState<boolean>(false);
    const { logoutMutation } = useAuth();
    const { user } = useAuthStore();
    const location = useLocation();
    const pathName = location.pathname;

    return (
        <div className={`absolute h-[60px] md:h-screen md:relative flex flex-col bg-base-200/90 border-r-1 border-r-base-content/10 text-base-content
                        transition-all ease-in-out duration-300 ${navOpen ? 'w-[200px] h-screen' : "w-[60px]" } z-100`}>
            <div className="w-full h-[60px] px-5 flex items-center border-b-1 border-base-content/10">
                <h1 className={`font-bold ${!navOpen && 'hidden opacity-0'}`}>Strive</h1>
                <div 
                    onClick={() => setNavOpen(s => !s)}
                    className={`${!navOpen && "w-full justify-center"} ml-auto flex rounded-sm hover:bg-base-300/60 cursor-pointer`}
                    >
                        {navOpen ? <ChevronLeft size={20}/> : <><h1 className="hidden font-bold md:block">S</h1> <Menu className="md:hidden" size={20}/></>}
                </div>
            </div>
            <div className={`hidden w-full p-3 md:flex items-center gap-2 ${navOpen ? '!flex' : 'justify-center'}`}>
                <img 
                    src={'https://avatar.iran.liara.run/public'}
                    className="w-6 h-6 object-cover border-1 border-primary rounded-2xl "
                />
                <h3
                    className={`transition-all duration-300 overflow-hidden text-xs font-bold 
                            ${navOpen ? "opacity-100 w-auto" : "opacity-0 hidden"}`}
                >
                    {user?.username}
                </h3>
                <Bell className={`ml-auto hover:fill-base-content cursor-pointer ${navOpen ? "opacity-100 w-auto" : "opacity-0 absolute"}`} size={18}/>
            </div>
            <div className={`hidden h-fit w-full p-3 md:flex flex-col gap-2 ${navOpen && '!flex'}`}>
                {navbarContent.map(item => (
                    <div key={item.id} className={`w-full p-2 flex items-center gap-3 rounded-xs text-xs font-medium cursor-pointer hover:bg-base-300/60 active:bg-base-300 ${pathName === item.id && ('bg-base-300 border-1 border-base-content/10')}`}>
                        {item.icon}
                        <h3
                            className={`transition-all duration-300 overflow-hidden 
                                    ${navOpen ? "opacity-100 w-auto" : "opacity-0 hidden"}`}
                        >
                            {item.name}
                        </h3>
                    </div>
                ))}
            </div>

            <button onClick={()=> logoutMutation.mutate()} className="btn btn-xs">Logout</button>
           
            <div className={`hidden w-full h-[60px] md:flex items-center mt-auto border-t-1 border-base-content/10 ${!navOpen ? "justify-center" : "!flex"}`}>
                {<ThemeControllerIcon navOpen={navOpen}/>}
            </div>
        </div>
    );
};

type ThemeControllerIconProps = {
  navOpen: boolean;
};

const ThemeControllerIcon = ({navOpen}: ThemeControllerIconProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { setTheme, theme } = useThemeStore();
    
    const handleThemeChange = () => {
        if (inputRef.current) {
            inputRef.current.click();
            setTheme(inputRef.current.value);
        };
    }

    return(
        <div 
            onClick={handleThemeChange} 
            className={`group ${navOpen && "w-full"} p-5 flex items-center gap-3 rounded-xs text-xs  cursor-pointer hover:bg-base-300/60 active:bg-base-300`}
            >
            <label className="swap swap-rotate">
                {/* this hidden checkbox controls the state */}
                <input 
                    ref={inputRef} 
                    type="checkbox" 
                    className="theme-controller" 
                    value={theme === 'business' ? 'light' : 'business'}
                />

                {/* sun icon */}
                <svg
                    className="swap-off h-5 w-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path
                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>

                {/* moon icon */}
                <svg
                    className="swap-on h-5 w-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path
                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
                
            </label>
            <h3
                className={`transition-all duration-300 overflow-hidden 
                        ${navOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}
            >
                Light Mode
            </h3>
        </div>
    );
};

export default Navbar