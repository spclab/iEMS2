"use client"
import { AuthProvider, useAuth } from "../contexts/AuthContext"
import { Navigation } from "@/components/Navigation"
import { ExpenseReimbursementForm } from "@/components/ExpenseReimbursementForm"
import { ApproverScreen } from "@/components/ApproverScreen"
import { Button } from "@/components/ui/button"

function LoginScreen() {
  const { login } = useAuth()

  const loginAsEmployee = () => {
    login({ id: "1", name: "John Employee", role: "employee" })
  }

  const loginAsApprover = () => {
    login({ id: "2", name: "Jane Approver", role: "approver" })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">iEMS</h1>
      <div className="space-y-4">
        <Button onClick={loginAsEmployee} className="w-full">
          Submit Expense
        </Button>
        <Button onClick={loginAsApprover} className="w-full">
          Approve Expense
        </Button>
      </div>
    </div>
  )
}

function AppContent() {
  const { user } = useAuth()

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto py-10">
        {user.role === "employee" ? <ExpenseReimbursementForm /> : <ApproverScreen />}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

