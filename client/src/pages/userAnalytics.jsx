import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchUserTasks } from '../utils/hooks';
import Header from '../components/header';
import Footer from '../components/footer';

const UserAnalytics = () => {
  const {
    status,
    error,
    data: userTaskData = [],
  } = useQuery({
    queryKey: ['UserAnalytics'],
    queryFn: fetchUserTasks,
  });

  if (status === 'pending' || status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;

  return (
    <>
      <Header />
      <div className="p-4 mt-8 mb-8">
        <div className=" h-auto w-full">
          <h2 className="text-lg font-semibold mb-8">
            Number of Tasks Completed by Each User
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={600}
              height={300}
              data={userTaskData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="username" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="taskCount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserAnalytics;
