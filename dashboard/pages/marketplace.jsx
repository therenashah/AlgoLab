import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";  // Adjust the path as needed
import Sidebar from "@/components/Sidebar"; 
import { PiggyBank, Clock } from "lucide-react"; // Import an icon from Lucide

const strategies = [
  {
    title: "Stochastic Crossover",
    description:
      "A trend-following strategy using the stochastic oscillator to identify buy and sell opportunities based on overbought and oversold conditions.",
    stock: "ADANIPORTS",
    exchange: "NSE",
    type: "EQ | INTRADAY",
    minCapital: 3000,
    tags: ["Equity", "Indicator", "Stochastic"],
    popularity: 331,
  },
  {
    title: "Volatility Trend ATR",
    description:
      "A trend-following strategy using the Average True Range (ATR) to identify market volatility and determine potential entry and exit points.",
    stock: "TCS",
    exchange: "NSE",
    type: "EQ | INTRADAY",
    minCapital: 5000,
    tags: ["Equity", "ATR", "Trend"],
    popularity: 135,
  },
  {
    title: "Mean Reversion Bollinger Bands",
    description:
      "A mean-reversion strategy that uses Bollinger Bands to take positions contrary to the market trend, capitalizing on price extremes.",
    stock: "INFY",
    exchange: "NSE",
    type: "EQ | INTRADAY",
    minCapital: 3000,
    tags: ["Equity", "Bollinger Bands", "Reversion"],
    popularity: 44,
  },
];

export default function Marketplace() {
  const [tradingExperience, setTradingExperience] = useState("Beginner");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (title) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((fav) => fav !== title) : [...prev, title]
    );
  };

  const filteredStrategies = strategies.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
    {/* Sidebar */}
      <Sidebar />

    {/* Main Content */}
    <main className="flex-1 p-6 bg-white">
    {/* Navbar */}
    <Navbar />
    <div className="grid grid-cols-5 gap-4 p-4"> {/* Ensures cards stay side-by-side */}
    <Card title="Max Capital Allowed" value="0" icon={PiggyBank} />
    <Card title="Total Execution Time" value="0" icon={Clock} />
    {/* Add more cards as needed */}
  </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="text-md font-semibold">Strategy Filter based on:</h2>
          <div className="flex items-center space-x-4 mt-2">
            <span>Trading Experience:</span>
            <button className="px-3 py-1 bg-black text-white rounded">{tradingExperience}</button>
            <input
              type="text"
              placeholder="Search for Strategy"
              className="border p-2 rounded w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Favourite
            </label>
          </div>
        </div>

        {/* Strategy Cards */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {filteredStrategies.map((strategy, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">{strategy.title}</h2>
                <div className="flex space-x-2">
                  <button onClick={() => toggleFavorite(strategy.title)}>
                    {favorites.includes(strategy.title) ? "⭐" : "☆"}
                  </button>
                  <button>🔗</button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
              <div className="border p-2 rounded mt-3 bg-gray-100">
                <p className="font-bold">{strategy.stock}</p>
                <p className="text-xs text-gray-600">{strategy.exchange} | {strategy.type}</p>
                <p className="text-sm mt-1">
                  Min. Capital Required <span className="font-bold text-green-600">₹{strategy.minCapital}</span>
                </p>
              </div>
              <div className="flex flex-wrap mt-2 space-x-1">
                {strategy.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 text-xs rounded bg-gray-200">{tag}</span>
                ))}
              </div>
              <button className="w-full bg-blue-600 text-white text-sm font-semibold py-2 mt-3 rounded-md hover:bg-blue-700">
                Add to My Portfolio
              </button>
              <Link href={`/strategy/${strategy.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <p className="text-blue-600 text-sm mt-2 text-center cursor-pointer">View Details &gt;</p>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const Card = ({ title, value, icon: Icon }) => {
    return (
      <div className="w-64 flex items-center gap-3 border border-blue-500 rounded-lg p-4 bg-blue-50 shadow-sm">
        {Icon && <Icon className="text-blue-600 w-6 h-6" />}
        <div>
          <h2 className="text-2xl font-bold text-blue-900">{value}</h2>
          <p className="text-blue-700 text-sm">{title}</p>
        </div>
      </div>
    );
  };
