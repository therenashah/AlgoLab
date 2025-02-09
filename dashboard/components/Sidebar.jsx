import { useRouter } from "next/router";

const Sidebar = () => {
    const router = useRouter();

    const menuItems = [
        { name: "Marketplace", path: "/marketplace" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "My Portfolio", path: "/portfolio" },
        { name: "Live Reports", path: "/live-reports" },
        { name: "Broking Details", path: "/broking-details" },
        { name: "Settings", path: "/settings" },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r shadow-md p-4">
            <h1 className="text-xl font-bold text-blue-700 mb-6">AlgoLab</h1>
            <ul className="space-y-2">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <button
                            onClick={() => router.push(item.path)}
                            className={`w-full text-left p-3 rounded-lg 
                                ${router.pathname === item.path ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                        >
                            {item.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
