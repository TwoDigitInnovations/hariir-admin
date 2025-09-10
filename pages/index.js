import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { Api } from '@/services/service';
import { ArrowUpRight, ArrowDownRight, Users, Briefcase, FileText, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import isAuth from '@/components/isAuth';
import { userContext } from './_app';
import { toast } from 'react-toastify';


function Home(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [stats, setStats] = useState({
    professionals:"",
    companies:"",
    activeProfiles:"",
    pendingApprovals:""
  });
  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = () => {
    props.loader(true);

    Api("get", "auth/dashboardInfo", null, router).then(
      (res) => {
        props.loader(false);
        setStats({
          professionals: res.data?.totalProfessionals || 0,
          companies: res.data?.totalCompanies || 0,
          activeProfiles: res.data?.activeProfiles || 0,
          pendingApprovals: res.data?.pendingProfiles || 0,
        });
      },
      (err) => {
        props.loader(false);
        toast.error(err?.data?.message || err?.message || "An error occurred");
      }
    );
  };
  return (
    <section className="w-full h-full bg-gray-50 md:p-6 p-4">
      <div className="h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-28">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <span className="inline-block w-2 h-8 bg-blue-500 mr-3 rounded"></span>
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's your overview</p>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-2">
            <div className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md">
              Today
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-4 grid-cols-1 gap-5 mb-8">
          {/* Professionals Card */}
          <StatsCard
            title="Total Professionals"
            value={stats.professionals}
            icon={<Users className="text-blue-500" size={32} />}
            change={{
              value: "12.5%",
              type: "increase",
              text: "New registrations"
            }}
          />

          {/* Companies Card */}
          <StatsCard
            title="Registered Companies"
            value={stats.companies}
            icon={<Briefcase className="text-blue-500" size={32} />}
            change={{
              value: "3.2%",
              type: "increase",
              text: "This month"
            }}
          />

          {/* Active Profiles Card */}
          <StatsCard
            title="Active Profiles"
            value={stats.activeProfiles}
            icon={<CheckCircle className="text-blue-500" size={32} />}
            change={{
              value: "8.1%",
              type: "increase",
              text: "Active this week"
            }}
          />

          {/* Pending Approvals Card */}
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<Clock className="text-blue-500" size={32} />}
            change={{
              value: "5",
              type: "pending",
              text: "Require attention"
            }}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-lg text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-4">
            <div className="flex flex-col space-y-4">
              <ActivityItem
                type="new_professional"
                name="John Doe"
                time="2 hours ago"
                status="pending"
              />
              <ActivityItem
                type="company_update"
                name="Tech Corp Inc."
                time="5 hours ago"
                status="approved"
              />
              <ActivityItem
                type="profile_verification"
                name="Sarah Johnson"
                time="1 day ago"
                status="rejected"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, change }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border-b-4 border-blue-500">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col justify-start">
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-gray-800 text-2xl md:text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            {icon}
          </div>
        </div>

        {change && (
          <div className="mt-4 flex items-center">
            {change.type === "increase" ? (
              <ArrowUpRight size={18} className="text-green-500" />
            ) : change.type === "decrease" ? (
              <ArrowDownRight size={18} className="text-red-500" />
            ) : (
              <Clock size={18} className="text-yellow-500" />
            )}
            <p className="text-sm ml-1">
              <span className={
                change.type === "increase" ? "text-green-500 font-medium" :
                  change.type === "decrease" ? "text-red-500 font-medium" :
                    "text-yellow-500 font-medium"
              }>
                {change.value}
              </span>
              <span className="text-gray-500 ml-1">{change.text}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ type, name, time, status }) => {
  const getIcon = () => {
    switch (type) {
      case 'new_professional': return <Users size={18} />;
      case 'company_update': return <Briefcase size={18} />;
      case 'profile_verification': return <FileText size={18} />;
      default: return <MessageSquare size={18} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 rounded-full text-blue-500">
          {getIcon()}
        </div>
        <div>
          <p className="font-medium text-gray-800">
            {type === 'new_professional' ? 'New Professional:' :
              type === 'company_update' ? 'Company Update:' :
                'Profile Verification:'} {name}
          </p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
      <div className={`text-sm font-medium ${getStatusColor()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
};

export default isAuth(Home);