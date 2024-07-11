import { GrClose } from 'react-icons/gr';
import Input from './input';
import { handleCloseModal } from '../utils/closeModal';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { editTask, userAction } from '../utils/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const EditTask = ({ setShowEditTaskModal, currentTask }) => {
  const { user } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    title: currentTask.title,
    description: currentTask.description,
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
    mutationFn: editTask,
    onSuccess: (editTask) => {
      queryClient.setQueryData(['editTask'], editTask);
      Swal.fire({
        icon: 'success',
        title: 'Edit Task!',
        text: 'The Task Was Updated Successful!',
      });
      setShowEditTaskModal(false);
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
      ...currentTask,
      title: inputs.title,
      description: inputs.description,
      userId: user._id,
    };

    try {
      mutate({ id: currentTask.key, task: task });
      actionMutate({
        userId: user._id,
        taskId: currentTask.key,
        action: 'edit',
      });
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const closeModal = (e) => handleCloseModal(e, boxRef, setShowEditTaskModal);

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
          <div className="text-lg font-semibold text-primary">Edit Task!</div>
          <div
            onClick={() => setShowEditTaskModal(false)}
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

export default EditTask;
