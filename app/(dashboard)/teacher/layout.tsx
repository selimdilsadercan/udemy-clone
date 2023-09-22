import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  //teacher control
  const { userId } = auth();
  if (!isTeacher(userId)) redirect("/");

  return <>{children}</>;
};

export default Layout;
