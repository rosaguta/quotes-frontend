import { useEffect, useState } from "react";
import { Payment, Quote, columns, quoteColumns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 2,
      status: "success",
      email: "m@example.com",
    }
    // ...
  ];
}


interface QuoteInterface{
    id: string
    text: string
    person: string
    context: string
    dateTimeCreated: Date
}
interface ApiResponse {
  data: Quote[]
  status: number
}

const getQuotes = async(): Promise<Quote[]> =>{
  const { data } = await axios.get<Quote[]>("https://quotesapi.divsphere.net/quotes")
  const quotes = data
  console.log(quotes)
  return quotes
}
export default function DemoPage() {
  // const [data, setData] = useState<Payment[]>([]);
  const [allQuotes, setAllQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async ()=>{
      const quotes = (await getQuotes())

      setAllQuotes((quotes))
      setLoading(false);
    }
    fetchData();

  }, []);
  if (loading) {
    return <div>Loading...</div>; // Add a loading state while the data is being fetched.
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={quoteColumns} data={allQuotes} />
    </div>
  );
}
