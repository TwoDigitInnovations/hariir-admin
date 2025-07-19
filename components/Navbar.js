import { userContext } from "@/pages/_app";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";

const Navbar = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleLogout = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#3B82F6", // Changed to blue-500
      customClass: {
        confirmButton: 'px-12 rounded-xl',
        title: 'text-[20px] text-black',
        actions: 'swal2-actions-no-hover',
        popup: 'rounded-[15px] shadow-lg'
      },
      buttonsStyling: true,
      reverseButtons: true,
      width: '320px'
    }).then(function (result) {
      if (result.isConfirmed) {
        logOut();
      }
    });
  };

  const imageOnError = (event) => {
    // event.currentTarget.src = "/userprofile.png";
  };

  return (
    <nav className="w-full bg-white z-20 sticky top-0 max-w-screen shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <p className="text-blue-500 md:text-2xl text-xl font-bold">HARRIER</p>
          </div>

          {/* Desktop Navigation */}
          {user?._id && (
            <div className="hidden md:flex items-center justify-end space-x-4 flex-1">
              <div className="relative">
                <button 
                  className="flex items-center space-x-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                    <img
                      src={user?.profile || "/office-man.png"} 
                      alt="User"
                      className="w-full h-full object-cover"
                      onError={imageOnError}
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-gray-800 font-medium text-sm">{user?.username}</p>
                    <p className="text-gray-500 text-xs">{user?.role}</p>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <PiSignOutFill size={16} className="text-blue-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2 transition-colors duration-200"
              >
                <span>Sign Out</span>
                <PiSignOutFill size={16} />
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setOpenTab(!openTab)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <GiHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </div>

    
      {openTab && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4 shadow-lg">
          {user?._id ? (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                  <img
                    src={"/userprofile.png"} 
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={imageOnError}
                  />
                </div>
                <div className="flex flex-col">
                  {/* <p className="text-gray-800 font-medium">{user?.name}</p> */}
                  <p className="text-gray-500 text-xs">{user?.role}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <span>Sign Out</span>
                <PiSignOutFill size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <div className="block w-full text-center py-2 px-4 text-blue-500 hover:bg-blue-50 rounded-lg">
                Log In
              </div>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;