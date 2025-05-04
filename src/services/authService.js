import axios from "axios";

const API_URL = process.env.APP_API_URL || "http://localhost:5001";

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/sign-in`, {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/sign-up`, {
        name,
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get user");
    }
  },
};

export default authService;
