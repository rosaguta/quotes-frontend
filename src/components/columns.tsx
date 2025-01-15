"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";

export type Quote = {
  id: string;
  text: string;
  person: string;
  context: string;
  dateTimeCreated: any;
};

// const token = Cookies.get("token");

// console.log(token);

// Table columns
export const columns = (
  handleEditQuote: (id: number) => void,
  handleDeleteQuote: (id: string) => void
): ColumnDef<Quote>[] => [
    {
      accessorKey: "text",
      header: () => <p className="md:text-lg">Text</p>,
      cell: ({ row }) => {
        const textParts = row.getValue<string>("text").split("\n");
        return (
          <p>
            {textParts.map((part, index) => (
              <React.Fragment key={index}>
                <p className="md:text-lg">{part}</p>
                <br />
              </React.Fragment>
            ))}
          </p>
        );
      },
    },
    {
      accessorKey: "person",
      header: () =><p className="md:text-lg">Person</p> ,
      cell:({row})=>{
        return <p className="md:text-lg">{row.getValue<string>("person")}</p>
      }
    },
    {
      accessorKey: "dateTimeCreated",
      header: ()=><p className="md:text-lg">When</p> ,
      cell: ({ row }) => {
        const convertedDate = new Date(row.getValue("dateTimeCreated"));
        const pad = (num: number) => String(num).padStart(2, "0");

        const date =
          pad(convertedDate.getDate()) +
          "-" +
          pad(convertedDate.getMonth() + 1) +
          "-" +
          convertedDate.getFullYear();
        const time =
          pad(convertedDate.getUTCHours()) +
          ":" +
          pad(convertedDate.getUTCMinutes()) +
          ":" +
          pad(convertedDate.getUTCSeconds());

        return <p className="md:text-lg">{date + " at " + time}</p>;
      },
    },
    ...(Cookies.get('token')
      ? [
        {
          accessorKey: "context",
          header: () =><p className="md:text-lg">Context</p> ,
          cell:({row})=>{
            return <p className="md:text-lg">{row.getValue("context")}</p>
          }
        },
        {
          id: "actions",
          cell: ({ row }) => {
            const quote = row.original;

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEditQuote(quote.id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteQuote(quote.id)}
                    className="text-red-500 focus:text-red-800"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ]
      : []),
  ];
