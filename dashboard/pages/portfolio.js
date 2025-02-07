import { Navbar } from "@/components/Navbar";
import Sidebar from "@/components/Sidebar"; 

export default function Portfolio() {
    return (
        <div className="flex">
        <Sidebar />
        <Navbar />
        <h1>Portfolio</h1>
        </div>
    );
}
