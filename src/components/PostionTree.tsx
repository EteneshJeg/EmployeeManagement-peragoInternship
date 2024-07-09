import React, { useEffect, useState } from "react";
import { Center, Button } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";

import {
  fetchPositions,
  updatePositionAsync,
  deletePositionAsync,
  selectPositions,
  selectStatus
} from "../store/positionSlice";
import PositionTable from "./PositionTable";
import EditPositionCard from "./EditPositionCard";
import { Position, generateUniqueId } from "./utils";

const PositionTree: React.FC = () => {
  const dispatch = useDispatch();
  const positions = useSelector(selectPositions);
  const status = useSelector(selectStatus);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPosition, setEditedPosition] = useState<Partial<Position> | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPositions());
    }
  }, [status, dispatch]);

  const handleSelectPosition = (position: Position) => {
    setSelectedPosition(position);
    setIsEditing(false);
  };

  const handleEditPosition = (position: Position) => {
    dispatch(updatePositionAsync(position));
    setEditedPosition(null);
    setIsEditing(false);
  };

  const handleDeletePosition = (id: string) => {
    dispatch(deletePositionAsync(id));
    setIsEditing(false);
  };

  const handleAddChild = (parentId: string) => {
    setParentId(parentId);
    setIsEditing(true);
  };

  const addRow = (
    parentId: string | null,
    name?: string,
    description?: string
  ) => {
    const newPosition: Position = {
      id: generateUniqueId(),
      name: name || "New Position",
      description: description || "",
      parentId: parentId
    };
    dispatch(updatePositionAsync(newPosition));
  };

  return (
    <div className="p-4">
    
      <PositionTable
        positions={positions}
        expandedRows={expandedRows}
        setExpandedRows={setExpandedRows}
        handleSelectPosition={handleSelectPosition}
        handleEditPosition={handleEditPosition}
        handleDeletePosition={handleDeletePosition}
        handleAddChild={handleAddChild}
        addRow={addRow}
        isEditing={isEditing} 
      />
      {isEditing && (
        <EditPositionCard
          editedPosition={editedPosition}
          handleChange={() => {}} // Dummy function to satisfy prop
          handleSave={() => {}} // Dummy function to satisfy prop
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default PositionTree;
