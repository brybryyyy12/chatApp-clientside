// src/api/user.ts
import { api } from "../api";

// Get current user (me)
export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

// Get all other users
export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};


//update
export const updateUserProfile = async (data: { username?: string; firstName?: string; lastName?: string; avatarImage?: string; }) => {
  const res = await api.put("/users/profile", data);
  return res.data;
};
