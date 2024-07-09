import React from 'react';
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
    parentId: string | null;
  };
  parentId?: string | null;
  onSave: (data: PositionFormData) => void;
  onCancel: () => void; // Ensure onCancel is included in props
}

export interface PositionFormData {
  name: string;
  description: string;
  parentId: string | null;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

const generateUniqueId = (): string => {
  return "id-" + Math.random().toString(36).substr(2, 9);
};

const PositionForm: React.FC<PositionFormProps> = ({ position, parentId, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PositionFormData>({
    resolver: yupResolver(schema),
    defaultValues: position || { name: '', description: '', parentId: parentId || null }
  });
  const dispatch = useDispatch();

  const onSubmit = (data: PositionFormData) => {
    if (position) {
      dispatch(updatePositionAsync({ ...data, id: position.id }));
    } else {
      const newPosition = { ...data, id: generateUniqueId(), parentId: parentId || null };
      dispatch(addPositionAsync(newPosition));
    }
    onSave(data); // Pass data to onSave
    reset(); // Reset the form after submission
  };

  const handleCancel = () => {
    reset(); // Reset form values
    onCancel(); // Call onCancel to handle cancellation
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
      <Group align="right">
        <Button type="submit" className="mt-2" variant="outline">Save</Button>
        <Button onClick={handleCancel} variant="outline" className="mt-2">
          Cancel
        </Button>
      </Group>
    </form>
  );
};

export default PositionForm;
