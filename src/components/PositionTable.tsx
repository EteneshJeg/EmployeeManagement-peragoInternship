import React, { useState, useEffect } from "react";
import { Button, Center, Stack, Table, Text } from "@mantine/core";
import { ActionIcon } from '@mantine/core';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getExpandedRowModel
} from "@tanstack/react-table";
import EditPositionCard from "./EditPositionCard";
import PositionForm, { PositionFormData } from "./PositionForm";
import { Position } from "./utils";

interface Props {
  positions: Position[];
  expandedRows: string[]; // Define expandedRows as part of Props
  setExpandedRows: React.Dispatch<React.SetStateAction<string[]>>; // Define setExpandedRows as part of Props
  handleSelectPosition: (position: Position) => void;
  handleEditPosition: (position: Position) => void;
  handleDeletePosition: (id: string) => void;
  handleAddChild: (parentId: string) => void;
  addRow: (
    parentId: string | null,
    name?: string,
    description?: string
  ) => void;
  isEditing: boolean;
}


const PositionTable: React.FC<Props> = ({
  positions,
  handleSelectPosition,
  handleEditPosition,
  handleDeletePosition,
  handleAddChild,
  addRow,
  isEditing // Include isEditing in props
}) => {
  const [editedPosition, setEditedPosition] = useState<Partial<Position> | null>(null);
  const [isAddingRoot, setIsAddingRoot] = useState(false); // State for managing root position form visibility
  const [isEditingPosition, setIsEditingPosition] = useState(false); // State for managing position editing form visibility
  const [isAddingChild, setIsAddingChild] = useState(false); // State for managing child position form visibility
  const [newPositionName, setNewPositionName] = useState("");
  const [newPositionDescription, setNewPositionDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleEditButtonClick = (position: Position) => {
    setEditedPosition(position);
    setIsEditingPosition(true);
  };

  const handleAddChildClick = (parentId: string) => {
    const positionToAddChild = positions.find(pos => pos.id === parentId);
    
    if (positionToAddChild) {
      setEditedPosition(positionToAddChild);
      setIsAddingChild(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedPosition(prev => ({
      ...prev!,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveEdit = () => {
    if (editedPosition) {
      handleEditPosition(editedPosition as Position);
      setIsEditingPosition(false); // Close the edit form after saving
      setSuccessMessage("Position updated successfully.");
    }
  };

  const handleSaveAddRoot = (data: PositionFormData) => {
    try {
      addRow(null, data.name, data.description);
      setIsAddingRoot(false); // Close the add root form after saving
      setNewPositionName("");
      setNewPositionDescription("");
      setSuccessMessage("Root position added successfully.");
    } catch (error) {
      setErrorMessage("Failed to add root position.");
    }
  };

  const handleSaveAddChild = (data: PositionFormData) => {
    try {
      addRow(editedPosition?.id || null, data.name, data.description);
      setIsAddingChild(false); // Close the add child form after saving
      setNewPositionName("");
      setNewPositionDescription("");
      setSuccessMessage("Child position added successfully.");
    } catch (error) {
      setErrorMessage("Failed to add child position.");
    }
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this position?');

    if (confirmDelete) {
      handleDeletePosition(id);
    }
    try {
      handleDeletePosition(id);
      setSuccessMessage("Position deleted successfully.");
    } catch (error) {
      setErrorMessage("Failed to delete position.");
    }
  };

  const clearMessages = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const columnHelper = createColumnHelper<Position>();

  const columns = [
    columnHelper.accessor("name", {
      id: "nameWithButton",
      header: ({ table }) =>
        <Stack align="center">
          <Button
            onClick={table.getToggleAllRowsExpandedHandler()}
            color="warning"
            size="sm"
            style={{ fontSize: 16 }}
          >
            {table.getIsAllRowsExpanded() ? "👇" : "👉"}
          </Button>
        </Stack>,
      cell: ({ row }) => (
        <Stack
          style={{ paddingLeft: `${row.depth * 2}rem` }} // Use style prop instead of sx
          align="center"
        >
          {row.getCanExpand()? (
            <Button
              onClick={row.getToggleExpandedHandler()}
              color="warning"
              size="sm"
              style={{ fontSize: 16 }}
            >
              {row.getIsExpanded() ? "👇" : "👉"}
            </Button>
          ) : (
            <Button
              size="sm"
              disabled
              color="neutral"
            >
              🔵
            </Button>
          )}
        </Stack>
      )
    }),
    columnHelper.accessor("name", {
      id: "fullName",
      header: "Full Name"
    }),
    columnHelper.accessor("description", {
      id: "description",
      header: "Description"
    }),
    columnHelper.display({
      id: "actions",
      header: () => <p style={{ textAlign: 'center' }}>Actions</p>,
      cell: ({ row }) => {
        const position = row.original as Position;
        return (
          <div className="flex justify-center flex-row space-x-1">
            <button
              onClick={() => handleEditButtonClick(position)}
              className="p-1 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Edit <ActionIcon variant="edit" className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(position.id)}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Delete <ActionIcon variant="trash" className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAddChildClick(position.id)}
              className="p-1 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Add Child <ActionIcon variant="add" className="w-4 h-4" />
            </button>
          </div>
        );
      }
    })
  ];

  const table = useReactTable<Position>({
    data: positions,
    columns,
    getSubRows: (row) => row.children || [],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  });

  const renderPositionRow = (row: any) => {
    const position = row.original as Position;
    const childPositions = positions.filter(
      (pos: Position) => pos.parentId === position.id
    );

    return (
      <React.Fragment key={row.id}>
        <tr onClick={() => handleSelectPosition(position)}>
          {row.getVisibleCells().map((cell: any) => (
            <td key={cell.id} className="border px-4 py-2">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
        {row.getIsExpanded() &&
          childPositions.map((childPosition: Position) => {
            const childRow = table
              .getRowModel()
              .rows.find(r => r.original.id === childPosition.id);
            return childRow ? renderPositionRow(childRow) : null;
          })}
      </React.Fragment>
    );
  };

  return (
    <div>
      {isEditingPosition && (
        <PositionForm
          position={editedPosition as Position} // Type assertion here
          onSave={handleSaveEdit}
          onCancel={() => setIsEditingPosition(false)}
        />
      )}
      {successMessage && (
        <Text color="green" style={{ marginTop: '10px' }}>
          {successMessage}
        </Text>
      )}
      {errorMessage && (
        <Text color="red" style={{ marginTop: '10px' }}>
          {errorMessage}
        </Text>
      )}
      <table className="table-fixed w-full">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border px-4 py-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.filter((row: any) => row.original.parentId === null)
            .map((row: any) => renderPositionRow(row))}
        </tbody>
      </table>
      <Center style={{ marginTop: "20px" }}>
        <button
          className="p-1 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={() => setIsAddingRoot(true)}
        >
          Add Root Position <ActionIcon variant="add" className="w-4 h-4" />
        </button>
      </Center>
      {isAddingRoot && (
        <PositionForm
          parentId={null}
          onSave={handleSaveAddRoot}
          onCancel={() => setIsAddingRoot(false)}
        />
      )}
      {isAddingChild && (
        <PositionForm
          parentId={editedPosition?.id || null}
          onSave={handleSaveAddChild}
          onCancel={() => setIsAddingChild(false)}
        />
      )}
    </div>
  );
};

export default PositionTable;
