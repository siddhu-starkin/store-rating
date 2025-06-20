import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

// API functions
const getConversations = async () => {
  const response = await axios.get(`${API_URL}/conversations`);
  return response.data;
};

const getConversation = async (id) => {
  const response = await axios.get(`${API_URL}/conversations/${id}`);
  return response.data;
};

const createConversation = async (data) => {
  const response = await axios.post(`${API_URL}/conversations`, data);
  return response.data;
};

const addMessage = async ({ conversationId, content, attachments }) => {
  const response = await axios.post(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      content,
      attachments,
    }
  );
  return response.data;
};

const closeConversation = async (conversationId) => {
  const response = await axios.post(
    `${API_URL}/conversations/${conversationId}/close`
  );
  return response.data;
};

const getConversationStats = async () => {
  const response = await axios.get(`${API_URL}/conversations/stats`);
  return response.data;
};

// React Query hooks
export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
};

export const useConversation = (id) => {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => getConversation(id),
    enabled: !!id,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });
};

export const useAddMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMessage,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["conversation", variables.conversationId]);
      queryClient.invalidateQueries(["conversations"]);
    },
  });
};

export const useCloseConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeConversation,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["conversation", variables]);
      queryClient.invalidateQueries(["conversations"]);
    },
  });
};

export const useConversationStats = () => {
  return useQuery({
    queryKey: ["conversationStats"],
    queryFn: getConversationStats,
  });
};
