import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  MapPin,
  Mail,
  Phone,
  Building,
  Users,
  Target,
  Award,
  Eye,
  FolderGit2,
} from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import isAuth from "@/components/isAuth";
import { userContext } from "./_app";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Company = (props) => {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    getAllCompany();
  }, []);

  const getAllCompany = () => {
    props.loader(true);

    Api("get", "auth/getAllProfileForAdmin?role=company", null, router).then(
      (res) => {
        props.loader(false);
        setLoading(false);
        setCompanies(
          (res.data || []).filter((item) => item.role === "company")
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
        message: `Status ${
          status === "Approved" ? "Approved" : "Rejected"
        } successfully`,
      });
      getAllCompany();
    } catch (error) {
      props.toaster({
        type: "error",
        message: error.message || "Failed to update status",
      });
    } finally {
      props.loader(false);
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.phone.includes(searchTerm) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="w-full h-full bg-gray-50 md:p-6 p-4">
      {!open ? (
        <div className="h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-28">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <span className="inline-block w-2 h-8 bg-blue-500 mr-3 rounded"></span>
                Company Management
              </h1>
              <p className="text-gray-500 mt-1">
                Manage all registered companies
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
                  placeholder="Search by name, email, phone or industry"
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

          {/* Companies Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 md:w-full w-[400px] py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Company
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Industry
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
                      <td colSpan="5" className="px-6 py-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredCompanies.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No companies found
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((company, key) => (
                      <tr key={company._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0  rounded-full bg-blue-100 flex items-center justify-center">
                              <img
                                className="h-14 w-14 rounded-full"
                                src={company?.companyLogo}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {company.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {company.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">
                            {company.industrySector || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {company.website || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {company.phone || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {company.location || "N/A"}
                          </div>
                        </td>
                        <td className=" whitespace-nowrap">
                          <span
                            className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-xl ${
                              company.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : company.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {company.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right">
                          <div className="flex justify-center items-center gap-3">
                            {company.status !== "Approved" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(company._id, "Approved")
                                }
                                className="text-green-600 cursor-pointer hover:text-white hover:bg-green-600 p-1 rounded-full transition"
                                title="Approved"
                              >
                                <CheckCircle2 size={28} />
                              </button>
                            )}
                            {company.status !== "Rejected" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(company._id, "Rejected")
                                }
                                className="text-red-600 cursor-pointer hover:text-white hover:bg-red-600 p-1 rounded-full transition"
                                title="Rejected"
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
                              setCompanyData(company);
                              console.log(`data of ${key}`, company);
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
        <div className="max-w-5xl overflow-y-scroll h-full scrollbar-hide overflow-scroll pb-28 mx-auto bg-white rounded-xl shadow-md border border-gray-100">
          {/* Header Section */}

          <div className="relative">
            {/* Logo and Basic Info */}
            <div className="px-6 md:px-8 pb-6 bg-blue-400 ">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 ">
                <div className="w-32 h-32 rounded-lg border-4 border-white bg-white shadow-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={companyData.companyLogo || "/default-company.png"}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 ">
                  <p
                    className="flex justify-end text-2xl text-white pt-4"
                    onClick={() => setOpen(false)}
                  >
                    <RxCross2 className="" />
                  </p>
                  <h1 className="text-3xl font-bold text-white">
                    {companyData.companyName || "Company Name Not Available"}
                  </h1>
                  <p className="text-xl text-white mt-1">
                    {companyData.industrySector || "Industry Not Specified"}
                  </p>

                  <div className="flex  gap-x-16 gap-y-2 mt-3 text-white">
                    {companyData.location && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1.5" />
                        <span>{companyData.location}</span>
                      </div>
                    )}
                    {companyData.email && (
                      <div className="flex items-center">
                        <Mail size={16} className="mr-1.5" />
                        <span>{companyData.email}</span>
                      </div>
                    )}
                    {companyData.phone && (
                      <div className="flex items-center">
                        <Phone size={16} className="mr-1.5" />
                        <span>{companyData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-16 mt-4 text-white">
                    {companyData.foundedYear && (
                      <div>
                        <p className="text-sm text-white">Founded</p>
                        <p className="font-medium">{companyData.foundedYear}</p>
                      </div>
                    )}
                    {companyData.companySize && (
                      <div>
                        <p className="text-sm text-white">Company Size</p>
                        <p className="font-medium">
                          {companyData.companySize} employees
                        </p>
                      </div>
                    )}
                    {companyData.website && (
                      <div>
                        <p className="text-sm text-white">Website</p>
                        <a
                          href={
                            companyData.website.startsWith("http")
                              ? companyData.website
                              : `https://${companyData.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-white hover:underline"
                        >
                          {companyData.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 md:px-8 pb-8 space-y-8 mt-6">
            {/* About Section */}
            {companyData.aboutUs ? (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Building size={20} />
                  About Company
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {companyData.aboutUs}
                  </p>
                </div>
              </section>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">
                  Company description not available
                </p>
              </div>
            )}

            {/* Services Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase size={20} />
                Services
              </h2>

              {companyData?.services?.length > 0 ? (
                <section>
                  <div className="flex flex-wrap gap-3">
                    {companyData.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium shadow-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500">
                    No services information available
                  </p>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award size={20} />
                Fields of Specialization
              </h2>
              {companyData?.specializations?.length > 0 ? (
                <section>
                  <div className="grid md:grid-cols-2 gap-4">
                    {companyData.specializations.map((spec, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {spec.title}
                        </h3>
                        <p className="text-gray-600">{spec.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500">
                    No specialization information available
                  </p>
                </div>
              )}
            </div>
            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target size={20} />
                  Our Mission
                </h2>
                {companyData.missionStatement ? (
                  <section>
                    <div className="bg-blue-50 p-4 rounded-lg h-full">
                      <p className="text-gray-700">
                        {companyData.missionStatement}
                      </p>
                    </div>
                  </section>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500">
                      Mission statement not available
                    </p>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Eye size={20} />
                  Our Vision
                </h2>

                {companyData.visionStatement ? (
                  <section>
                    <div className="bg-green-50 p-4 rounded-lg h-full">
                      <p className="text-gray-700">
                        {companyData.visionStatement}
                      </p>
                    </div>
                  </section>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500">
                      Vision statement not available
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={20} />
                Meet Our Team
              </h2>

              {companyData?.teamMembers?.length > 0 ? (
                <section>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companyData.teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          {member.fullName}
                        </h3>
                        <p className="text-blue-600 text-sm font-medium mb-2">
                          {member.designation}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {member.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500">
                    No team members information available
                  </p>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FolderGit2 size={20} />
                Past Projects
              </h2>
              {companyData?.projects?.length > 0 ? (
                <section>
                  <div className="space-y-4">
                    {companyData.projects.map((project, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {project.title}
                          </h3>
                          <span className="text-gray-500 text-sm">
                            {project.yearCompleted}
                          </span>
                        </div>
                        <p className="text-blue-600 text-sm font-medium my-1">
                          {project.client}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500">
                    No projects information available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default isAuth(Company);
