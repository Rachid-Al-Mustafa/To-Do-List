import { GrClose } from 'react-icons/gr';
import Input from './input';
import { handleCloseModal } from '../utils/closeModal';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { addTask, userAction } from '../utils/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const NewTask = ({ setShowAddTaskModal }) => {
  const { user } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    title: '',
    description: ''
  });

  const queryClient = useQueryClient();
  
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

  const { status, error, mutate } = useMutation({
    mutationFn: addTask,
    onSuccess: (newTask) => {
      queryClient.setQueryData(['newTask'], newTask);
      actionMutate({
        userId: user._id,
        taskId: newTask._id,
        action: 'create',
      });
      Swal.fire({
        icon: 'success',
        title: 'New Task!',
        text: 'A New Task Was Added Successful!\nWould You Like To Add Another?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          setInputs({
            title: '',
            description: ''
          });
        } else {
          setShowAddTaskModal(false);
        }
      });;
    },
  });

  const boxRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = {
      ...inputs,
      userId: user._id,
    };

    try {
      mutate(task);
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const closeModal = (e) => handleCloseModal(e, boxRef, setShowAddTaskModal);

  return (
    <div
      onClick={closeModal}
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen bg-black/40 z-50 flex items-center justify-center px-2 overflow-hidden max-h-screen"
    >
      <form
        onSubmit={handleSubmit}
        ref={boxRef}
        className="flex flex-col gap-6 p-4 bg-white rounded-md w-full max-w-[650px]"
      >
        <div className="flex items-center justify-between pb-2 border-b-2">
          <div className="text-lg font-semibold text-primary">
            Create A New Task!
          </div>
          <div
            onClick={() => setShowAddTaskModal(false)}
            className="bg-gray-200 w-[35px] h-[35px] flex items-center justify-center rounded-full cursor-pointer"
          >
            <GrClose size={20} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Input
            label="Title"
            name="title"
            placeholder="Task Title"
            value={inputs.title}
            handleChange={handleInputChange}
          />
          <div className="flex flex-col gap-1">
            <label className="text-md font-medium" htmlFor="about">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Task Description"
              className="p-2 rounded-md border-2 bg-transparent outline-none scrollbar-hide h-[100px]"
              type="text"
              value={inputs.description}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="bg-purple-500 text-white p-2 rounded-md mt-4 font-medium"
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewTask;
