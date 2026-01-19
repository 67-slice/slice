import { validateEmail } from "@/utils/validation/fields/validateEmail";

describe("이메일 유효성 검사", () => {
  it("이메일이 비어 있으면 에러 메시지를 반환한다", () => {
    const value = "";
    const result = validateEmail(value);
    expect(result).toBe("이메일을 입력해주세요.");
  });

  it("공백만 있는 경우 에러 메시지를 반환한다", () => {
    const value = "  ";
    const result = validateEmail(value);
    expect(result).toBe("이메일을 입력해주세요.");
  });

  it("형식이 올바르지 않으면 에러 메시지를 반환한다", () => {
    const value = "abc";
    const result = validateEmail(value);
    expect(result).toBe("올바른 이메일 형식이 아닙니다.");
  });

  it("올바른 이메일이면 빈 문자열을 반환한다", () => {
    const value = "test@example.com";
    const result = validateEmail(value);
    expect(result).toBe("");
  });
});
