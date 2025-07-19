import { MdEmail, MdPassword } from "react-icons/md";
import { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import Swal from "sweetalert2";

export default function Login(props) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    username: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);

  const submit = async () => {
    if (userDetail.username && userDetail.password) {
      const data = {
        email: userDetail.username.toLowerCase(),
        password: userDetail.password,
      };
      props.loader(true);
      Api("post", "auth/login", data, router).then(
        (res) => {
          props.loader(false);
          if (res?.status) {
            if (res.data?.user?.role === "Admin") {
              localStorage.setItem("userDetail", JSON.stringify(res.data.user));
              setUser(res.data.user);
              localStorage.setItem("token", res.data.token);
              props.toaster({ type: "success", message: "Login Successful" });
              router.push("/");
            } else {
              props.toaster({ type: "error", message: "You are not an Admin" });
            }
          }
        },
        (err) => {
          props.loader(false);
          props.toaster({ type: "error", message: err?.message });
        }
      );
    } else {
      setSubmitted(true);
      props.toaster({ type: "error", message: "Missing credentials" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg mb-4">
            <span className="text-white text-2xl font-bold">H</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to Harrier
          </h1>
          <p className="text-gray-500 mt-2">Admin Dashboard Login</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-6 border border-gray-100">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="text-gray-400" />
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 text-black py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                placeholder="admin@example.com"
                value={userDetail.username}
                onChange={(e) =>
                  setUserDetail({ ...userDetail, username: e.target.value })
                }
              />
            </div>
            {submitted && !userDetail.username && (
              <p className="mt-1 text-sm text-red-600">Email is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdPassword className="text-gray-400" />
              </div>
              <input
                type="password"
                className="block w-full text-black pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                placeholder="*********"
                value={userDetail.password}
                onChange={(e) =>
                  setUserDetail({ ...userDetail, password: e.target.value })
                }
              />
            </div>
            {submitted && !userDetail.password && (
              <p className="mt-1 text-sm text-red-600">Password is required</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              onClick={submit}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Harrier Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
