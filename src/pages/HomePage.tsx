import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPositions } from "../store/positionSlice";
import { RootState } from "../store/store";
import PositionTree from "../components/PostionTree";
import { Card, Text, Container, Title } from "@mantine/core";
import { motion } from "framer-motion";

interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  profile: File;
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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 flex flex-col items-center justify-center">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <Title
            order={1}
            className="text-center font-bold text-4xl font-serif text-white tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-slide"
          >
            Perago Intern Project
          </Title>
        </motion.div>
        <Card
          shadow="md"
          p="xl"
          radius="lg"
          className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg"
        >
          <Title
            order={2}
            className="text-center font-bold text-3xl font-serif text-gray-900 mb-6"
          >
            Employee Hierarchy
          </Title>
          <PositionTree />
        </Card>
      </Container>
    </div>
  );
};

export default HomePage;
