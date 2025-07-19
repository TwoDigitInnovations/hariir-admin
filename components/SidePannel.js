import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect ,useState } from "react";
import { MdDashboard } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { userContext } from "@/pages/_app";
import { FaBuildingColumns } from "react-icons/fa6";
import { FaCircleQuestion } from "react-icons/fa6";
import { FaUserGraduate } from "react-icons/fa6";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";

const SidePannel = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    {
      href: "/",
      title: "Dashboard",
      img: <MdDashboard className="text-3xl" />,
      access: ["Admin"],
    },
    {
      href: "/Company",
      title: "Company",
      img: <FaBuildingColumns className="text-3xl" />,
      access: ["Admin"],
    },
    {
      href: "/Professionals",
      title: "Professional",
      img: <FaUserGraduate className="text-3xl" />,
      access: ["Admin"],
    },
  ];

  const imageOnError = (event) => {
    // event.currentTarget.src = "/userprofile.png";
  };

  return (
    <>
      {/* Desktop Side Panel */}
      <div className="xl:w-[300px] fixed top-0 left-0 z-20 md:w-[280px] sm:w-[200px] hidden sm:grid grid-rows-5 overflow-hidden">
        <div>
          <div className="bg-blue-500 py-5 overflow-y-scroll h-screen scrollbar-hide">
            <div
              className="bg-white py-5 row-span-1 flex items-center justify-center cursor-pointer mx-5 rounded-lg"
              onClick={() => router.push("/")}
            >
              <p className="text-blue-500 text-2xl font-bold">HARRIER</p>
            </div>

            <div className="flex flex-col justify-between row-span-4 w-full">
              <ul className="w-full flex flex-col text-left mt-5">
                {menuItems.map((item, i) =>
                  item?.access?.includes(user?.role) ? (
                    <Link
                      href={item.href}
                      key={i}
                      className={`flex items-center mx-5 px-8 cursor-pointer group hover:bg-white hover:text-blue-500 m-1 rounded-lg ${
                        router.pathname === item.href
                          ? "bg-white text-blue-500 rounded-lg"
                          : "text-white hover:bg-blue-400"
                      }`}
                    >
                      <div className="py-3 font-semibold flex items-center gap-4">
                        {item?.title}
                      </div>
                    </Link>
                  ) : null
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Side Panel */}
      <div
        className={`w-full absolute top-0 left-0 z-40 sm:hidden flex flex-col h-screen max-h-screen overflow-hidden bg-blue-500 ${
          openTab ? "scale-x-100" : "scale-x-0"
        } transition-all duration-300 origin-left`}
      >
        <div className="row-span-1 w-full text-black relative">
          <ImCross
            className="absolute text-white top-8 right-4 z-40 text-xl"
            onClick={() => setOpenTab(!openTab)}
          />
          <div className="flex flex-col gap-3 w-full p-3">
            <div className="p-3 bg-white rounded-lg flex justify-center w-[80%]">
              <p className="text-blue-500 text-2xl font-bold">HARRIER</p>
            </div>
            <div className="flex ms-2 justify-between">
              <div className="flex">
                <div className="w-12 h-12 rounded-full overflow-hidden border-white border">
                  <img
                    src={"/office-man.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={imageOnError}
                  />
                </div>
                <p className="mt-3 ms-3 text-lg text-white font-bold">
                  {user?.role}
                </p>
              </div>
              <div>
                {token ? (
                  <div
                    className="flex gap-2 mt-3 items-center cursor-pointer"
                    onClick={() => {
                      Swal.fire({
                        text: "Are you sure you want to logout?",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        confirmButtonColor: "#3B82F6", // Blue-500
                        customClass: {
                          confirmButton: "px-12 rounded-xl",
                          title: "text-[20px] text-black",
                          actions: "swal2-actions-no-hover",
                          popup: "rounded-[15px] shadow-custom-blue",
                        },
                        buttonsStyling: true,
                        reverseButtons: true,
                        width: "320px",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          logOut();
                        }
                      });
                    }}
                  >
                    <div className="text-white font-bold">Sign Out</div>
                    <div className="rounded-full">
                      <PiSignOutFill className="text-3xl text-white" />
                    </div>
                  </div>
                ) : (
                  <Link href="/login">
                    <div className="p-3 mt-3 items-center font-bold text-white">
                      LogIn
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start row-span-2 h-full w-full">
          <ul className="w-full h-full flex flex-col text-left justify-start items-center border-t-2 border-gray-300">
            {menuItems.map((item, i) =>
              item?.access?.includes(user?.role) ? (
                <li
                  key={i}
                  className={`w-full flex items-center text-white cursor-pointer group ${
                    router.pathname === item.href
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-400 hover:text-white"
                  } border-b-2 border-gray-300`}
                >
                  <div
                    className="py-2 pl-6 font-semibold flex items-center gap-4"
                    onClick={() => setOpenTab(!openTab)}
                  >
                    <div className="w-6">{item?.img}</div>
                    <Link href={item.href}>{item?.title}</Link>
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidePannel;
