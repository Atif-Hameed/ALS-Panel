'use client'
import TabSwitcher from '../profile/TabSwitcher'
import AgentsInfo from './AgentsInfo';
import ContactDetails from './ContactDetails';
import AssignList from './AssignList';
import ReferalTable from './referal-table';
import { useEffect, useState } from 'react';
import { getAllReferals } from '../../actions/agent.action';
import { useUserDetails } from '../../hooks/useUser';

const Page = () => {
  const [data, setData] = useState(null); // Initialize data as null
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }
  }, []);

  const { data: user } = useUserDetails(userId);

  const fetchReferalData = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAllReferals(user?._id, page, limit);
      console.log("response:", data, error);
      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }
      setData(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchReferalData();
    }
  }, [user, page, limit]);

  return (
    <div className='w-full mt-4'>
      {loading ? (
        <div className='flex flex-col justify-center items-center h-64'>
         
          <span className='visually-hidden'>Loading...</span> 
        </div>
      ) : (
        <ReferalTable
          data={data}
          meta={meta}
          setPage={setPage}
          setLimit={setLimit}
          loading={loading}
          userId={userId}
          fetchReferalData={fetchReferalData}
        />
      )}
    </div>
  );
};

export default Page;