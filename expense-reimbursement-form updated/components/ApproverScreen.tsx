"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ExpenseRequest, ExpenseStatus } from "../types/expenseTypes"
import { CheckCircle, XCircle, Info, Send } from "lucide-react"
import { handleApproverDecision } from "../utils/formSubmission"

const mockRequests: ExpenseRequest[] = [
  {
    id: "1",
    employeeName: "John Doe",
    employeeId: "EMP001",
    expenseType: "Travel",
    amount: 150.0,
    billDate: "2023-05-15",
    status: "Pending",
  },
  {
    id: "2",
    employeeName: "Jane Smith",
    employeeId: "EMP002",
    expenseType: "Office Supplies",
    amount: 75.5,
    billDate: "2023-05-18",
    status: "Pending",
  },
  {
    id: "3",
    employeeName: "Mike Johnson",
    employeeId: "EMP003",
    expenseType: "Fuel",
    amount: 50.0,
    billDate: "2023-05-20",
    status: "Pending",
  },
]

export function ApproverScreen() {
  const [requests, setRequests] = useState<ExpenseRequest[]>(mockRequests)
  const [selectedRequest, setSelectedRequest] = useState<ExpenseRequest | null>(null)
  const [comment, setComment] = useState("")

  const handleStatusChange = async (id: string, newStatus: ExpenseStatus) => {
    try {
      await handleApproverDecision(id, newStatus, comment)
      setRequests(requests.map((req) => (req.id === id ? { ...req, status: newStatus } : req)))
      setComment("")
      setSelectedRequest(null)
    } catch (error) {
      console.error("Error updating status:", error)
      // Handle error (e.g., show an error message to the user)
    }
  }

  const handleCommentSubmit = async () => {
    if (selectedRequest) {
      try {
        await handleApproverDecision(selectedRequest.id, selectedRequest.status, comment)
        console.log(`Comment submitted for request ${selectedRequest.id}:`, comment)
        setComment("")
        setSelectedRequest(null)
      } catch (error) {
        console.error("Error submitting comment:", error)
        // Handle error (e.g., show an error message to the user)
      }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Expense Approval Dashboard</h1>
      <Table>
        <TableCaption>A list of pending expense reimbursement requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Expense Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Bill Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                {request.employeeName} ({request.employeeId})
              </TableCell>
              <TableCell>{request.expenseType}</TableCell>
              <TableCell>${request.amount.toFixed(2)}</TableCell>
              <TableCell>{format(new Date(request.billDate), "PP")}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleStatusChange(request.id, "Approved")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleStatusChange(request.id, "Rejected")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                        <Info className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Expense Request Details</DialogTitle>
                        <DialogDescription>View details and add comments for this expense request.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input id="name" value={selectedRequest?.employeeName} className="col-span-3" readOnly />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="expenseType" className="text-right">
                            Type
                          </Label>
                          <Input
                            id="expenseType"
                            value={selectedRequest?.expenseType}
                            className="col-span-3"
                            readOnly
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            value={selectedRequest?.amount.toFixed(2)}
                            className="col-span-3"
                            readOnly
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="comment" className="text-right">
                            Comment
                          </Label>
                          <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleCommentSubmit}>
                          <Send className="mr-2 h-4 w-4" />
                          Add Comment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

