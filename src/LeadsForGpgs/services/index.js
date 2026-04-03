import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:4000/api", // for vercel deployement
  // baseURL: "http://localhost:3000/api", // For local development
});

const fetchLeadsDetails = async () => {
  const response = await apiClient.get("/get-gpms-Leads");
  return response.data;
};

// React Query hook to fetch property data
export const useLeadsDetails = () => {
  return useQuery({
    queryKey: ["LeadsDetails"],
    queryFn: fetchLeadsDetails,
    staleTime: Infinity,
  });
};

const postClientDeatails = async (data) => {
  // const result = await axios.post("https://jsonplaceholder.typicode.com/users",data);
  const result = await apiClient.post("/create-gpms-Leads", data);
  return result.data;
};

export const usePostClientDeatails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postClientDeatails,
    onSuccess: () => {
      queryClient.invalidateQueries(["ClientDetail"]);
    },
  });
};

const updateClientDetails = async ({ srNo, data }) => {
  const result = await apiClient.put(`/update-gpms-Leads`, { srNo, data });
  return result.data;
};

export const useUpdateClientDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClientDetails,
    onSuccess: () => {
      queryClient.invalidateQueries(["ClientDetails"]);
    },
  });
};

const fetchDynamicDetails = async () => {
  const response = await apiClient.get("/dynamic-values");
  return response.data;
};

// React Query hook to fetch property data
export const useDynamicDetails = () => {
  return useQuery({
    queryKey: ["dynamicvalues"],
    queryFn: fetchDynamicDetails,
  });
};

// ✅ Fetch Employee Details
const fetchEmployeeDetailsData = async (Role) => {
  if (Role !== "client") {
    const response = await apiClient.get("/Employees-details");
    return response.data;
  }
};

export const useEmployeeDetails = (Role) => {
  return useQuery({
    queryKey: ["EmployeeDetails"],
    queryFn: () => fetchEmployeeDetailsData(Role),
  });
};
