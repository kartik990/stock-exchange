"use client";

import { usePathname } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./core/Button";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export const Appbar = () => {
  const route = usePathname();
  const router = useRouter();

  const { user, setUser } = useUser();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // Essential for sending/receiving cookies
      });

      if (response.ok) {
        setUser(null);
        router.push("/auth/sign-in");
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Network error during logout:", error);
    }
  };

  const getNavLinkClasses = (pathPrefix: string) =>
    `px-4 py-2 rounded-md transition-colors duration-200 ease-in-out cursor-pointer text-sm font-medium
     ${
       route.startsWith(pathPrefix)
         ? "bg-gray-700 text-white"
         : "text-gray-400 hover:text-white hover:bg-gray-800"
     }`;

  return (
    <div className="bg-gray-900 border-b border-gray-700 shadow-lg">
      {" "}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center h-16">
        {" "}
        <div className="flex items-center space-x-8">
          <div
            className="text-2xl font-bold text-white tracking-wide cursor-pointer" // Larger, bolder, more prominent
            onClick={() => router.push("/")}
          >
            Exchange
          </div>
          <nav className="hidden md:flex space-x-2">
            <div
              className={getNavLinkClasses("/dashboard")}
              onClick={() => router.push("/")} // Assuming "/" is your dashboard
            >
              Dashboard
            </div>
            <div
              className={getNavLinkClasses("/TATA_INR")}
              onClick={() => router.push("/TATA_INR")}
            >
              Trade
            </div>
            <div
              className={getNavLinkClasses("/orders")}
              onClick={() => router.push("/orders")}
            >
              Orders
            </div>
            <div
              className={getNavLinkClasses("/holdings")}
              onClick={() => router.push("/holdings")}
            >
              Holdings
            </div>
            <div
              className={getNavLinkClasses("/funds")}
              onClick={() => router.push("/funds")}
            >
              Funds
            </div>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-white text-md font-semibold hidden sm:inline-block">
                Welcome, {user.username || user.email}{" "}
              </span>
              <PrimaryButton onClick={handleLogout}>Logout</PrimaryButton>
            </>
          ) : (
            <div className="flex gap-0">
              <SuccessButton onClick={() => router.push("/auth/sign-in")}>
                Sign In
              </SuccessButton>
              <PrimaryButton onClick={() => router.push("/auth/sign-up")}>
                Sign Up
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
