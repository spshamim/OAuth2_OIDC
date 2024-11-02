"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const dataSubmit = async (data: any) => {
    try {
      const email = data.email;
      const password = data.password;
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password }, { withCredentials: true });
      if (res.status === 200) {
        localStorage.setItem("accessToken", res.data.token);
        router.push("/auth/dashboard");
      } else {
        throw new Error();
      }
    } catch (error: any) {
      console.error("Login failed:", error.response.data);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center">
      <div className="w-[600px] h-[400px] mx-auto flex flex-col space-y-5 justify-center bg-slate-400 rounded-2xl items-center">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit(dataSubmit)} className="mt-4 w-full flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border border-gray-300 rounded outline-none focus:outline-none text-black w-[80%] mb-2"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && typeof errors.email.message === "string" && (
            <span className="text-[#dc3545] text-[16px] font-semibold">{errors.email.message}</span>
          )}
          <input
            type="password"
            placeholder="Password"
            className="p-2 border border-gray-300 rounded mt-2 outline-none focus:outline-none text-black w-[80%] mb-2"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && typeof errors.password.message === "string" && (
            <span className="text-[#dc3545] text-[16px] font-semibold">{errors.password.message}</span>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded mt-2 font-bold w-[80%]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
