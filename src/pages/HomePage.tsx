import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPositions } from "../store/positionSlice";
import PositionForm from "../components/PositionForm";
import { RootState } from "../store/store";
import PositionTree from "../components/PostionTree";
// import { Link } from "react-router-dom";
// import employeehierarchyLogo from "./employeehierarchy.png";
import { Card, Text } from "@mantine/core";

interface Position {
  id: string;
  name: string;
  description: string;
  parentId: number | null;
}

const HomePage: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const dispatch = useDispatch();
  const positionsStatus = useSelector(
    (state: RootState) => state.positions.status
  );

  useEffect(
    () => {
      if (positionsStatus === "idle") {
        dispatch(fetchPositions());
      }
    },
    [positionsStatus, dispatch]
  );

  return (
    <div>
      {/* <Navbar /> */}
      <div className="container mx-auto p-4">
        <div>
          <h1 className="text-2xl m-4 text-center font-serif font-bold">
            Employee Hierarchy
          </h1>
          <PositionTree />
        </div>
        <div>
          <h1 className="text-2xl m-4 text-center font-serif font-bold">
            Add Employee
          </h1>
          <PositionForm
            position={selectedPosition || undefined}
            onSave={() => setSelectedPosition(null)}
          />
        </div>
        <div className="container mx-auto p-11 m-4">
          <h1 className="text-2xl mb-4 text-center font-serif font-bold">
            About Our Project
          </h1>
          <Card shadow="sm" style={{ maxWidth: 600, margin: "0 auto" }}>
            <Card.Section>
              <Text size="lg" weight={500} className="mb-4 pl-5">
                SPA Web Application for Organization Hierarchy
              </Text>
              <Text className="pl-3">
                Build a single-page application (SPA) for managing your
                organization's employee hierarchy with ease. Define hierarchical
                positions like CEO, CFO, and more, visualize them in a
                structure, and perform CRUD operations effortlessly.
              </Text>
              <Text className="mt-4 pl-3">
                <strong>Key Features:</strong>
                <ul className="list-disc ml-6">
                  <li>Interactive tree view for clear visualization.</li>
                  <li>CRUD operations for updating and deleting positions.</li>
                </ul>
              </Text>
              <Text className="mt-4 pl-3">
                <strong>Technology Stack:</strong>
                <ul className="list-disc ml-6">
                  <li>Mantine UI for modern and customizable UI components.</li>
                  <li>TailwindCSS for responsive and utility-first CSS.</li>
                  <li>Redux Toolkit for efficient state management.</li>
                  <li>React Hook Form for form handling and validation.</li>
                  <li>Axios for seamless HTTP requests.</li>
                </ul>
              </Text>
              <Text className="mt-4 pl-3">
                Explore our platform and experience streamlined organization
                hierarchy management with cutting-edge technology and intuitive
                design.
              </Text>
              <Text className="font-bold p-4 pl-11">
                Developed By Etenesh4best.
              </Text>
            </Card.Section>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
