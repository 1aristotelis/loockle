import dynamic from "next/dynamic";

const Notifications = dynamic(() => import("@/components/Notifications"), {
  ssr: false
})

export default function Home() {
  return <Notifications/>
}
