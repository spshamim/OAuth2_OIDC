"use client";
import { useRouter } from "next/navigation";
import withAuth from '../../utils/HOC/withAuth';
import apiClient from '../../utils/axiosInstance';

function Dashboard() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await apiClient.post("/auth/logout"); // Clears the refresh tokens
            localStorage.removeItem("accessToken"); // Clear the access tokens
            router.push("/auth/login"); // Redirect to the login page
        } catch (error:any) {
            console.error("Logout failed:", error.response.data);
        }
    }

    const handleCheck = async () => {
        try {
            const response = await apiClient.get("/pro/protected");
            console.log("Protected Route Test:", response.data);
        } catch (error:any) {
            console.error("Protected Route Test Failed:", error.response.data);
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <h1>Dashboard</h1>
            <h3 className="text-red-500 font-semibold">Protected Route Test:</h3>

            <button type="button" className="h-10 w-20 rounded-2xl bg-indigo-600 text-white font-semibold mt-10"
                onClick={handleCheck}
            >Test</button>

            <button type="button" className="h-10 w-20 rounded-2xl bg-purple-500 text-white font-semibold mt-10"
                onClick={handleLogout}
            >Logout</button>
        </div>
    );
}

export default withAuth(Dashboard);
