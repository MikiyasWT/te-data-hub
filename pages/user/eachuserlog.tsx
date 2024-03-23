import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { getEachUsersActivity, getUsersActivity } from '../../services/user';

interface User {
  email: string;
  activity: string;
  createdAt: string; // Assuming createdAt is a string representing the timestamp
}
interface SomeComponentProps {
    Id: string | string[] | undefined;
  }
const UsersLog: React.FC<SomeComponentProps> = ({Id}:any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getEachUsersActivity(Id);
        
        setUsers(response.data.activity);
      } catch (error) {
        console.error('Unable to fetch Users activity:', error);
      }
    };

    fetchSales();
  }, []);

  const formatTimeAgo = (timestamp: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
  
    const intervals = {
      year: Math.floor(seconds / 31536000),
      month: Math.floor(seconds / 2592000),
      day: Math.floor(seconds / 86400),
      hour: Math.floor(seconds / 3600),
      minute: Math.floor(seconds / 60),
      second: Math.floor(seconds),
    };
  
    if (intervals.year > 1) {
      return `${intervals.year} years ago`;
    } else if (intervals.month > 1) {
      return `${intervals.month} months ago`;
    } else if (intervals.day > 1) {
      return `${intervals.day} days ago`;
    } else if (intervals.day === 1 || (intervals.hour >= 24 && intervals.hour < 48)) {
      return `1 day ago`;
    } else if (intervals.hour > 1) {
      return `${intervals.hour} hours ago`;
    } else if (intervals.minute > 1) {
      return `${intervals.minute} minutes ago`;
    } else if (intervals.second > 1) {
      return `${intervals.second} seconds ago`;
    } else {
      return "just now";
    }
  };
  

  const columns = [
   
    { header: 'Activity ', accessor: 'activity' },
    {
      header: 'createdAt',
      accessor: 'createdAt',
      Cell: ({ value }: { value: string }) => <span>{formatTimeAgo(value)}</span>,
    },
  ];
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div>
     
      <Table data={users} columns={columns}
      onRowClick={null} 
      onImport={null}
      currentPage={currentPage} onPageChange={handlePageChange} totalItems={totalItems} itemsPerPage={itemsPerPage} />
    </div>
  );
};

export default UsersLog;
