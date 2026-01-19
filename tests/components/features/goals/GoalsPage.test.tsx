import { deleteGoal, updateGoal } from "@/api/goal";
import GoalHeader from "@/app/(protected)/goals/[goalId]/_components/GoalHeader";
import GoalSection from "@/app/(protected)/goals/[goalId]/_components/GoalSection";
import { calcProgress } from "@/app/(protected)/goals/[goalId]/_utils/calcProgress";
import { EMPTY_MESSAGES } from "@/constants/messages";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQueryClient } from "tests/test-utils";

const push = jest.fn();
const replace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
  useParams: () => ({ goalId: "1" }),
}));

jest.mock("@/api/goal", () => ({
  updateGoal: jest.fn(),
  deleteGoal: jest.fn(),
}));

describe("목표 영역", () => {
  beforeEach(() => {
    push.mockClear();
    jest.clearAllMocks();
  });

  describe("드롭다운", () => {
    it("목표 카드의 드롭다운 메뉴가 열린다", async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<GoalHeader goalId={"1"} />);

      await user.click(screen.getByLabelText("goal-options"));

      expect(screen.getByText("수정하기")).toBeInTheDocument();
      expect(screen.getByText("삭제하기")).toBeInTheDocument();
    });
    it("목표 수정 중 취소를 누르면 수정 모드가 종료된다", async () => {
      const user = userEvent.setup();

      renderWithQueryClient(<GoalHeader goalId="1" />);

      await user.click(screen.getByLabelText("goal-options"));
      await user.click(screen.getByText("수정하기"));

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();

      await user.type(input, "할일");

      await user.click(screen.getByText("취소"));

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

      expect(updateGoal).not.toHaveBeenCalled();
    });

    it("목표를 수정하면 입력한 값으로 변경된다", async () => {
      const user = userEvent.setup();
      (updateGoal as jest.Mock).mockResolvedValueOnce({
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-02T00:00:00.000Z",
        title: "새 목표",
        id: 1,
        userId: 123,
        teamId: 456,
      });

      renderWithQueryClient(<GoalHeader goalId="1" />);
      await user.click(screen.getByLabelText("goal-options"));
      await user.click(screen.getByText("수정하기"));

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "새 목표");

      await user.click(screen.getByText("수정"));

      expect(await screen.findByText("새 목표")).toBeInTheDocument();

      expect(updateGoal).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: "새 목표",
        }),
      );
    });
    it("목표를 삭제하면 목표가 삭제가 된다", async () => {
      const user = userEvent.setup();

      (deleteGoal as jest.Mock).mockResolvedValueOnce({});

      renderWithQueryClient(<GoalHeader goalId="1" />);

      await user.click(screen.getByLabelText("goal-options"));
      await user.click(screen.getByText("삭제하기"));

      expect(screen.getByText("정말 삭제하시겠어요?")).toBeInTheDocument();

      await user.click(screen.getByText("확인"));
      expect(replace).toHaveBeenCalledWith(
        expect.stringContaining("dashboard"),
      );

      expect(deleteGoal).toHaveBeenCalled();
    });
  });
});

describe("진행도 영역", () => {
  it("완료 비율을 퍼센트로 계산한다", () => {
    expect(
      calcProgress([{ checked: true }, { checked: false }, { checked: true }]),
    ).toBe(67);
  });
});

describe("목표상세 Todo/done", () => {
  it("items가 Todo박스에 비어있으면 EmptyState를 보여준다", () => {
    render(
      <GoalSection
        title="TO DO"
        items={[]}
        onToggleChecked={jest.fn()}
      />,
    );
    expect(screen.getByText(EMPTY_MESSAGES.TODO.ALL)).toBeInTheDocument();
  });

  it("items가 Done박스에 비어있으면 EmptyState를 보여준다", () => {
    render(
      <GoalSection
        title="DONE"
        items={[]}
        onToggleChecked={jest.fn()}
      />,
    );
    expect(screen.getByText(EMPTY_MESSAGES.TODO.DONE)).toBeInTheDocument();
  });
});
