import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addPositionAsync, updatePositionAsync } from '../store/positionSlice';
import { TextInput, Button, Group } from '@mantine/core';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export interface PositionFormProps {
  position?: {
    id: string;
    name: string;
    description: string;
    parentId: number | null;
  };
  onSave: () => void;
}

interface PositionFormData {
  name: string;
  description: string;
  parentId: number | null;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  parentId: yup.number().nullable(),
});

const PositionForm: React.FC<PositionFormProps> = ({ position, onSave }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PositionFormData>({
    resolver: yupResolver(schema),
    defaultValues: position || { name: '', description: '', parentId: null }
  });
  const dispatch = useDispatch();

  const onSubmit = (data: PositionFormData) => {
    if (position) {
      dispatch(updatePositionAsync({ ...data, id: position.id }));
    } else {
      dispatch(addPositionAsync({ ...data }));
    }
    onSave();
    reset(); // Reset the form after submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white shadow-md rounded-md max-w-md mx-auto">
      <div>
        <TextInput
          label="Name"
          placeholder="Enter name"
          {...register('name')}
          error={errors.name?.message}
          classNames={{
            root: 'space-y-1',
            input: 'w-full',
            error: 'border-red-500',
          }}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <TextInput
          label="Description"
          placeholder="Enter description"
          {...register('description')}
          error={errors.description?.message}
          classNames={{
            root: 'space-y-1',
            input: 'w-full',
            error: 'border-red-500',
          }}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>
      <div>
        <TextInput
          label="Parent ID"
          placeholder="Enter parent ID"
          type="number"
          {...register('parentId')}
          error={errors.parentId?.message}
          classNames={{
            root: 'space-y-1',
            input: 'w-full',
            error: 'border-red-500',
          }}
        />
        {errors.parentId && <p className="text-red-500">{errors.parentId.message}</p>}
      </div>
      <Group position="right">
        <Button type="submit" className="mt-2" variant="outline">Add Employee</Button>
      </Group>
    </form>
  );
};

export default PositionForm;