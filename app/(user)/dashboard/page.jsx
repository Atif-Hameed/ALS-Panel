"use client";
import { FaCalendarAlt } from "react-icons/fa"; // Font Awesome calendar icon
import StatCard from "./StatCard";
import Link from "next/link";
import RealState from "./RealState";
import ProfileCard from "./ProfileCard";
import TeamCard from "./TeamCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api";
import { useUserDetails } from "../../hooks/useUser";
import {
  getAllActiveReferal,
  getAllReferals,
} from "../../actions/agent.action";
import { getTeams } from "../../actions/team.action";
// import { useUserDetails } from '../../hooks/useUser';

const ChevronRightIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="w-4 h-4"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
);

const page = () => {
  const [counts, setCounts] = useState({
    contracts: 0,
    teams: 0,
    agents: 0,
    properties: 0,
  });
  const [fiveAgents, setFiveAgents] = useState([]);
  const [sixProperties, setSixProperties] = useState([]);
  const [teamsSummary, setTeamsSummary] = useState([]);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState();
  const [teamData, setTeamData] = useState();
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const { data: user } = useUserDetails(userId);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);
  console.log(userId, "hhhhhhhhhhhhhhh");

  useEffect(() => {
    if (!userId) return;
    const fetchCounts = async () => {
      try {
        const [
          contractRes,
          teamRes,
          agentRes,
          propertyRes,
          fiveAgentRes,
          sixPropertyRes,
          teamsSummaryRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/contracts/count-sign?userId=${userId}`),
          axios.get(`${API_BASE_URL}/team/count?userId=${userId}`),
          axios.get(`${API_BASE_URL}/agents/count?userId=${userId}`),
          axios.get(`${API_BASE_URL}/property/count?userId=${userId}`),
          axios.get(`${API_BASE_URL}/agents/five-agents?userId=${userId}`),
          axios.get(`${API_BASE_URL}/property/six-properties?userId=${userId}`),
          axios.get(`${API_BASE_URL}/team/summary?userId=${userId}`),
        ]);

        setCounts({
          contracts: contractRes.data.totalAccepted || 0,
          teams: teamRes.data.total || 0,
          agents: agentRes.data.total || 0,
          properties: propertyRes.data.total || 0,
        });
        setFiveAgents(fiveAgentRes.data.agents || []);
        setSixProperties(sixPropertyRes.data.data || []);
        setTeamsSummary(teamsSummaryRes.data || []);
      } catch (error) {
        console.error("Failed to fetch counts", error);
      }
    };

    fetchCounts();
  }, [userId]);

  console.log(sixProperties);

  const fetchReferalData = async () => {
    try {
      setLoading(true);
      //   const { data, error } = await getAllReferals(user?._id, page, limit);
      const { data, error } = await getAllActiveReferal(user?._id, page, limit);
      // console.log("response:", data, error);
      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }
      setData(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferalData();
  }, [user, page, limit]);

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/team/all-teams/${userId}`);
        setTeamData(res.data || []);
        // console.log("All Teams:", res.data);
      } catch (error) {
        console.error("Failed to fetch all teams", error);
      }
    };

    fetchAllTeams();
  }, [userId]);

  // console.log(data, "data");
  console.log('PROPERTIES : ', sixProperties);
  return (
    <div className="">
      <div className="py-4 px-4 flex  justify-between flex-col sm:flex-row">
        <div className=" sm:text-left">
          <div className="text-[16px] text-[#7D8592] font-[400]">
            Welcome back, {user?.firstName || user?.userName}!
          </div>
          <h1 className="text-[24px] sm:text-[36px] font-bold text-[700]">
            Dashboard
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full">
        <StatCard
          title="Total Properties"
          value={counts?.properties}
          bg="#15C0E6"
        />
        <StatCard title="Total Agents" value={data?.length || 0} bg="#F65160" />
        <StatCard
          title="Total Teams"
          value={teamData?.data?.length}
          bg="#6D5DD3"
        />
        <StatCard
          title="Signed Contracts"
          value={counts?.contracts}
          bg="#6D5DD3"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <div className="w-full sm:w-[70%] p-4 bg-[#FFFFFF] rounded-[24px]">
          <div className="flex justify-between items-center w-full mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Properties
            </h2>
            {sixProperties.length >= 5 && (
              <Link href={"/property"} legacyBehavior>
                <a className="flex items-center gap-1 text-sm text-[#3F8CFF] hover:text-blue-800 transition-colors duration-200">
                  <span>View all</span>
                  <ChevronRightIcon aria-hidden="true" />
                </a>
              </Link>
            )}
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {sixProperties.length > 0 ? (
              sixProperties.map((property) => (
                <RealState
                  key={property._id}
                  createdAt={property.createdAt}
                  imageUrl={property?.propertyImages?.[0] || "/assets/dumy.png"}
                  title={property.propertyName}
                  locationLine1={property?.address1}
                  agentCount={property.countValue}
                  altText={property.propertyName}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-2">No property found</p>
            )}
          </div>
        </div>

        <div className="w-full sm:w-[30%] bg-[#FFFFFF] rounded-[24px] p-5">
          <div className="flex justify-between items-center w-full mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Referrals
            </h2>

            {data?.length >= 5 && (
              <Link href={"/referrals"} legacyBehavior>
                <a className="flex items-center gap-1 text-sm text-[#3F8CFF] hover:text-blue-800 transition-colors duration-200">
                  <span>View all</span>
                  <ChevronRightIcon aria-hidden="true" />
                </a>
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {data && data.length > 0 ? (
              data
                .slice(0, 5)
                .map((agent) => (
                  <ProfileCard
                    key={agent._id}
                    imageUrl={agent?.propertyImages || "/assets/dumy.png"}
                    name={agent.name}
                    email={agent.email}
                    role={agent.role}
                    title={agent.title}
                  />
                ))
            ) : (
              <p className="text-gray-500">No referrals found</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-[#FFFFFF] rounded-[24px] p-5 mt-4">
        <div className="flex flex-col justify-between w-full mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Teams
            </h2>
          {teamData?.data?.length > 5 && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Teams
              </h2>
              <Link href={"/teams"} legacyBehavior>
                <a className="flex items-center gap-1 text-sm text-[#3F8CFF] hover:text-blue-800 transition-colors duration-200">
                  <span>View all</span>
                  <ChevronRightIcon aria-hidden="true" />
                </a>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {teamData?.data?.length > 0 ? (
              teamData.data
                .slice(0, 5)
                .map((team, index) => (
                  <TeamCard
                    key={index}
                    imageUrl={team?.logos?.[0]?.url || "/assets/dumy.png"}
                    name={team?.basicInfo.name}
                    city={team?.basicInfo.city}
                    agentCount={team.agents.length}
                    agentData={team.agents}
                  />
                ))
            ) : (
              <p className="text-gray-500">No teams found</p>
            )}
          </div>
          {/* <TeamCard
						name={"Team Name"}
						city={"Team City"}
						agentCount={"Team Count"}
						propertyCount={"Team Property"}
						soldCount={"Team Sold"}
					/> */}
        </div>
      </div>
    </div>
  );
};

export default page;
