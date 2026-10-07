import { LoginFormValues } from "@/types/authForm";
import { validateLogin } from "@/utils/validation/forms/validateLogin";

const createValues = (
  override: Partial<LoginFormValues> = {},
): LoginFormValues => ({
  email: "test@example.com",
  password: "abc12345!",
  ...override,
});

describe("로그인 유효성 검사", () => {
  it("이메일이 비어 있으면 email 에러를 반환한다", () => {
    const values = createValues({ email: "" });
    const errors = validateLogin(values);

    expect(errors.email).toBe("이메일을 입력해주세요.");
  });

  it("이메일이 잘못된 형식이면 email 에러를 반환한다", () => {
    const values = createValues({ email: "invalid-email" });
    const errors = validateLogin(values);

    expect(errors.email).toBe("올바른 이메일 형식이 아닙니다.");
  });

  it("비밀번호가 비어 있으면 password 에러를 반환한다", () => {
    const values = createValues({ password: "" });
    const errors = validateLogin(values);

    expect(errors.password).toBe("비밀번호를 입력해주세요.");
  });

  it("비밀번호가 너무 짧으면 password 에러를 반환한다", () => {
    const values = createValues({ password: "1234" });
    const errors = validateLogin(values);

    expect(errors.password).toBe("비밀번호는 8자 이상이어야 합니다.");
  });

  it("모든 값이 유효하면 errors 객체는 비어 있어야 한다", () => {
    const values = createValues();
    const errors = validateLogin(values);

    expect(errors).toEqual({});
  });
});
