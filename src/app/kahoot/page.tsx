import KahootClientWrapper from './KahootClientWrapper';

export default async function KahootServer() {
  const login = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/auth`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: "SuperUser", password: "xxrtNmbqrCLY8P27Ln2i" })
    });
    return await response.text();
  };

  const token = await login();
  const fetchQuote = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/random?asObject=true&withContext=true`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
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

  const sections = quotes.map((quote, i) => ({
    title: 'Quote',
    ...quote,
    color: "#9803fc",
    initColor: "#9803fc"
  }));

  const personIndexToRemove = Math.floor(Math.random() * sections.length);
  sections[personIndexToRemove].person = null;

  return <KahootClientWrapper quotes={sections} />;
}
