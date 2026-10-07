import ListItemButton from "@/components/common/list/list-button/ListItemButton";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ListItemButton", () => {
  it("버튼을 클릭하면 onClick이 호출된다", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <ListItemButton
        icon={<span>icon</span>}
        ariaLabel="테스트 버튼"
        onClick={handleClick}
      />,
    );

    await user.click(screen.getByRole("button", { name: "테스트 버튼" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
