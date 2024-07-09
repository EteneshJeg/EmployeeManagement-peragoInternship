import React from 'react';
import { Card, Text, TextInput, Group, Button, Modal } from '@mantine/core';

interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
}

interface Props {
  editedPosition: Partial<Position> | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSave: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean; // New prop to control modal visibility
}

const EditPositionCard: React.FC<Props> = ({
  editedPosition,
  handleChange,
  handleSave,
  setIsEditing,
  isEditing
}) => {
  return (
    <Modal opened={isEditing} onClose={() => setIsEditing(false)} title="Edit Position">
      <Card shadow="sm" padding="lg" className="w-72">
        <Card.Section>
          <Text size="lg">
            Edit Position
          </Text>
        </Card.Section>
        <TextInput
          label="Name"
          name="name"
          value={editedPosition?.name || ''}
          onChange={handleChange}
          mt="md"
        />
        <TextInput
          label="Description"
          name="description"
          value={editedPosition?.description || ''}
          onChange={handleChange}
          mt="md"
        />
        <Group align="right" mt="md">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Card>
    </Modal>
  );
};

export default EditPositionCard;
