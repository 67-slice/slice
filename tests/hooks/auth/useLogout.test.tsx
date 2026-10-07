import { useLogout } from "@/hooks/queries/auth";
import { act, renderHook } from "@testing-library/react";
import { createQueryClientWrapper } from "tests/test-utils";

type AuthStoreState = {
  clearUser: () => void;
};

const replaceMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

const clearUserMock = jest.fn();
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: function <T>(selector: (state: AuthStoreState) => T): T {
    return selector({ clearUser: clearUserMock });
  },
}));

describe("useLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    }  as unknown as Response);
  });

  afterEach(() => {
    (global.fetch as jest.Mock | undefined)?.mockRestore?.();
  });

  it("로그아웃 시 토큰/유저를 정리하고 auth 쿼리를 제거한 뒤 /login으로 이동한다", async () => {
    const wrapper = createQueryClientWrapper();

    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await result.current();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/logout",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );
    expect(clearUserMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith("/login");
  });
});
