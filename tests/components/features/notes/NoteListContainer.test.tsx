import { screen } from "@testing-library/react";
import { useNotesQuery, useDeleteNoteMutation } from "@/hooks/queries/notes";
import NoteListContainer from "@/app/(protected)/notes/_components/NoteListContainer";
import { renderWithQueryClient } from "tests/test-utils";

jest.mock("@/hooks/queries/notes");

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("NoteListContainer", () => {
  const goalId = 1;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(useDeleteNoteMutation).mockReturnValue({
      mutate: jest.fn(),
    } as unknown as ReturnType<typeof useDeleteNoteMutation>);
  });

  describe("노트가 없을 때", () => {
    it("노트가 없으면 EmptyState를 렌더링한다", () => {
      jest.mocked(useNotesQuery).mockReturnValue({
        data: {
          totalCount: 0,
          nextCursor: null,
          goal: { id: goalId, title: "목표 1" },
          notes: [],
        },
      } as unknown as ReturnType<typeof useNotesQuery>);

      renderWithQueryClient(<NoteListContainer goalId={goalId} />);

      expect(screen.getByText("아직 등록된 노트가 없어요")).toBeInTheDocument();
    });
  });

  describe("노트가 있을 때", () => {
    it("GoalBanner와 NoteList를 렌더링한다", () => {
      jest.mocked(useNotesQuery).mockReturnValue({
        data: {
          totalCount: 1,
          nextCursor: null,
          goal: { id: goalId, title: "목표 1" },
          notes: [
            {
              id: 1,
              title: "첫 번째 노트",
              todo: { id: 1, title: "할 일 1", done: false },
              updatedAt: "2026-01-17T10:00:00Z",
            },
          ],
        },
      } as unknown as ReturnType<typeof useNotesQuery>);

      renderWithQueryClient(<NoteListContainer goalId={goalId} />);

      expect(screen.getByText("목표 1")).toBeInTheDocument();
      expect(screen.getByText("첫 번째 노트")).toBeInTheDocument();
    });
  });
});
