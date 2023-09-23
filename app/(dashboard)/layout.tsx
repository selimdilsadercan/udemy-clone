import Navbar from "./zomponents/navbar";
import Sidebar from "./zomponents/sidebar";

interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>

      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      <main className="md:pl-56 h-full pt-[80px]">{children}</main>
    </div>
  );
}

export default Layout;
