import { SignupFormValues } from "@/types/authForm";
import { validateSignup } from "@/utils/validation/forms/validateSignup";

const createValues = (
  override: Partial<SignupFormValues> = {},
): SignupFormValues => ({
  name: "슬라이스",
  email: "test@example.com",
  password: "abc12345!",
  confirmPassword: "abc12345!",
  ...override,
});

describe("회원가입 유효성 검사", () => {
  it("이름이 비어 있으면 name 에러를 반환한다", () => {
    const values = createValues({ name: "" });
    const errors = validateSignup(values);
    expect(errors.name).toBe("이름을 입력해주세요.");
  });

  it("이메일이 잘못되면 email 에러를 반환한다", () => {
    const values = createValues({ email: "invalid-email" });
    const errors = validateSignup(values);
    expect(errors.email).toBe("올바른 이메일 형식이 아닙니다.");
  });

  it("비밀번호가 약하면 password 에러를 반환한다", () => {
    const values = createValues({ password: "1234", confirmPassword: "1234" });
    const errors = validateSignup(values);
    expect(errors.password).toBe("비밀번호는 8자 이상이어야 합니다.");
  });

  it("비밀번호 확인이 비어 있으면 confirmPassword 에러를 반환한다", () => {
    const values = createValues({ confirmPassword: "" });
    const errors = validateSignup(values);
    expect(errors.confirmPassword).toBe("비밀번호를 한 번 더 입력해주세요.");
  });

  it("비밀번호와 비밀번호 확인이 다르면 confirmPassword 에러를 반환한다", () => {
    const values = createValues({
      password: "abc12345!",
      confirmPassword: "abc12345?",
    });
    const errors = validateSignup(values);
    expect(errors.confirmPassword).toBe("비밀번호가 일치하지 않습니다.");
  });

  it("모든 값이 유효하면 errors 객체는 비어 있어야 한다", () => {
    const values = createValues();
    const errors = validateSignup(values);
    expect(errors).toEqual({});
  });
});
