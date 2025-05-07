import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../actions/user.action";


export const useUserDetails = (userId) => {
  return useQuery({
    queryKey: ["userDetails", userId], // Unique key for caching
    queryFn: async () => {
      if (userId) {
        const res = await fetchUser(userId);
        return res?.data.user;
      }
      return null;
    },
    enabled: !!userId, // Only fetch if userId exists
  });
};
