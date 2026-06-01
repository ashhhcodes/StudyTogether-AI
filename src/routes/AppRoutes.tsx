import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

import {Dashboard} from "@/pages/Dashboard";
import {FocusDesk} from "@/pages/FocusDesk";
import {StudyRoom} from "@/pages/StudyRoom";
import {Friends} from "@/pages/Friends";
import {Library} from "@/pages/Library";
import {TodoList} from "@/pages/TodoList";
import {Profile} from "@/pages/Profile";
import { SessionHistory } from "@/pages/SessionHistory";
import Auth from "@/pages/Auth";

export default function AppRoutes() {
  return (
      <Routes>

        {/* Auth Route */}
        <Route path="/Auth" element={<Auth />} />

        {/* Main App Layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/focus-desk"
          element={
            <MainLayout>
              <FocusDesk />
            </MainLayout>
          }
        />

        <Route
          path="/study-room"
          element={
            <MainLayout>
              <StudyRoom />
            </MainLayout>
          }
        />

        <Route
          path="/friends"
          element={
            <MainLayout>
              <Friends />
            </MainLayout>
          }
        />

        <Route
          path="/library"
          element={
            <MainLayout>
              <Library />
            </MainLayout>
          }
        />

        <Route
          path="/todos"
          element={
            <MainLayout>
              <TodoList />
            </MainLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        
        <Route
          path="/sessions"
          element={<SessionHistory />}
        />

      </Routes>
      
  );
}