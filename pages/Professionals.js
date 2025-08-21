import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { Users, CheckCircle2, XCircle, Search, Filter, AwardIcon ,Eye} from "lucide-react";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  User,
  Award,
  Globe,
} from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import isAuth from "@/components/isAuth";
import { userContext } from "./_app";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Professionals = (props) => {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [professionals, setProfessionals] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      getAllProfessional();
    }
  }, [token]);

  const getAllProfessional = () => {
    props.loader(true);

    Api(
      "get",
      "auth/getAllProfileForAdmin?role=professional",
      null,
      router
    ).then(
      (res) => {
        props.loader(false);
        setLoading(false);
        setProfessionals(
          (res.data || []).filter((item) => item.role === "professional")
        );
      },
      (err) => {
        props.loader(false);
        toast.error(err?.data?.message || err?.message || "An error occurred");
      }
    );
  };

  const handleStatusChange = async (id, status) => {
    const result = await Swal.fire({
      text: `Are you sure you want to ${status} this Account?".`,
      icon: status === "Approved" ? "success" : "warning",
      showCancelButton: true,
      width: "380px",
      confirmButtonColor: status === "Approved" ? "#3085d6" : "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: `Yes, ${status} it!`,
    });

    if (!result.isConfirmed) return;

    try {
      props.loader(true);
      const res = await Api(
        "put",
        `auth/updateStatus/${id}`,
        { status },
        router
      );
      props.toaster({
        type: "success",
        message: `Status ${status === "Approved" ? "Approved" : "Rejected"
          } successfully`,
      });
      getAllProfessional();
    } catch (error) {
      props.toaster({
        type: "error",
        message: error.message || "Failed to update status",
      });
    } finally {
      props.loader(false);
    }
  };

  const filteredProfessionals = professionals.filter(
    (professional) =>
      professional.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.phone.includes(searchTerm)
  );

  const handleVerifyRequest = (expid, status) => {
    Swal.fire({
      text: `Are you sure? You are about to ${status} verification for this experience.`,
      icon: status === "Approved" ? "success" : "warning",
      confirmButtonColor: status === "Approved" ? "#3085d6" : "#d33",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "#aaa",
      confirmButtonText: `Yes, ${status} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          userId: profileData._id,
          experienceId: expid,
          status,
        };

        props.loader(true);
        Api("post", "auth/ExperienceVerification", data, router).then(
          (res) => {
            props.loader(false);
            if (res.status) {
              toast.success(res.message);
              setOpen(false);
              getAllProfessional();
            } else {
              toast.error(res.message);
            }
          },
          (err) => {
            props.loader(false);
            console.error("Error:", err);
            toast.error(err?.message || "An error occurred");
          }
        );
      }
    });
  };
  const handleVerifyRequestforedu = (expid, status) => {
    Swal.fire({
      text: `Are you sure? You are about to ${status} verification for this experience.`,
      icon: status === "Approved" ? "success" : "warning",
      confirmButtonColor: status === "Approved" ? "#3085d6" : "#d33",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "#aaa",
      confirmButtonText: `Yes, ${status} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          userId: profileData._id,
          educationId: expid,
          status,
        };

        props.loader(true);
        Api("post", "auth/EducationVerification", data, router).then(
          (res) => {
            props.loader(false);
            if (res.status) {
              toast.success(res.message);
              setOpen(false);
              getAllProfessional();
            } else {
              toast.error(res.message);
            }
          },
          (err) => {
            props.loader(false);
            console.error("Error:", err);
            toast.error(err?.message || "An error occurred");
          }
        );
      }
    });
  };
  const handleVerifyRequestforCer = (cerid, status) => {
    Swal.fire({
      text: `Are you sure? You are about to ${status} verification for this experience.`,
      icon: status === "Approved" ? "success" : "warning",
      confirmButtonColor: status === "Approved" ? "#3085d6" : "#d33",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "#aaa",
      confirmButtonText: `Yes, ${status} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          userId: profileData._id,
          certificationId: cerid,
          status,
        };

        props.loader(true);
        Api("post", "auth/CertificationVerification", data, router).then(
          (res) => {
            props.loader(false);
            if (res.status) {
              toast.success(res.message);
              setOpen(false);
              getAllProfessional();
            } else {
              toast.error(res.message);
            }
          },
          (err) => {
            props.loader(false);
            console.error("Error:", err);
            toast.error(err?.message || "An error occurred");
          }
        );
      }
    });
  };
    const viewCertificate = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };
  return (
    <section className="w-full h-full bg-gray-50 md:p-6 p-4">
      {!open ? (
        <div className="h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-28">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <span className="inline-block w-2 h-8 bg-blue-500 mr-3 rounded"></span>
                Professional Management
              </h1>
              <p className="text-gray-500 mt-1">
                Manage all registered professionals
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  className="block text-gray-700 w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  placeholder="Search by name, email or phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                <Filter size={18} className="text-gray-500" />
                <span className="text-gray-700">Filter</span>
              </button>
            </div>
          </div>

          {/* Professionals Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Professional
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role/Specialization
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-700"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : filteredProfessionals.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No professionals found
                      </td>
                    </tr>
                  ) : (
                    filteredProfessionals.map((professional, key) => (
                      <tr key={professional._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0  rounded-full bg-blue-100 flex items-center justify-center">
                              <img
                                className="h-14 w-14 rounded-full"
                                src={professional?.profileImage}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {professional.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {professional.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">
                            {professional.professionalTitle || "N/A"}
                          </div>
                          {/* <div className="text-sm text-gray-500">{professional.specialization || 'N/A'}</div> */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {professional.phone || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {professional.location || "N/A"}
                          </div>
                        </td>
                        <td className=" whitespace-nowrap">
                          <span
                            className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-xl ${professional.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : professional.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {professional.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right">
                          <div className="flex justify-center items-center gap-3">
                            {professional.status !== "Approved" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    professional._id,
                                    "Approved"
                                  )
                                }
                                className="text-green-600 cursor-pointer hover:text-white hover:bg-green-600 p-1 rounded-full transition"
                                title="Approve"
                              >
                                <CheckCircle2 size={28} />
                              </button>
                            )}
                            {professional.status !== "Rejected" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    professional._id,
                                    "Rejected"
                                  )
                                }
                                className="text-red-600 cursor-pointer hover:text-white hover:bg-red-600 p-1 rounded-full transition"
                                title="Reject"
                              >
                                <XCircle size={28} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className=" whitespace-nowrap">
                          <span
                            className="px-4 py-2 inline-flex bg-blue-400 cursor-pointer text-white text-xs leading-5 font-semibold rounded-xl "
                            onClick={() => {
                              setProfileData(professional);
                              console.log(`data of ${key}`, professional);
                              setOpen(true);
                            }}
                          >
                            See Details
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-y-scroll h-full scrollbar-hide overflow-scroll pb-28 max-w-5xl mx-auto bg-white rounded-xl ">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 text-white">
            <p
              className="flex justify-end text-2xl text-white"
              onClick={() => setOpen(false)}
            >
              <RxCross2 className="" />
            </p>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={profileData.profileImage || "not found"}
                  alt="Profile image Not Found"
                  className="w-full h-full text-black object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{profileData.fullName}</h1>
                <p className="text-xl text-blue-100 mt-1">
                  {profileData.professionalTitle}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                  {profileData.location && (
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-1" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.email && (
                    <div className="flex items-center">
                      <Mail size={18} className="mr-1" />
                      <span>{profileData.email || "Email not Found"}</span>
                    </div>
                  )}
                  {profileData.phone && (
                    <div className="flex items-center text-white">
                      <Phone size={18} className="mr-1" />
                      <span>{profileData.phone || "Phone No. not found"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:p-6 p-3">
            {/* About Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <User size={20} className="mr-2" />
                About
              </h2>
              {profileData.bio ? (
                <section className="mb-8">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: profileData.bio }}
                  />
                </section>
              ) : (
                <p className="text-black text-center">
                  {" "}
                  Not updated About us yet
                </p>
              )}
            </div>

            <div>
              {" "}
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <Award size={20} className="mr-2" />
                Skills
              </h2>
              {profileData?.skills?.length > 0 ? (
                <section className="mb-8">
                  <div className="flex flex-wrap gap-3">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-800 rounded-full font-medium shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-black text-center"> Not Found Any skills</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <Briefcase size={20} className="mr-2" />
                Experience
              </h2>
              {profileData?.experience?.length > 0 ? (
                <section className="mb-8">
                  <div className="space-y-6">
                    {profileData.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="relative md:pl-8 pl-3 pb-6 border-l-2 border-blue-200"
                      >
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                        <div className="bg-gray-50 md:p-4 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex md:flex-row flex-col gap-1 mb-1 justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {exp.jobTitle}
                            </h3>
                            <div className="flex gap-4">
                              <button
                                className={`text-[16px] font-semibold ${exp.status === "Approved"
                                  ? "text-green-600"
                                  : exp.status === "Rejected"
                                    ? "text-red-500"
                                    : exp.status === "Requested"
                                      ? "text-blue-600"
                                      : "text-yellow-500"
                                  }`}
                              >
                                {exp.status === "Requested"
                                  ? "Verification Requested"
                                  : exp.status}
                              </button>
                              {(exp.status === "Requested" ||
                                exp.status === "Rejected") && (
                                  <button
                                    onClick={() =>
                                      handleVerifyRequest(exp._id, "Approved")
                                    }
                                    className="mt-1 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer"
                                  >
                                    Verify
                                  </button>
                                )}

                              {(exp.status === "Requested" ||
                                exp.status === "Approved") && (
                                  <button
                                    onClick={() =>
                                      handleVerifyRequest(exp._id, "Rejected")
                                    }
                                    className="mt-1 px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-700 text-sm cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                )}
                            </div>
                          </div>
                          <p className="text-blue-600 font-medium">
                            {exp.company}
                          </p>
                          <p className="text-gray-500 text-sm mb-2">
                            {exp.location} • {exp.duration}
                          </p>
                          <p className="text-gray-700">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-black text-center">
                  {" "}
                  Not Found Any experience
                </p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <GraduationCap size={20} className="mr-2" />
                Education
              </h2>
              {profileData?.education?.length > 0 ? (
                <section className="mb-8">
                  <div className="grid md:grid-cols-1 gap-4">
                    {profileData.education.map((edu, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex md:flex-row flex-col  mb-1 justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {edu.degree}
                          </h3>
                          <div className="flex gap-4">
                            <button
                              className={`text-[16px] font-semibold ${edu.status === "Approved"
                                ? "text-green-600"
                                : edu.status === "Rejected"
                                  ? "text-red-500"
                                  : edu.status === "Requested"
                                    ? "text-blue-600"
                                    : "text-yellow-500"
                                }`}
                            >
                              {edu.status === "Requested"
                                ? "Verification Requested"
                                : edu.status}
                            </button>
                            {(edu.status === "Requested" ||
                              edu.status === "Rejected") && (
                                <button
                                  onClick={() =>
                                    handleVerifyRequestforedu(edu._id, "Approved")
                                  }
                                  className="mt-1 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer"
                                >
                                  Verify
                                </button>
                              )}

                            {(edu.status === "Requested" ||
                              edu.status === "Approved") && (
                                <button
                                  onClick={() =>
                                    handleVerifyRequestforedu(edu._id, "Rejected")
                                  }
                                  className="mt-1 px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-700 text-sm cursor-pointer"
                                >
                                  Reject
                                </button>
                              )}
                          </div>
                        </div>
                        <p className="text-blue-600 font-medium">
                          {edu.institution}
                        </p>
                        <p className="text-gray-500 text-sm">{edu.year}</p>
                        {edu.description && (
                          <p className="text-gray-600 mt-2 text-sm">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-black text-center">
                  {" "}
                  Not Found Any Education
                </p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <AwardIcon size={20} className="mr-2" />
                Certifications
              </h2>
              {profileData?.certifications?.length > 0 ? (
                <section className="mb-8">
                  <div className="grid md:grid-cols-1 gap-4">
                    {profileData.certifications.map((cer, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex md:flex-row flex-col  mb-1 justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {cer.certificateName}
                          </h3>
                          <div className="flex gap-4">
                            <button
                              className={`text-[16px] font-semibold ${cer.status === "Approved"
                                ? "text-green-600"
                                : cer.status === "Rejected"
                                  ? "text-red-500"
                                  : cer.status === "Requested"
                                    ? "text-blue-600"
                                    : "text-yellow-500"
                                }`}
                            >
                              {cer.status === "Requested"
                                ? "Verification Requested"
                                : cer.status}
                            </button>
                            {(cer.status === "Requested" ||
                              cer.status === "Rejected") && (
                                <button
                                  onClick={() =>
                                    handleVerifyRequestforCer(cer._id, "Approved")
                                  }
                                  className="mt-1 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer"
                                >
                                  Verify
                                </button>
                              )}

                            {(cer.status === "Requested" ||
                              cer.status === "Approved") && (
                                <button
                                  onClick={() =>
                                    handleVerifyRequestforCer(cer._id, "Rejected")
                                  }
                                  className="mt-1 px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-700 text-sm cursor-pointer"
                                >
                                  Reject
                                </button>
                              )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-blue-600 text-[16px] font-medium">
                            {cer.issuerName || "N/A"}
                          </p>
                          <div className="flex gap-2 items-center">
                            {cer.attachmentUrl && (
                              <button
                                onClick={() => viewCertificate(cer.attachmentUrl)}
                                className="text-blue-600 flex items-center gap-2 hover:text-blue-800 p-1"
                                title="View Certificate"
                              >
                                Document <Eye size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-500 text-[14px]">
                          Issue Date: {cer.issueDate || "N/A"}
                        </p>
                        {cer.certificateNumber && (
                          <p className="text-gray-500 text-[14px]">
                            Certificate No: {cer.certificateNumber}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-black text-center">
                  {" "}
                  Not Found Any Certification
                </p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <Globe size={20} className="mr-2" />
                Languages
              </h2>
              {profileData?.languages?.length > 0 ? (
                <section className="mb-8">
                  <div className="flex flex-wrap gap-3">
                    {profileData.languages.map((lang, index) => (
                      <div
                        key={index}
                        className="bg-white border border-blue-200 rounded-full px-4 py-2 shadow-sm"
                      >
                        <span className="font-medium text-blue-700">
                          {lang.language}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          ({lang.level})
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-black text-center">
                  {" "}
                  Not Found Any language
                </p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center">
                <Users size={20} className="mr-2" />
                References
              </h2>
              {profileData?.referees?.length > 0 ? (
                <section>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profileData.referees.map((ref, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          {ref.fullName}
                        </h3>
                        <p className="text-blue-600 font-medium">{ref.title}</p>
                        <p className="text-gray-600">{ref.organization}</p>
                        <div className="mt-3 space-y-1">
                          {ref.email && (
                            <p className="flex items-center text-gray-600 text-sm">
                              <Mail size={16} className="mr-2" />
                              {ref.email}
                            </p>
                          )}
                          {ref.contact && (
                            <p className="flex items-center text-gray-600 text-sm">
                              <Phone size={16} className="mr-2" />
                              {ref.contact}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-black text-center">
                  {" "}
                  Not Found Any referees
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default isAuth(Professionals);
