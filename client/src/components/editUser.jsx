import { GrClose } from 'react-icons/gr';
import Input from './input';
import { handleCloseModal } from '../utils/closeModal';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { editUser } from '../utils/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const EditUser = ({ setShowEditUserModal, currentUser }) => {
  const { user } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    id: currentUser.key,
    username: currentUser.username,
    email: currentUser.email,
    role: currentUser.role,
  });

  const queryClient = useQueryClient();

  const { status, error, mutate } = useMutation({
    mutationFn: editUser,
    onSuccess: (editUser) => {
      queryClient.setQueryData(['editUser'], editUser);
      Swal.fire({
        icon: 'success',
        title: 'Edit Task!',
        text: 'The User Was Updated Successful!',
      });
      setShowEditUserModal(false);
    },
  });

  const boxRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      mutate(inputs);
    } catch (error) {
      console.error('Error updating user info:' + error);
    }
  };

  const closeModal = (e) => handleCloseModal(e, boxRef, setShowEditUserModal);

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
            Create A New User!
          </div>
          <div
            onClick={() => setShowEditUserModal(false)}
            className="bg-gray-200 w-[35px] h-[35px] flex items-center justify-center rounded-full cursor-pointer"
          >
            <GrClose size={20} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Input
            label="Username"
            name="username"
            placeholder="Username ex:Mohammad"
            value={inputs.username}
            handleChange={handleInputChange}
          />
          <Input
            label="Email"
            name="email"
            placeholder="User's Email Address"
            value={inputs.email}
            handleChange={handleInputChange}
          />
          <Input
            label="Role"
            name="role"
            placeholder="User's Role"
            value={inputs.role}
            handleChange={handleInputChange}
          />
          <div className="flex flex-col gap-1">
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

export default EditUser;
