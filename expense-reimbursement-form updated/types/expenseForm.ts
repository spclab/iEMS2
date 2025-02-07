export type ExpenseType = "Travel" | "Mobile" | "Food/Drinks" | "Office Supplies" | "Others"

export type Approver = {
  id: string
  name: string
}

export interface ExpenseFormData {
  name: string
  employeeId: string
  expenseType: ExpenseType
  billDate: string
  amount: number
  attachments: FileList | null
  approverId: string
}

