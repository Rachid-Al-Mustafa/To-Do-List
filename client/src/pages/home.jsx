import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableComponent from '../components/table';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { GiCancel } from 'react-icons/gi';
import { CiEdit } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { LiaTableSolid } from 'react-icons/lia';
import { IoMdAdd } from 'react-icons/io';
import Header from '../components/header';
import Footer from '../components/footer';
import Swal from 'sweetalert2';
import NewTask from '../components/newTask';
import EditTask from '../components/editTask';
import NewUser from '../components/newUser';
import EditUser from '../components/editUser';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTasks,
  deleteTask,
  updateTaskStatus,
  userAction,
  allUsers,
  deleteUser,
  editUserRole
} from '../utils/hooks';
import moment from 'moment';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedUserRows, setSelectedUserRows] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();
  const {
    status,
    error,
    data: tasks = [],
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const {
    status: userStatus,
    error: userError,
    data: users = [],
  } = useQuery({
    queryKey: ['users'],
    queryFn: allUsers,
  });

  const queryClient = useQueryClient();

  const {
    status: deleteStatus,
    error: deleteError,
    mutate: deleteMutate,
  } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['deleteTasks']);
      Swal.fire({
        icon: 'success',
        title: 'Delete A Task!',
        text: 'The Task Was Deleted Successfully!',
      });
      setSelectedRows([]);
    },
  });

  const {
    status: deleteUserStatus,
    error: deleteUserError,
    mutate: deleteUserMutate,
  } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['deleteUser']);
      Swal.fire({
        icon: 'success',
        title: 'Delete A User!',
        text: 'The User Was Deleted Successfully!',
      });
      setSelectedUserRows([]);
    },
  });

  const {
    status: actionStatus,
    error: actionError,
    mutate: actionMutate,
  } = useMutation({
    mutationFn: userAction,
    onSuccess: () => {
      queryClient.invalidateQueries(['userAction']);
    },
  });

  const {
    status: updateStatus,
    error: updateError,
    mutate: updateMutate,
  } = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['taskStatus']);
      Swal.fire({
        icon: 'success',
        title: 'Update Task Status!',
        text: 'The Task Status Was Updated Successfully!',
      });
    },
  });

  const {
    status: updateRoleStatus,
    error: updateRoleError,
    mutate: updateRoleMutate,
  } = useMutation({
    mutationFn: editUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['userRole']);
      Swal.fire({
        icon: 'success',
        title: 'Update User Role!',
        text: 'The User Role Was Updated Successfully!',
      });
    },
  });

  const handleSelectRow = (rowIndex) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(rowIndex)) {
        return prevSelected.filter((index) => index !== rowIndex);
      } else {
        return [...prevSelected, rowIndex];
      }
    });
  };

  const handleSelectUserRow = (rowIndex) => {
    setSelectedUserRows((prevSelected) => {
      if (prevSelected.includes(rowIndex)) {
        return prevSelected.filter((index) => index !== rowIndex);
      } else {
        return [...prevSelected, rowIndex];
      }
    });
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === casingData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(casingData.map((_, index) => index));
    }
  };

   const handleSelectAllUserRows = () => {
     if (selectedUserRows.length === casingUserData.length) {
       setSelectedUserRows([]);
     } else {
       setSelectedUserRows(casingUserData.map((_, index) => index));
     }
   };

  const casingData = React.useMemo(
    () =>
      tasks.map((task) => ({
        key: task._id,
        userId: task.userId,
        edit: 'Edit',
        completed: task.isCompleted,
        title: task.title,
        description: task.description,
        dateAdded: moment(task.updatedAt).format('DD MMM YYYY'),
        dateCompleted: task.isCompleted
          ? moment(task.completedAt).format('DD MMM YYYY')
          : '',
        createdBy: task.userId?.username || '',
      })),
    [tasks]
  );

  const columns = [
    {
      Header: 'Completed',
      accessor: 'completed',
      Cell: ({ row }) =>
        row.original.completed ? (
          <FaRegCircleCheck
            color="green"
            onClick={() => handleUpdateTaskStatus(row.original.key, false)}
            className="cursor-pointer"
          />
        ) : (
          <GiCancel
            color="red"
            onClick={() => handleUpdateTaskStatus(row.original.key, true)}
            className="cursor-pointer"
          />
        ),
    },
    {
      Header: 'Task',
      accessor: 'title',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Date Added',
      accessor: 'dateAdded',
    },
    {
      Header: 'Date Completed',
      accessor: 'dateCompleted',
    },
    {
      Header: 'Created By',
      accessor: 'createdBy',
    },
  ];

  if (user?.role !== 'user') {
    columns.unshift(
      {
        Header: (
          <input
            type="checkbox"
            onChange={handleSelectAllRows}
            checked={selectedRows.length === casingData.length}
          />
        ),
        accessor: 'select',
        Cell: ({ row: { original } }) => (
          <input
            type="checkbox"
            checked={selectedRows.includes(original.key)}
            onChange={() => handleSelectRow(original.key)}
          />
        ),
      },
      {
        Header: 'Edit',
        accessor: 'edit',
        Cell: ({ row }) => (
          <button
            onClick={() => handleEditTask(row.original)}
            className="p-2 rounded-md bg-slate-300"
          >
            <CiEdit color="blue" />
          </button>
        ),
      }
    );
  }

  const casingUserData = React.useMemo(
    () =>
      users.map((user) => ({
        key: user._id,
        edit: 'Edit',
        completed: user.role == 'admin',
        username: user.username,
        email: user.email,
        role: user.role,
      })),
    [tasks]
  );

  const casingUserColumns = React.useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            onChange={handleSelectAllUserRows}
            checked={selectedUserRows.length === casingUserData.length}
          />
        ),
        accessor: 'select',
        Cell: ({ row: { original } }) => (
          <input
            type="checkbox"
            checked={selectedUserRows.includes(original.key)}
            onChange={() => handleSelectUserRow(original.key)}
          />
        ),
      },
      {
        Header: 'Edit',
        accessor: 'edit',
        Cell: ({ row }) => (
          <button
            onClick={() => handleEditUser(row.original)}
            className="p-2 rounded-md bg-slate-300"
          >
            <CiEdit color="blue" />
          </button>
        ),
      },
      {
        Header: 'Team Leader',
        accessor: 'teamLeader',
        Cell: ({ row }) =>
          row.original.completed ? (
            <FaRegCircleCheck
              color="green"
              onClick={() => handleUpdateUserRole(row.original.key, false, 'user')}
              className="cursor-pointer"
            />
          ) : (
            <GiCancel
              color="red"
              onClick={() => handleUpdateUserRole(row.original.key, true, 'admin')}
              className="cursor-pointer"
            />
          ),
      },
      {
        Header: 'User',
        accessor: 'username',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
    ],
    [selectedUserRows, casingUserData]
  );

  const handleDeleteTask = (e) => {
    e.preventDefault();

    if (selectedRows.length <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Select A Task',
        text: 'Please select a task to delete first!',
      });
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: 'Delete Selected Task',
      text: 'Are you sure you want to delete the selected task(s)?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutate({ ids: selectedRows });
        actionMutate({
          userId: user._id,
          taskId: selectedRows,
          action: 'delete',
        });
      }
    });
  };

   const handleDeleteUser = (e) => {
     e.preventDefault();

     if (selectedUserRows.length <= 0) {
       Swal.fire({
         icon: 'warning',
         title: 'Select A User',
         text: 'Please select a user to delete first!',
       });
       return;
     }

     Swal.fire({
       icon: 'warning',
       title: 'Delete Selected User',
       text: 'Are you sure you want to delete the selected user(s)?',
       showDenyButton: true,
       confirmButtonText: 'Yes',
       denyButtonText: 'No',
     }).then((result) => {
       if (result.isConfirmed) {
         deleteUserMutate({ ids: selectedUserRows });
       }
     });
   };

  const handleAddTask = (e) => {
    e.preventDefault();
    setShowAddTaskModal(true);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setShowAddUserModal(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowEditTaskModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowEditUserModal(true);
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    Swal.fire({
      icon: 'warning',
      title: `Mark as ${newStatus ? 'Complete' : 'Incomplete'}`,
      text: `Are you sure you want to mark this task as ${
        newStatus ? 'complete' : 'incomplete'
      }?`,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        updateMutate({ taskId, newStatus });
        newStatus
          ? actionMutate({
              userId: user._id,
              taskId: taskId,
              action: 'complete',
            })
          : actionMutate({
              userId: user._id,
              taskId: taskId,
              action: 'edit',
            });
      }
    });
  };

  const handleUpdateUserRole = (userId, newRole, postion) => {
    Swal.fire({
      icon: 'warning',
      title: `Make a ${newRole ? 'Team Leader' : 'User'}`,
      text: `Are you sure you want to make this user a ${
        newRole ? 'Team Leader' : 'User'
      }?`,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        updateRoleMutate({ userId: userId, newRole: postion });
      }
    });
  };

  return (
    <>
      <Header />
      <div className="p-4 bg-gray-100">
        <div className="bg-white bg-cover w-11/12 mx-auto mt-8 relative rounded-lg h-auto max-h-[33rem] p-4">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg font-semibold">Tasks</h2>
            {user?.role !== 'user' && (
              <div className="flex flex-row gap-4">
                <div
                  onClick={() => navigate('/chart')}
                  className="p-2 rounded-md outline outline-slate-300 outline-1 cursor-pointer"
                >
                  <LiaTableSolid color="black" />
                </div>
                <div
                  onClick={handleAddTask}
                  className="p-2 rounded-md bg-purple-500 cursor-pointer"
                >
                  <IoMdAdd color="white" />
                </div>
                <div
                  onClick={handleDeleteTask}
                  className="p-2 rounded-md bg-slate-200 outline outline-slate-300 outline-1 cursor-pointer"
                >
                  <AiOutlineDelete color="gray" />
                </div>
              </div>
            )}
          </div>
          <TableComponent columns={columns} data={casingData} />
        </div>

        {user?.role !== 'user' && (
          <div className="bg-white bg-cover w-11/12 mx-auto mt-8 relative rounded-lg h-auto max-h-[33rem] p-4">
            <div className="flex flex-row justify-between">
              <h2 className="text-lg font-semibold">Users</h2>
              <div className="flex flex-row gap-4">
                <div
                  onClick={() => navigate('/userChart')}
                  className="p-2 rounded-md outline outline-slate-300 outline-1 cursor-pointer"
                >
                  <LiaTableSolid color="black" />
                </div>
                {user?.role === 'superAdmin' && (
                  <div
                    onClick={handleAddUser}
                    className="p-2 rounded-md bg-purple-500 cursor-pointer"
                  >
                    <IoMdAdd color="white" />
                  </div>
                )}
                {user?.role === 'superAdmin' && (
                  <div
                    onClick={handleDeleteUser}
                    className="p-2 rounded-md bg-slate-200 outline outline-slate-300 outline-1 cursor-pointer"
                  >
                    <AiOutlineDelete color="gray" />
                  </div>
                )}
              </div>
            </div>
            <TableComponent columns={casingUserColumns} data={casingUserData} />
          </div>
        )}
      </div>
      {showAddTaskModal && (
        <NewTask setShowAddTaskModal={setShowAddTaskModal} />
      )}
      {showAddUserModal && (
        <NewUser setShowAddUserModal={setShowAddUserModal} />
      )}
      {showEditTaskModal && (
        <EditTask
          setShowEditTaskModal={setShowEditTaskModal}
          currentTask={currentTask}
        />
      )}
      {showEditUserModal && (
        <EditUser
          setShowEditUserModal={setShowEditUserModal}
          currentUser={currentUser}
        />
      )}
      <Footer />
    </>
  );
};

export default Home;
