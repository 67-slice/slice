import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Spinner } from "@/assets/icons";
import { backendFetch } from "@/lib/backend";
import { TodoResponse } from "@/api/types/todo";
import todosQueryKeys from "@/hooks/queries/todos/queryKeys";
import { AsyncBoundary } from "@/app/(protected)/_components/AsyncBoundary";
import NoteCreateContainer from "@/app/(protected)/notes/_components/NoteCreateContainer";

interface NoteNewPageProps {
  params: Promise<{ todoId: string }>;
}

export default async function NoteNewPage({ params }: NoteNewPageProps) {
  const { todoId } = await params;
  const todoIdNumber = Number(todoId);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: todosQueryKeys.detail(todoIdNumber),
    queryFn: () =>
      backendFetch<TodoResponse>(`/todos/${todoIdNumber}`, { auth: "access" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AsyncBoundary
        loadingFallback={
          <div className="-mt-20 flex min-h-screen items-center justify-center">
            <Spinner
              width={60}
              height={60}
              className="text-orange-250"
            />
          </div>
        }>
        <NoteCreateContainer todoId={todoIdNumber} />
      </AsyncBoundary>
    </HydrationBoundary>
  );
}
