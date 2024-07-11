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
import { fetchTaskAnalytics } from '../utils/hooks';
import Header from '../components/header';
import Footer from '../components/footer';

const Analytics = () => {
  const { status, error, data } = useQuery({
    queryKey: ['Analytics'],
    queryFn: fetchTaskAnalytics,
  });

  if (status === 'pending' || status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;

  const { completionRate, timeline } = data;

  const timelineData = Object.keys(timeline).map((date) => ({
    date,
    count: timeline[date],
  }));

  return (
    <>
      <Header />
      <div className="p-4 bg-gray-100">
        <div className="bg-white bg-cover w-11/12 mx-auto mt-8 relative rounded-lg h-auto max-h-[33rem] p-4">
          <h2 className="text-lg font-semibold">Task Analytics</h2>
          <div className="mb-4">
            <h3>Task Completion Rate: {completionRate.toFixed(2)}%</h3>
          </div>
          <div className="mb-8">
            <h3>Task Completion Timeline</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Analytics;
