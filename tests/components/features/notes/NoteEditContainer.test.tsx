import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "@/lib/toast";
import {
  useNoteQuery,
  useUpdateNoteMutation,
  useLinkMetadataMutation,
} from "@/hooks/queries/notes";
import NoteEditContainer from "@/app/(protected)/notes/_components/NoteEditContainer";
import { renderWithQueryClient } from "tests/test-utils";
import { localStorageMock } from "tests/mocks/localStorageMock";

const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

jest.mock("@/lib/toast");
jest.mock("@/hooks/queries/notes");

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("NoteEditContainer", () => {
  const setup = (noteId = 1) => {
    const mockNote = {
      id: 1,
      title: "첫 번째 노트",
      content: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "첫 번째 노트 내용" }],
          },
        ],
      }),
      linkUrl: "https://ko.wikipedia.org/wiki/자바스크립트",
      linkMetadata: {
        url: "https://ko.wikipedia.org/wiki/자바스크립트",
        title: "자바스크립트 - 위키백과",
        description:
          "자바스크립트는 객체 기반의 스크립트 프로그래밍 언어입니다.",
        image: null,
      },
      todo: {
        id: 1,
        title: "할 일 1",
        done: false,
        fileUrl: null,
        linkUrl: null,
      },
      goal: {
        id: 1,
        title: "목표 1",
      },
      createdAt: "2026-01-18T09:00:00Z",
      updatedAt: "2026-01-18T10:00:00Z",
      teamId: "team-5",
      userId: 1,
    };

    const mockUpdateMutation = jest.fn();
    const mockLinkMetadataMutation = jest.fn();

    jest.mocked(useNoteQuery).mockReturnValue({
      data: mockNote,
    } as unknown as ReturnType<typeof useNoteQuery>);

    jest.mocked(useUpdateNoteMutation).mockReturnValue({
      mutate: mockUpdateMutation,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateNoteMutation>);

    jest.mocked(useLinkMetadataMutation).mockReturnValue({
      mutate: mockLinkMetadataMutation,
    } as unknown as ReturnType<typeof useLinkMetadataMutation>);

    renderWithQueryClient(<NoteEditContainer noteId={noteId} />);

    return {
      mockNote,
      mockUpdateMutation,
      mockLinkMetadataMutation,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe("기본 UI 렌더링", () => {
    it("제목 입력 필드에 기존 제목이 표시된다", () => {
      setup();

      const titleInput =
        screen.getByPlaceholderText("노트의 제목을 입력해주세요");
      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toHaveValue("첫 번째 노트");
    });

    it("수정하기 버튼이 활성화되어 있다", () => {
      setup();

      const desktopButton = screen.getByRole("button", { name: "수정하기" });
      const mobileButton = screen.getByRole("button", { name: "수정" });

      expect(desktopButton).toBeEnabled();
      expect(mobileButton).toBeEnabled();
    });
  });

  describe("입력 동작", () => {
    it("제목 수정 시 변경된 값이 정상 반영된다", async () => {
      const user = userEvent.setup();
      setup();

      const titleInput = screen.getByDisplayValue("첫 번째 노트");

      await user.clear(titleInput);
      await user.type(titleInput, "수정된 첫 번째 노트");

      expect(titleInput).toHaveValue("수정된 첫 번째 노트");
    });

    it("링크 수정 시 변경된 URL로 메타데이터 fetch가 호출된다", async () => {
      const user = userEvent.setup();
      const { mockLinkMetadataMutation } = setup();

      const linkButtons = screen.getAllByRole("button", {
        name: "링크 업로드",
      });
      await user.click(linkButtons[0]);

      const urlInput = screen.getByDisplayValue(
        "https://ko.wikipedia.org/wiki/자바스크립트",
      );

      await user.clear(urlInput);
      await user.type(
        urlInput,
        "https://developer.mozilla.org/ko/docs/Web/JavaScript",
      );

      const confirmButton = screen.getByRole("button", { name: "확인" });
      await user.click(confirmButton);

      expect(mockLinkMetadataMutation).toHaveBeenCalledWith(
        "https://developer.mozilla.org/ko/docs/Web/JavaScript",
        expect.any(Object),
      );
    });
  });

  describe("임시저장 기능", () => {
    it("임시저장 버튼 클릭 시 localStorage에 저장된다", async () => {
      const user = userEvent.setup();
      setup();

      const titleInput = screen.getByDisplayValue("첫 번째 노트");
      await user.clear(titleInput);
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

      const titleInput = screen.getByDisplayValue("첫 번째 노트");
      await user.clear(titleInput);
      await user.type(titleInput, "임시저장 테스트");

      const draftButtons = screen.getAllByRole("button", { name: "임시저장" });
      await user.click(draftButtons[0]);

      expect(toast.success).toHaveBeenCalledWith("임시 저장이 완료되었습니다", {
        hasTime: true,
      });
    });
  });

  describe("노트 수정 기능", () => {
    const mockNoteContent = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "수정된 노트 내용" }],
        },
      ],
    });

    it("수정 성공 시 toast 메시지가 표시된다", () => {
      const { mockUpdateMutation } = setup();

      mockUpdateMutation.mockImplementation((data, { onSuccess }) => {
        onSuccess({
          id: 1,
          ...data,
        });
      });

      mockUpdateMutation(
        {
          noteId: 1,
          data: {
            title: "수정된 첫 번째 노트",
            content: mockNoteContent,
            linkUrl: "https://developer.mozilla.org/ko/docs/Web/JavaScript",
          },
        },
        {
          onSuccess: () => {
            toast.success("노트가 수정되었습니다.");
          },
        },
      );

      expect(toast.success).toHaveBeenCalledWith("노트가 수정되었습니다.");
    });

    it("수정 실패 시 에러 toast가 표시된다", () => {
      const { mockUpdateMutation } = setup();

      mockUpdateMutation.mockImplementation((data, { onError }) => {
        onError(new Error("Network error"));
      });

      mockUpdateMutation(
        {
          noteId: 1,
          data: {
            title: "수정된 첫 번째 노트",
            content: mockNoteContent,
            linkUrl: "https://developer.mozilla.org/ko/docs/Web/JavaScript",
          },
        },
        {
          onError: () => {
            toast.error("노트 수정에 실패했습니다.");
          },
        },
      );

      expect(toast.error).toHaveBeenCalledWith("노트 수정에 실패했습니다.");
    });
  });
});
