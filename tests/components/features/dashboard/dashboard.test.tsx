import { screen } from "@testing-library/react";
import ProgressContent from "@/app/(protected)/dashboard/_components/todos/progress/ProgressContent";
import RecentTodosContent from "@/app/(protected)/dashboard/_components/todos/recent/RecentTodosContent";
import GoalList from "@/app/(protected)/dashboard/_components/goal/GoalList";
import { useProgressTodosSuspense } from "@/hooks/queries/todos/useProgressTodosSuspense";
import { useTodosSuspense } from "@/hooks/queries/todos/useTodosSuspense";
import { useGoalsInfiniteQuery } from "@/hooks/queries/goals/useGoalsInfiniteQuery";
import { renderWithQueryClient } from "tests/test-utils";

jest.mock("@/app/(protected)/_components/AsyncBoundary", () => {
  const MockAsyncBoundary = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  MockAsyncBoundary.displayName = "MockAsyncBoundary";
  return MockAsyncBoundary;
});

jest.mock("@/hooks/queries/todos/useTodosSuspense", () => ({
  useTodosSuspense: jest.fn(),
}));

jest.mock("@/hooks/queries/todos/useProgressTodosSuspense", () => ({
  useProgressTodosSuspense: jest.fn(),
}));

jest.mock("@/hooks/queries/goals/useGoalsInfiniteQuery", () => ({
  useGoalsInfiniteQuery: jest.fn(),
}));

jest.mock("@/hooks/queries/todos/useToggleTodo", () => ({
  useToggleTodo: () => ({
    handleToggle: jest.fn(),
  }),
}));

jest.mock("@/components/common/list/list-item-actions/ListItemActions", () => {
  const MockListItemActions = () => null;
  MockListItemActions.displayName = "MockListItemActions";
  return MockListItemActions;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("대시보드 - 최근 등록한 할 일", () => {
  it("최근 4개만 보여준다", () => {
    (useTodosSuspense as jest.Mock).mockReturnValue([
      { id: 1, label: "todo1", checked: false },
      { id: 2, label: "todo2", checked: false },
      { id: 3, label: "todo3", checked: false },
      { id: 4, label: "todo4", checked: false },
      { id: 5, label: "todo5", checked: false },
    ]);

    renderWithQueryClient(<RecentTodosContent />);

    expect(screen.getByText("todo5")).toBeInTheDocument();
    expect(screen.getByText("todo4")).toBeInTheDocument();
    expect(screen.getByText("todo3")).toBeInTheDocument();
    expect(screen.getByText("todo2")).toBeInTheDocument();
    expect(screen.queryByText("todo1")).not.toBeInTheDocument();
  });

  it("할 일이 없으면 안내 문구를 보여준다", () => {
    (useTodosSuspense as jest.Mock).mockReturnValue([]);

    renderWithQueryClient(<RecentTodosContent />);

    expect(
      screen.getByText("최근에 등록한 할 일이 없어요"),
    ).toBeInTheDocument();
  });
});

describe("대시보드 - 진행도", () => {
  it("할 일들의 진행도를 보여준다", () => {
    (useProgressTodosSuspense as jest.Mock).mockReturnValue({
      progress: 80,
    });

    renderWithQueryClient(<ProgressContent nickname="다슬" />);

    expect(screen.getByText(/80/)).toBeInTheDocument();
  });

  it("progress가 없으면 0%를 보여준다", () => {
    (useProgressTodosSuspense as jest.Mock).mockReturnValue({});

    renderWithQueryClient(<ProgressContent nickname="다슬" />);

    expect(screen.getByText(/0/)).toBeInTheDocument();
  });
});

describe("대시보드 - 목표별 할 일", () => {
  it("목표가 잘 나온다", () => {
    (useGoalsInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            goals: [
              { id: 1, title: "운동 목표", todos: [] },
              { id: 2, title: "공부 목표", todos: [] },
            ],
          },
        ],
      },
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
    });

    renderWithQueryClient(<GoalList />);

    expect(screen.getByText("운동 목표")).toBeInTheDocument();
    expect(screen.getByText("공부 목표")).toBeInTheDocument();
  });
});
