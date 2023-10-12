import SearchTxid from "@/components/SearchTxid";


export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <SearchTxid/>
      </div>
    </div>
  )
}
