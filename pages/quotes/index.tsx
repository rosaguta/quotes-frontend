import { useEffect, useState } from "react";
import { Payment, Quote, columns } from "./columns";
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

const getQuotes = async(): Promise<ApiResponse> =>{
  const { data } = await axios.get<ApiResponse>("https://quotesapi.divsphere.net/quotes")
  return data
}
export default function DemoPage() {
  const [data, setData] = useState<Payment[]>([]);
  const [allQuotes, setAllQuotes] = useState<QuoteInterface[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      const quotes = await getQuotes()
      setAllQuotes(quotes.data)
      setData(result);
      setLoading(false);
    }
    fetchData();

  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a loading state while the data is being fetched.
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
