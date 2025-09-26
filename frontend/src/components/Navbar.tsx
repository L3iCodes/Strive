import { ChevronLeft, ChevronRight, Kanban, User, Settings } from "lucide-react"
import { useState } from "react"
import { useLocation } from "react-router-dom";

const navbarContent = [
    {id: "/", name: "Boards", icon: <Kanban size={18}/>},
    {id: "/profile", name: "Profile", icon: <User size={18}/>},
    {id: "/settings", name: "Settings", icon: <Settings size={18}/>}
];

const Navbar = () => {
    const [navOpen, setNavOpen] = useState(false);
    const location = useLocation();
    const pathName = location.pathname;

    return (
        <div className={`h-screen flex flex-col bg-base-200/90 border-r-1 border-r-base-content/10 text-base-content
                        transition-all ease-in-out duration-300 ${navOpen ? 'w-[200px]' : "w-[60px]" }`}>
            <div className="p-5 w-full h-fit flex items-center border-b-1  border-base-content/10">
                <h1 className={`font-bold ${!navOpen && 'hidden opacity-0'}`}>Strive</h1>
                <div 
                    onClick={() => setNavOpen(s => !s)}
                    className={`${!navOpen && "w-full"} ml-auto flex justify-center rounded-sm  hover:bg-neutral cursor-pointer`}
                    >
                        {navOpen ? <ChevronLeft size={20}/> : <h1 className="font-bold">S</h1>}
                </div>
            </div>

            <div className="h-fit w-full p-3 flex flex-col gap-2">
                {navbarContent.map(item => (
                    <div key={item.id} className={`w-full p-2 flex items-center gap-3 rounded-xs text-xs font-medium cursor-pointer hover:bg-neutral/50 active:bg-neutral ${pathName === item.id && ('bg-neutral')}`}>
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
        </div>
    );
};

export default Navbar
