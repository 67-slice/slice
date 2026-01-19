import { render, screen } from "@testing-library/react";
import Progress from "@/components/progress/Progress";

describe("Progress 공통 컴포넌트", () => {
  it("percent가 0이면 0%가 표시된다", () => {
    render(
      <Progress
        percent={0}
        variant="large"
        title="테스트 진행도"
      />,
    );

    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it("percent가 64이면 64가 표시된다", () => {
    render(
      <Progress
        percent={64}
        variant="large"
        title="테스트 진행도"
      />,
    );

    expect(screen.getByText(/64/)).toBeInTheDocument();
  });

  it("title이 정상적으로 렌더링된다", () => {
    render(
      <Progress
        percent={30}
        variant="large"
        title="다슬님의 진행도는"
      />,
    );

    expect(screen.getByText("다슬님의 진행도는")).toBeInTheDocument();
  });
});
