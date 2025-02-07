import type { ExpenseFormData } from "../types/expenseForm"
import { google } from "googleapis"

export async function sendEmail(data: ExpenseFormData) {
  // In a real application, you would use a server-side API to send emails
  // This is a placeholder function to simulate email sending
  console.log(`Sending email to dhruva@intellicar.in with form data:`, data)
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return true
}

export async function sendApproverEmail(data: ExpenseFormData) {
  // In a real application, you would use a server-side API to send emails
  // This is a placeholder function to simulate email sending to the approver
  console.log(`Sending approval request email to ${data.approverEmail} with form data:`, data)
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return true
}

export async function addToGoogleSheets(data: ExpenseFormData, status: "Approved" | "Rejected") {
  // In a real application, you would use the Google Sheets API to add data
  // This is a placeholder function to simulate adding data to Google Sheets
  console.log(`Adding form data to Google Sheets with status ${status}:`, data)

  // Simulate Google Sheets API call
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })

  const values = [
    [
      data.name,
      data.employeeId,
      data.expenseType,
      data.billDate,
      data.amount,
      data.approverEmail,
      status,
      new Date().toISOString(), // Timestamp
    ],
  ]

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1", // Update this to match your sheet name
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    console.log(`${response.data.updates?.updatedCells} cells appended.`)
    return true
  } catch (err) {
    console.error("The API returned an error: " + err)
    throw err
  }
}

export async function handleApproverDecision(expenseId: string, status: "Approved" | "Rejected", comment: string) {
  // In a real application, you would fetch the expense data from a database
  // For this example, we'll use mock data
  const mockExpenseData: ExpenseFormData = {
    name: "John Doe",
    employeeId: "EMP001",
    expenseType: "Travel",
    billDate: "2023-05-15",
    amount: 150.0,
    approverEmail: "approver@example.com",
    attachments: null,
  }

  // Update the status in your database (mock operation)
  console.log(`Updating expense ${expenseId} status to ${status}`)

  // Add the expense data with the status to Google Sheets
  await addToGoogleSheets(mockExpenseData, status)

  // Send a notification email to the employee (mock operation)
  console.log(`Sending notification email to ${mockExpenseData.name} about ${status} expense`)

  return true
}

