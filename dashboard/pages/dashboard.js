import { useState } from "react";
import { Navbar } from "../components/Navbar"  // Adjust the path as needed
import Sidebar from "@/components/Sidebar"; // Adjust the path as needed

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("7D");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        {/* Navbar */}
        <Navbar />

        {/* Active Plan Details */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          <Card title="Active Plan Details">
            <p className="text-red-500">No Active Plan</p>
            <p className="text-red-500">No Expired Plan</p>
          </Card>
          <Card title="AlgoBulls Money">
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">₹0.00</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Money</button>
            </div>
          </Card>
        </div>

        {/* Profile & Account Info */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <Card title="Profile Information">
            <p>Trading Experience: <span className="text-blue-600">Beginner</span></p>
            <p>Interested Products: <span className="text-blue-600">Odyssey</span></p>
          </Card>
          <Card title="Account Information">
            <p>Strategies Saved: 0</p>
            <p>Running Strategies: 0</p>
            <p>Analytics Access: <span className="text-red-500">OFF</span></p>
          </Card>
        </div>

        {/* Portfolio Analysis */}
        <Card title="Your Portfolio Analysis">
          <div className="flex gap-4 mt-2">
            {["1D", "3D", "7D", "1M", "3M", "6M", "1Y", "All Time"].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1 rounded ${selectedTab === tab ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </Card>

        {/* Broker Information */}
        <Card title="Broker Information">
          <p className="text-red-500">No Broker Added</p>
          <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Add Broker</button>
        </Card>

        {/* Visual Analytics */}
        <Card title="Visual Analytics (Beta)">
          <div className="flex gap-4 mt-2">
            <select className="border px-2 py-1 rounded">
              <option>Odyssey</option>
            </select>
            <select className="border px-2 py-1 rounded">
              <option>1M</option>
            </select>
            <button className="bg-gray-500 text-white px-3 py-1 rounded">Test</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded">Live</button>
          </div>
        </Card>

        {/* Recent Orders */}
        <Card title="Recent Orders from P&L and Trade Book">
          <p className="text-gray-500">You have not executed any strategies yet!</p>
          <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Request Custom Strategy</button>
        </Card>
      </main>
    </div>
  );
}

// Reusable Card Component
function Card({ title, children }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}
