import React from "react";
import Link from "next/link";

const StrategyCard = ({
  title,
  description,
  stock,
  exchange,
  type,
  minCapital,
  tags,
  onAddToPortfolio,
}) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-gray-600">⭐</button>
          <button className="text-gray-400 hover:text-gray-600">🔗</button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-1">{description}</p>

      <div className="border p-2 rounded-md mt-3 bg-gray-100">
        <p className="font-bold">{stock}</p>
        <p className="text-xs text-gray-600">{exchange} | {type}</p>
        <p className="text-sm mt-1">
          Min. Capital Required <span className="font-bold text-green-600">₹{minCapital}</span>
        </p>
      </div>

      <div className="flex flex-wrap mt-2 space-x-1">
        {tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 text-xs rounded bg-gray-200">
            {tag}
          </span>
        ))}
      </div>

      <button
        className="w-full bg-blue-600 text-white text-sm font-semibold py-2 mt-3 rounded-md hover:bg-blue-700"
        onClick={onAddToPortfolio}
      >
        Add to My Portfolio
      </button>

      <Link href={`/strategy/${title.toLowerCase().replace(/\s+/g, "-")}`}>
        <p className="text-blue-600 text-sm mt-2 text-center cursor-pointer">
          View Details &gt;
        </p>
      </Link>
    </div>
  );
};

export default StrategyCard;
