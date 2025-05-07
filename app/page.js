import { redirect } from "next/navigation";

export default function Home() {
  redirect("/agent-search");
  return null;
}