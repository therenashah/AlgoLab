import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "@/firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db } from "@/firebase/config";
import { useRouter } from "next/router";

export default function Profiling() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({
        tradingGoals: "",
        tradingStyle: "",
        challenges: "",
        codingExperience: "",
        favoritePlatforms: "",
        learningMethods: "",
    });

    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, "users", user.uid);                
                const userSnap = await getDoc(docRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                }
            }
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, formData);
        }
        router.push("/dashboard");
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col p-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Hi {userData?.Username}! Welcome to AlgoLab.
                </h1>
                <p className="text-lg text-center mb-6">Help us understand you better as a trader.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Trading Goals */}
                    <div>
                        <label className="block text-lg font-medium">Trading Goals</label>
                        <select name="tradingGoals" onChange={handleChange} required className="w-full border p-2 rounded">
                            <option value="">Select trading goals</option>
                            <option value="long-term investing">Long-term Investing</option>
                            <option value="short-term trading">Short-term Trading</option>
                            <option value="algo-trading">Algo Trading</option>
                            <option value="learning">Learning</option>
                        </select>
                    </div>

                    {/* Trading Style */}
                    <div>
                        <label className="block text-lg font-medium">Preferred Trading Style</label>
                        <select name="tradingStyle" onChange={handleChange} required className="w-full border p-2 rounded">
                            <option value="">Select Preferred Trading Style</option>
                            <option value="scalping">Scalping</option>
                            <option value="day trading">Day Trading</option>
                            <option value="swing trading">Swing Trading</option>
                            <option value="position trading">Position Trading</option>
                        </select>
                    </div>

                    {/* Challenges in Trading */}
                    <div>
                        <label className="block text-lg font-medium">Current Challenges in Trading</label>
                        <input
                            type="text"
                            name="challenges"
                            placeholder="Enter current challenges in trading"
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* Coding Experience */}
                    <div>
                        <label className="block text-lg font-medium">Coding Experience</label>
                        <select name="codingExperience" onChange={handleChange} required className="w-full border p-2 rounded">
                            <option value="">Select your coding experience</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Favorite Trading Platforms/Tools */}
                    <div>
                        <label className="block text-lg font-medium">Favorite Trading Platforms/Tools</label>
                        <input
                            type="text"
                            name="favoritePlatforms"
                            placeholder="Enter favorite trading platforms/tools"
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* Preferred Learning Methods */}
                    <div>
                        <label className="block text-lg font-medium">Preferred Learning Methods</label>
                        <select name="learningMethods" onChange={handleChange} required className="w-full border p-2 rounded">
                            <option value="">Select your preferred learning methods</option>
                            <option value="videos">Videos</option>
                            <option value="books">Books</option>
                            <option value="blogs/articles">Blogs/Articles</option>
                            <option value="interactive courses">Interactive Courses</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700">
                        Submit & Continue
                    </button>
                </form>
            </div>
        </>
    );
}
