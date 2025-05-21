import DarkCardClient from './DarkCardClient';

export default async function KahootServer() {
  let token = ""
  const login = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/auth`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "SuperUser", password: "xxrtNmbqrCLY8P27Ln2i" })
    })
    token = await response.text()
    console.log(token)
  }
  await login()
  const fetchQuote = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/random?asObject=true&withContext=true`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return await response.json();
  };

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleString("nl-NL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const quotes = await Promise.all(Array.from({ length: 3 }, fetchQuote));


  quotes.forEach((quote) => {
    quote.dateTimeCreated = formatDate(quote.dateTimeCreated);
  });
  const sections = [
    {
      title: 'Quotes',
      ...quotes[0],
      color: "#9803fc",
      initColor: "#9803fc"
    },
    {
      title: 'Quotes',
      ...quotes[1],
      color: "#9803fc",
      initColor: "#9803fc"
    },
    {
      title: 'Quotes',
      ...quotes[2],
      color: "#9803fc",
      initColor: "#9803fc"
    }
  ];
  console.log("quotes", quotes)
  console.log("sections", sections)
  const personIndexToRemove = Math.floor(Math.random()*3)
  console.log(personIndexToRemove)
  sections[personIndexToRemove].person = null
  return <DarkCardClient quotes={sections}/>;
}
