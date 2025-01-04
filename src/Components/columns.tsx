"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Quote = {
  id: string
  text: number
  person: string
  context: string
  dateTimeCreated: any
}

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "text",
    header: "Text",
  },
  {
    accessorKey: "person",
    header: "Person",
  },
  {
    accessorKey: "dateTimeCreated",
    header: "When",
    cell:({row}) =>{
      const convertedDate = new Date(row.getValue("dateTimeCreated"))
      const pad = (num) => String(num).padStart(2, '0');

      const date = pad(convertedDate.getDate()) + "-" + pad(convertedDate.getMonth() + 1) + "-" + convertedDate.getFullYear();
      const time = pad(convertedDate.getUTCHours()) + ":" + pad(convertedDate.getUTCMinutes()) + ":" + pad(convertedDate.getUTCSeconds());
      
      return date + " at " + time;
    }
  },
  {
    accessorKey: "context",
    header: "Context",
  },
]
