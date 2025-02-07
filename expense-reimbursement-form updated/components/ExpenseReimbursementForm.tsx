"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { sendEmail, sendApproverEmail, addToGoogleSheets } from "../utils/formSubmission"
import { useAuth } from "../contexts/AuthContext"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import type { ExpenseFormData } from "../types/expenseForm"
import { isDateWithin30Days } from "../utils/dateValidation"

type ExpenseType = {
  value: string
  label: string
}

const expenseTypes: ExpenseType[] = [
  { value: "travel", label: "Travel" },
  { value: "mobile", label: "Mobile" },
  { value: "food_drinks", label: "Food/Drinks" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "fuel", label: "Fuel" },
  { value: "others", label: "Others" },
]

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  employeeId: z.string().min(1, { message: "Employee ID is required." }),
  expenseType: z.string().min(1, { message: "Expense type is required." }),
  billDate: z.string().refine((date) => isDateWithin30Days(date), {
    message: "Bill date must be within the last 30 days.",
  }),
  amount: z.number().positive({ message: "Amount must be a positive number." }),
  attachments: z.any(),
  approverEmail: z.string().email({ message: "Invalid email address." }),
})

export function ExpenseReimbursementForm() {
  const { user } = useAuth()
  const [showHiddenSection, setShowHiddenSection] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      employeeId: user?.id || "",
    },
  })

  const billDate = watch("billDate")

  useEffect(() => {
    if (billDate) {
      setShowHiddenSection(!isDateWithin30Days(billDate))
    }
  }, [billDate])

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await sendEmail(data)
      await sendApproverEmail(data)
      await addToGoogleSheets(data)
      setIsSubmitted(true)
    } catch (err) {
      setError("An error occurred while submitting the form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center space-x-40">
          <div>
            <CardTitle className="text-left">Expense Reimbursement Form</CardTitle>
            <CardDescription className="text-left">Submit your expense reimbursement request</CardDescription>
          </div>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dsa-SKF2aVdAW6zP55WP33XLQ4kjRZ43mL.png"
            alt="Intellicar Logo"
            width={120}
            height={48}
            priority
          />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} readOnly />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input id="employeeId" {...register("employeeId")} readOnly />
              {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenseType">Expense Type</Label>
            <Select onValueChange={(value) => setValue("expenseType", value as string)}>
              <SelectTrigger>
                <SelectValue placeholder="Select expense type" />
              </SelectTrigger>
              <SelectContent>
                {expenseTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expenseType && <p className="text-sm text-red-500">{errors.expenseType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billDate">Bill Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!billDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {billDate ? format(new Date(billDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={billDate ? new Date(billDate) : undefined}
                  onSelect={(date) => setValue("billDate", date ? format(date, "yyyy-MM-dd") : "")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.billDate && <p className="text-sm text-red-500">{errors.billDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <Input id="attachments" type="file" multiple {...register("attachments")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approverEmail">Approver Email</Label>
            <Input
              id="approverEmail"
              type="email"
              {...register("approverEmail", {
                required: "Approver email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.approverEmail && <p className="text-sm text-red-500">{errors.approverEmail.message}</p>}
          </div>

          {showHiddenSection && (
            <div className="bg-yellow-100 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p>Note: Your bill is older than 30 days. </p>
              <p>
                The bill must be dated within the last 30 days. Expenses older than 30 days will not be reimbursed.
                Please contact your manager or the finance team.
              </p>
              <p></p>
              <p>Manager: John Doe (john.doe@example.com)</p>
              <p>Finance Team: finance@example.com</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Expense"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        {(isSubmitted || error) && (
          <Alert
            className={`w-full ${isSubmitted ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}`}
          >
            <AlertTitle>{isSubmitted ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {isSubmitted ? "Your expense reimbursement request has been submitted successfully." : error}
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  )
}

