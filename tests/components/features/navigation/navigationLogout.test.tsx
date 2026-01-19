import NavigationLogout from "@/app/(protected)/_components/navigation/_components/NavigationLogout";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithQueryClient } from "tests/test-utils";

const logoutFnMock = jest.fn();
jest.mock("@/hooks/queries/auth/useLogout", () => ({
  useLogout: () => logoutFnMock,
}));

describe("NavigationLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("로그아웃 버튼 클릭 시 logout을 호출한다", () => {
    renderWithQueryClient(<NavigationLogout />);

    const btn = screen.getByRole("button", { name: /로그아웃/i });
    fireEvent.click(btn);

    expect(logoutFnMock).toHaveBeenCalledTimes(1);
  });
});
