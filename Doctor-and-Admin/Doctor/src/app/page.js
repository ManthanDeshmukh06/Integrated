import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // always send user to login first
}
