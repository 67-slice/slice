import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteList from "@/app/(protected)/notes/_components/NoteList";
import { Note } from "@/hooks/queries/notes";

describe("NoteList", () => {
  const mockNotes: Note[] = [
    {
      id: 1,
      title: "첫 번째 노트",
      todo: { id: 1, title: "할 일 1", done: false },
      updatedAt: "2026-01-15T10:00:00Z",
    },
    {
      id: 2,
      title: "두 번째 노트",
      todo: { id: 2, title: "할 일 2", done: true },
      updatedAt: "2026-01-16T10:00:00Z",
    },
  ];

  const mockOnEditNote = jest.fn();
  const mockOnDeleteNote = jest.fn();

  const renderNoteList = () => {
    return render(
      <NoteList
        notes={mockNotes}
        onEditNote={mockOnEditNote}
        onDeleteNote={mockOnDeleteNote}
      />,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("렌더링", () => {
    it("노트 목록이 화면에 렌더링된다", () => {
      renderNoteList();

      expect(screen.getByText("첫 번째 노트")).toBeInTheDocument();
      expect(screen.getByText("두 번째 노트")).toBeInTheDocument();
    });

    it("노트가 최신순으로 정렬된다", () => {
      renderNoteList();

      const articles = screen.getAllByRole("article");
      expect(articles[0]).toHaveTextContent("두 번째 노트");
      expect(articles[1]).toHaveTextContent("첫 번째 노트");
    });

    it("노트 클릭 시 상세 페이지로 이동하는 링크가 있다", () => {
      renderNoteList();

      const links = screen.getAllByRole("link");
      expect(links[0]).toHaveAttribute("href", "/notes/2");
      expect(links[1]).toHaveAttribute("href", "/notes/1");
    });
  });

  describe("사용자 인터랙션", () => {
    it("수정 버튼 클릭 시 onEditNote가 호출된다", async () => {
      const user = userEvent.setup();

      renderNoteList();

      const dropdownButtons = screen.getAllByLabelText("노트 옵션 메뉴");
      await user.click(dropdownButtons[0]);

      const editButton = screen.getByText("수정하기");
      await user.click(editButton);

      expect(mockOnEditNote).toHaveBeenCalledWith(2);
      expect(mockOnEditNote).toHaveBeenCalledTimes(1);
    });

    it("삭제 버튼 클릭 시 onDeleteNote가 호출된다", async () => {
      const user = userEvent.setup();

      renderNoteList();

      const dropdownButtons = screen.getAllByLabelText("노트 옵션 메뉴");
      await user.click(dropdownButtons[0]);

      const deleteButton = screen.getByText("삭제하기");
      await user.click(deleteButton);

      expect(mockOnDeleteNote).toHaveBeenCalledWith(2);
      expect(mockOnDeleteNote).toHaveBeenCalledTimes(1);
    });
  });
});
