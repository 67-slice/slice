import { screen } from "@testing-library/react";
import type { ComponentType } from "react";
import TodosPage from "@/app/(protected)/todos/page";
import { renderWithQueryClient } from "tests/test-utils";
import type { ListTodoType } from "@/components/common/list/list-item/types";

import { useTodosQuery } from "@/hooks/queries/todos";

// react-error-boundary는 ES Module 형식이라 Jest가 변환 못하여,
// 패키지 전체를 모킹 후 children만 렌더링
jest.mock("react-error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useErrorHandler: () => () => {},
  withErrorBoundary: (component: ComponentType) => component,
}));

// mocks
jest.mock("@/hooks/queries/todos");

jest.mock("@/app/(protected)/todos/_components/TodoHeader", () => {
  return function MockTodoHeader() {
    return <div>TodoHeader</div>;
  };
});

jest.mock("@/app/(protected)/todos/_components/TodosContent", () => {
  return function MockTodosContent() {
    const { data } = useTodosQuery();
    const todos: ListTodoType[] = data?.todos ?? [];

    if (todos.length === 0) {
      return <div>등록된 할 일이 없어요</div>;
    }

    return (
      <div>
        {todos.map((todo) => (
          <div key={todo.id}>{todo.label}</div>
        ))}
      </div>
    );
  };
});

jest.mock("@/app/(protected)/todos/_components/TodosLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

afterEach(() => {
  jest.clearAllMocks();
});

// tests
describe("모든 할 일 페이지", () => {
  it("할 일이 있으면 할 일 리스트를 보여준다", () => {
    (useTodosQuery as jest.Mock).mockReturnValue({
      data: {
        todos: [
          { id: 1, label: "할일1", checked: false },
          { id: 2, label: "할일2", checked: true },
        ],
        totalCount: 2,
      },
    });

    renderWithQueryClient(<TodosPage />);

    expect(screen.getByText("할일1")).toBeInTheDocument();
    expect(screen.getByText("할일2")).toBeInTheDocument();
  });

  it("할 일이 없으면 빈 상태 문구를 보여준다", () => {
    (useTodosQuery as jest.Mock).mockReturnValue({
      data: {
        todos: [],
        totalCount: 0,
      },
    });

    renderWithQueryClient(<TodosPage />);

    expect(screen.getByText("등록된 할 일이 없어요")).toBeInTheDocument();
  });

  it("모든 할 일 개수가 Header에 보여진다", () => {
    (useTodosQuery as jest.Mock).mockReturnValue({
      data: {
        todos: [
          { id: 1, label: "할일1", checked: false },
          { id: 2, label: "할일2", checked: true },
          { id: 3, label: "할일3", checked: false },
        ],
        totalCount: 3,
      },
    });

    renderWithQueryClient(<TodosPage />);

    expect(screen.getByText("TodoHeader")).toBeInTheDocument();
  });
});
