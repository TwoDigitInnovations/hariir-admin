import { useRouter } from "next/router";
import { useState } from "react";
import SidePannel from "./SidePannel";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const router = useRouter();
  const [openTab, setOpenTab] = useState(false);

  const hideLayoutRoutes = [
    "/login",
    "/signup",
  ];

  const shouldHideLayout = hideLayoutRoutes.some((route) =>
    router.pathname.includes(route)
  );

  return (
    <div className="h-screen max-w-screen bg-white">
      <div className="md:h-[10vh] h-[8vh] w-full">
        <div className="max-w-screen flex relative">
          {!shouldHideLayout && (
            <SidePannel setOpenTab={setOpenTab} openTab={openTab} />
          )}

          <div
            className={
              !shouldHideLayout
                ? "w-full xl:pl-[300px] md:pl-[250px] sm:pl-[200px]"
                : "w-full"
            }
          >
            <main className="w-full h-screen relative overflow-hidden">
              {!shouldHideLayout && (
                <Navbar setOpenTab={setOpenTab} openTab={openTab} />
              )}
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
