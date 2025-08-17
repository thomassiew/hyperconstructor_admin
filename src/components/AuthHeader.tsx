"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AuthHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            HyperConstructor Admin
          </h1>
          <p className="text-sm text-gray-600">Database Management Portal</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
