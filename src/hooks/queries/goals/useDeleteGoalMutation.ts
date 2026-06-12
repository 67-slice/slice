import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { deleteGoal } from "@/api/goal";
import goalsQueryKeys from "./queryKeys";
import { useRouter } from "next/navigation";
import { Goal, GoalResponse } from "@/api/types/goal";
import { toast } from "sonner";

type GoalsCache =
  | { nextCursor: number | null; totalCount: number; goals: Goal[] }
  | undefined;

export function useDeleteGoalMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (goalId: number) => deleteGoal(goalId),

    onMutate: async (goalId) => {
      await queryClient.cancelQueries({
        queryKey: goalsQueryKeys.detail(goalId),
      });

      await queryClient.cancelQueries({
        queryKey: goalsQueryKeys.infinite(),
      });

      queryClient.removeQueries({
        queryKey: goalsQueryKeys.detail(goalId),
      });
    },

    onSuccess: () => {
      router.replace("/dashboard");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: goalsQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: goalsQueryKeys.infinite() });
    },

    onError: () => {
      toast.error("삭제에 실패했습니다.");
    },
  });
}
