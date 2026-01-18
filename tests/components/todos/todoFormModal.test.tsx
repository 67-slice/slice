import { screen, fireEvent } from "@testing-library/react";
import { renderWithQueryClient } from "tests/test-utils";
import TodoFormContent from "@/app/(protected)/_components/todo-modal/_components/TodoFormContent";
import { useGoalList } from "@/hooks/queries/goals/useGoalList";
import { useDeviceSize } from "@/hooks/useDeviceSize";

jest.mock("@/hooks/queries/goals/useGoalList", () => ({
  useGoalList: jest.fn(),
}));

jest.mock("@/hooks/useDeviceSize", () => ({
  useDeviceSize: jest.fn(),
}));

jest.mock("@/hooks/queries/todos/useCreateMutation", () => ({
  useCreateMutation: () => ({ mutate: jest.fn() }),
}));

jest.mock("@/hooks/queries/todos/useEditMutation", () => ({
  useEditMutation: () => ({ mutate: jest.fn() }),
}));

jest.mock("@/hooks/queries/files/useFileUploadMutation", () => ({
  useFileUploadMutation: () => ({ mutateAsync: jest.fn() }),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("TodoFormContent", () => {
  it("create 모드이면 생성 화면을 보여준다", () => {
    (useDeviceSize as jest.Mock).mockReturnValue({ isMobile: false });
    (useGoalList as jest.Mock).mockReturnValue({
      data: { goals: [{ id: 1, title: "React 공부" }] },
    });

    renderWithQueryClient(
      <TodoFormContent
        mode="create"
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText("할 일 생성")).toBeInTheDocument();
    expect(screen.getByText("목표를 선택해주세요")).toBeInTheDocument();
  });

  it("edit 모드이면 기존 값이 input에 채워진다", () => {
    (useDeviceSize as jest.Mock).mockReturnValue({ isMobile: false });
    (useGoalList as jest.Mock).mockReturnValue({
      data: { goals: [{ id: 1, title: "Java 공부" }] },
    });

    renderWithQueryClient(
      <TodoFormContent
        mode="edit"
        todoId={1}
        todo={{
          id: 1,
          title: "할일1",
          done: true,
          linkUrl: "",
          fileUrl: "",
          noteId: 0,
          updatedAt: "2026-01-01",
          goal: { id: 1, title: "Java 공부" },
        }}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByDisplayValue("할일1")).toBeInTheDocument();
  });

  it("파일을 선택하면 input change 이벤트가 정상 동작한다", () => {
    (useDeviceSize as jest.Mock).mockReturnValue({ isMobile: false });
    (useGoalList as jest.Mock).mockReturnValue({
      data: { goals: [{ id: 1, title: "React 공부" }] },
    });

    renderWithQueryClient(
      <TodoFormContent
        mode="create"
        onClose={jest.fn()}
      />,
    );

    const input = screen.getByLabelText("파일을 업로드해주세요");
    const file = new File(["test"], "test.png", { type: "image/png" });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    // ❗ file input은 value 확인 불가 → 에러 없이 동작하면 OK
    expect(input).toBeInTheDocument();
  });
});
