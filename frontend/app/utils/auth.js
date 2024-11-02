import { useRouter } from "next/navigation";
import apiClient from "./axiosInstance";

export async function logout() {
    const router = useRouter();
    await apiClient.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
    localStorage.removeItem("accessToken");
    router.push("/auth/login");
}
