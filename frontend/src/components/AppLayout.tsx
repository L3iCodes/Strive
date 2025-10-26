import Navbar from "./Navbar";
import Header from "./Header";

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <>
            <Navbar />
            <div className="h-full w-full flex flex-col overflow-auto">
                <Header />
                <div className="w-full h-full p-5 overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
};

export default AppLayout;