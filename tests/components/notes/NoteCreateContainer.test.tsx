import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "@/lib/toast";
import { useTodoQuery } from "@/hooks/queries/todos";
import {
  useCreateNoteMutation,
  useLinkMetadataMutation,
} from "@/hooks/queries/notes";
import NoteCreateContainer from "@/app/(protected)/notes/_components/NoteCreateContainer";
import { renderWithQueryClient } from "tests/test-utils";
import { localStorageMock } from "tests/mocks/localStorageMock";

const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

jest.mock("@/lib/toast");
jest.mock("@/hooks/queries/todos");
jest.mock("@/hooks/queries/notes");

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("NoteCreateContainer", () => {
  const setup = (todoId = 1) => {
    const mockTodo = {
      goal: {
        id: 1,
        title: "목표 1",
      },
      title: "할 일 1",
      done: false,
      updatedAt: "2025-01-18T10:00:00Z",
    };

    const mockCreateNoteMutation = jest.fn();
    const mockLinkMetadataMutation = jest.fn();

    jest.mocked(useTodoQuery).mockReturnValue({
      data: mockTodo,
    } as unknown as ReturnType<typeof useTodoQuery>);

    jest.mocked(useCreateNoteMutation).mockReturnValue({
      mutate: mockCreateNoteMutation,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateNoteMutation>);

    jest.mocked(useLinkMetadataMutation).mockReturnValue({
      mutate: mockLinkMetadataMutation,
    } as unknown as ReturnType<typeof useLinkMetadataMutation>);

    renderWithQueryClient(<NoteCreateContainer todoId={todoId} />);

    return {
      mockTodo,
      mockCreateNoteMutation,
      mockLinkMetadataMutation,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe("기본 UI 렌더링", () => {
    it("제목 입력 필드가 비어 있다", () => {
      setup();

      const titleInput =
        screen.getByPlaceholderText("노트의 제목을 입력해주세요");
      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toHaveValue("");
    });

    it("등록하기 버튼이 비활성화되어 있다", () => {
      setup();

      const desktopButton = screen.getByRole("button", { name: "등록하기" });
      const mobileButton = screen.getByRole("button", { name: "등록" });

      expect(desktopButton).toBeDisabled();
      expect(mobileButton).toBeDisabled();
    });
  });

  describe("입력 동작", () => {
    it("제목 입력 시 값이 정상 반영된다", async () => {
      const user = userEvent.setup();
      setup();

      const titleInput =
        screen.getByPlaceholderText("노트의 제목을 입력해주세요");
      await user.type(titleInput, "첫 번째 노트");

      expect(titleInput).toHaveValue("첫 번째 노트");
    });

    it("링크 버튼 클릭 시 메타데이터 fetch가 호출된다", async () => {
      const user = userEvent.setup();
      const { mockLinkMetadataMutation } = setup();

      const linkButtons = screen.getAllByRole("button", {
        name: "링크 업로드",
      });
      await user.click(linkButtons[0]);

      const urlInput = screen.getByPlaceholderText("https://www.example.com");
      await user.type(urlInput, "https://ko.wikipedia.org/wiki/자바스크립트");

      const confirmButton = screen.getByRole("button", { name: "확인" });
      await user.click(confirmButton);

      expect(mockLinkMetadataMutation).toHaveBeenCalledWith(
        "https://ko.wikipedia.org/wiki/자바스크립트",
        expect.any(Object),
      );
    });
  });

  describe("임시저장 기능", () => {
    it("임시저장 버튼 클릭 시 localStorage에 저장된다", async () => {
      const user = userEvent.setup();
      setup();

      const titleInput =
        screen.getByPlaceholderText("노트의 제목을 입력해주세요");
      await user.type(titleInput, "임시저장 테스트");

      const draftButtons = screen.getAllByRole("button", { name: "임시저장" });
      await user.click(draftButtons[0]);

      const saved = localStorageMock.getItem("draft_note_1");
      expect(saved).toBeTruthy();

      const draft = JSON.parse(saved!);
      expect(draft.title).toBe("임시저장 테스트");
      expect(draft.todoId).toBe(1);
    });

    it("임시저장 버튼 클릭 시 toast 메시지가 표시된다", async () => {
      const user = userEvent.setup();
      setup();

      const titleInput =
        screen.getByPlaceholderText("노트의 제목을 입력해주세요");
      await user.type(titleInput, "임시저장 테스트");

      const draftButtons = screen.getAllByRole("button", { name: "임시저장" });
      await user.click(draftButtons[0]);

      expect(toast.success).toHaveBeenCalledWith("임시 저장이 완료되었습니다", {
        hasTime: true,
      });
    });
  });

  describe("노트 등록 기능", () => {
    const mockNoteContent = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "첫 번째 노트 내용" }],
        },
      ],
    });

    it("등록 성공 시 toast 메시지가 표시된다", () => {
      const { mockCreateNoteMutation } = setup();

      mockCreateNoteMutation.mockImplementation((data, { onSuccess }) => {
        onSuccess({
          id: 1,
          ...data,
        });
      });

      mockCreateNoteMutation(
        {
          todoId: 1,
          title: "첫 번째 노트",
          content: mockNoteContent,
        },
        {
          onSuccess: () => {
            toast.success("노트가 작성되었습니다.");
          },
        },
      );

      expect(toast.success).toHaveBeenCalledWith("노트가 작성되었습니다.");
    });
    it("등록 실패 시 에러 toast가 표시된다", () => {
      const { mockCreateNoteMutation } = setup();

      mockCreateNoteMutation.mockImplementation((data, { onError }) => {
        onError(new Error("Network error"));
      });

      mockCreateNoteMutation(
        {
          todoId: 1,
          title: "첫 번째 노트",
          content: mockNoteContent,
        },
        {
          onError: () => {
            toast.error("노트 등록에 실패했습니다.");
          },
        },
      );

      expect(toast.error).toHaveBeenCalledWith("노트 등록에 실패했습니다.");
    });
  });
});
