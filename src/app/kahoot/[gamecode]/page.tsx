export default async function Page({
  params,
}: {
  params: Promise<{ gamecode: string }>
}) {
  const { gamecode } = await params
  return (
    <div>
      My Post: {gamecode}
    </div>)
}