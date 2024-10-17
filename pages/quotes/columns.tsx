"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Id"
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]

export type Quote = {
    id: string
    text: string
    person: string
    context: string
    dateTimeCreated: Date
}
export const quoteColumns: ColumnDef<Quote>[] = [
    {
        accessorKey: "text",
        header: "Text"        
    },
    {
        accessorKey: "person",
        header: "person"
    },
    {
        accessorKey: "dateTimeCreated",
        header: "when?"
    },
    {
        accessorKey: "context",
        header: "Context"
    }

]