"use client"

import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut, DollarSign } from "lucide-react"

export function Navigation() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold flex items-center">
          <DollarSign className="mr-2" />
          iEMS
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.name}</span>
            <Button
              onClick={logout}
              variant="outline"
              className="text-white bg-transparent hover:text-black border-white hover:bg-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}

