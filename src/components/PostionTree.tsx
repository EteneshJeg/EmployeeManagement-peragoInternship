import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  fetchPositions,
  updatePositionAsync,
  deletePositionAsync
} from "../store/positionSlice";
import {
  Card,
  Button,
  Text,
  Group,
  Center,
  TextInput,
  Box
} from "@mantine/core";

interface Position {
  id: string;
  name: string;
  description: string;
  parentId: number | null;
}

const PositionTree: React.FC = () => {
  const dispatch = useDispatch();
  const positions = useSelector(
    (state: RootState) => state.positions.positions
  );
  const status = useSelector((state: RootState) => state.positions.status);
  const [selectedEmployee, setSelectedEmployee] = useState<Position | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Partial<
    Position
  > | null>(null); // Partial type for editedEmployee

  useEffect(
    () => {
      if (status === "idle") {
        dispatch(fetchPositions());
      }
    },
    [status, dispatch]
  );

  const rootPositions = positions.filter((p: Position) => p.parentId === null);

  const handleSelectEmployee = (position: Position) => {
    setSelectedEmployee(position);
    setIsEditing(false);
  };

  const handleEditEmployee = (position: Position) => {
    setEditedEmployee(position); // Set initial editedEmployee with existing position
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedEmployee) {
      const editedPosition: Position = {
        id: editedEmployee.id || "", // Ensure id is defined
        name: editedEmployee.name || "",
        description: editedEmployee.description || "",
        parentId:
          editedEmployee.parentId !== null
            ? parseInt(String(editedEmployee.parentId), 10)
            : null // Parse parentId to number if it's not null
      };
      dispatch(updatePositionAsync(editedPosition)); // Dispatch with proper type assertion
      setIsEditing(false);
      setSelectedEmployee(editedPosition); // Update selectedEmployee after save
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEmployee(prevState => ({
      ...prevState!,
      [name]: value
    }));
  };

  const handleDeleteEmployee = (id: string) => {
    dispatch(deletePositionAsync(id));
    setSelectedEmployee(null);
  };

  const renderPositionTree = (
    position: Position,
    positions: Position[],
    onSelectEmployee: (position: Position) => void,
    onEditEmployee: (position: Position) => void,
    onDeleteEmployee: (id: string) => void
  ): React.ReactNode => {
    const children = positions.filter((p: Position) => p.parentId === position.parentId);
    return (
      <li key={position.id}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => onSelectEmployee(position)}
          >
            {position.name}
          </span>
        </div>
        {children.length > 0 &&
          <ul style={{ paddingLeft: "20px" }}>
            {children.map(child =>
              renderPositionTree(
                child,
                positions,
                onSelectEmployee,
                onEditEmployee,
                onDeleteEmployee
              )
            )}
          </ul>}
      </li>
    );
  };

  return (
    <div>
      <ul>
        {rootPositions.map((root: Position) =>
          <li
            key={root.id}
            style={{ marginBottom: "10px", fontWeight: "normal" }}
          >
            <span style={{ fontWeight: "bold" }}>
              {root.name}
            </span>
            <ul style={{ paddingLeft: "10px" }}>
              {positions.map(
                (position: Position) =>
                  String(position.parentId) === String(root.id) && // Compare as strings
                  renderPositionTree(
                    position,
                    positions,
                    handleSelectEmployee,
                    handleEditEmployee,
                    handleDeleteEmployee
                  )
              )}
            </ul>
          </li>
        )}
      </ul>
      {selectedEmployee &&
        !isEditing &&
        <Center style={{ marginTop: "20px" }}>
          <Card shadow="sm" style={{ width: 300, padding: "lg" }}>
            <Card.Section>
              <Text size="lg" weight={500}>
                Selected Employee Details
              </Text>
            </Card.Section>
            <Text>
              ID: {selectedEmployee.id}
            </Text>
            <Text>
              Name: {selectedEmployee.name}
            </Text>
            <Text>
              Description: {selectedEmployee.description}
            </Text>
            <Group mt="md" position="center">
              <Button
                onClick={() => handleEditEmployee(selectedEmployee)}
                style={{ fontWeight: "normal", visibility: "visible" }}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                color="red"
                style={{ fontWeight: "normal", visibility: "visible" }}
              >
                Delete
              </Button>
              <Button
                onClick={() => setSelectedEmployee(null)}
                style={{ fontWeight: "normal", visibility: "visible" }}
              >
                Cancel
              </Button>
            </Group>
          </Card>
        </Center>}
      {isEditing &&
        editedEmployee &&
        <Center style={{ marginTop: "20px" }}>
          <Card shadow="sm" style={{ width: 300, padding: "lg" }}>
            <Card.Section>
              <Text size="lg" weight={500}>
                Edit Employee
              </Text>
            </Card.Section>
            <Box mt="md">
              <TextInput
                label="Name"
                name="name"
                value={editedEmployee.name || ""}
                onChange={handleChange}
                style={{ marginBottom: "10px" }}
              />
              <TextInput
                label="Description"
                name="description"
                value={editedEmployee.description || ""}
                onChange={handleChange}
                style={{ marginBottom: "10px" }}
              />
            </Box>
            <Group mt="md" position="center">
              <Button onClick={handleSave} style={{ fontWeight: "normal" }}>
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                style={{ fontWeight: "normal" }}
              >
                Cancel
              </Button>
            </Group>
          </Card>
        </Center>}
    </div>
  );
};

export default PositionTree;
