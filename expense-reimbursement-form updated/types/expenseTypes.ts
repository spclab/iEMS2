export type ExpenseStatus = "Pending" | "Approved" | "Rejected"

export interface ExpenseRequest {
  id: string
  employeeName: string
  employeeId: string
  expenseType: string
  amount: number
  billDate: string
  status: ExpenseStatus
}

