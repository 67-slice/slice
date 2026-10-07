import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNoteQuery } from "@/hooks/queries/notes";
import NoteDetailContent from "@/app/(protected)/notes/_components/NoteDetailContent";
import { renderWithQueryClient } from "tests/test-utils";

jest.mock("@/hooks/queries/notes");

describe("NoteDetailContent", () => {
  const setup = (noteId = 1, options?: { hasLink?: boolean }) => {
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
      linkUrl:
        options?.hasLink === false
          ? null
          : "https://ko.wikipedia.org/wiki/자바스크립트",
      linkMetadata:
        options?.hasLink === false
          ? null
          : {
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
      teamId: "team-1",
      userId: 1,
    };

    jest.mocked(useNoteQuery).mockReturnValue({
      data: mockNote,
    } as unknown as ReturnType<typeof useNoteQuery>);

    renderWithQueryClient(<NoteDetailContent noteId={noteId} />);

    return {
      mockNote,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("기본 UI 렌더링", () => {
    it("노트 제목이 표시된다", () => {
      setup();

      const title = screen.getByText("첫 번째 노트");
      expect(title).toBeInTheDocument();
    });

    it("목표와 할일 정보가 표시된다", () => {
      setup();

      const goalTitle = screen.getByText("목표 1");
      const todoTitle = screen.getByText("할 일 1");

      expect(goalTitle).toBeInTheDocument();
      expect(todoTitle).toBeInTheDocument();
    });
  });

  describe("링크 기능", () => {
    it("링크 미리보기가 표시된다", () => {
      setup();

      const linkTitle = screen.getByText("자바스크립트 - 위키백과");
      expect(linkTitle).toBeInTheDocument();
    });

    it("링크 미리보기 클릭 시 임베드가 열린다", async () => {
      const user = userEvent.setup();
      setup();

      const linkPreview = screen.getByText("자바스크립트 - 위키백과");
      await user.click(linkPreview);

      const iframe = screen.getByTitle("자바스크립트 - 위키백과");
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute(
        "src",
        "https://ko.wikipedia.org/wiki/자바스크립트",
      );
    });

    it("임베드 닫기 버튼 클릭 시 임베드가 닫힌다", async () => {
      const user = userEvent.setup();
      setup();

      const linkPreview = screen.getByText("자바스크립트 - 위키백과");
      await user.click(linkPreview);

      const closeButton = screen.getByLabelText("닫기");
      await user.click(closeButton);

      const iframe = screen.queryByTitle("자바스크립트 - 위키백과");
      expect(iframe).not.toBeInTheDocument();
    });

    it("링크가 없으면 링크 미리보기가 표시되지 않는다", () => {
      setup(1, { hasLink: false });

      const linkPreview = screen.queryByText("자바스크립트 - 위키백과");
      expect(linkPreview).not.toBeInTheDocument();
    });
  });
});
