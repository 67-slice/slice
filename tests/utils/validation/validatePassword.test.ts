import { validatePassword } from "../../../src/utils/validation/fields/validatePassword";

describe("비밀번호 유효성 검사", () => {
  it("비어 있으면 에러 메시지를 반환한다", () => {
    const value = "";
    const result = validatePassword(value);
    expect(result).toBe("비밀번호를 입력해주세요.");
  });
  it("8자 미만이면 에러 메시지를 반환한다", () => {
    const value = "abc123!";
    const result = validatePassword(value);
    expect(result).toBe("비밀번호는 8자 이상이어야 합니다.");
  });

  it("숫자가 없으면 에러 메시지를 반환한다", () => {
    const value = "abcdefg!";
    const result = validatePassword(value);
    expect(result).toBe("비밀번호에 숫자가 포함되어야 합니다.");
  });

  it("특수문자가 없으면 에러 메시지를 반환한다", () => {
    const value = "abcdefg1";
    const result = validatePassword(value);
    expect(result).toBe("비밀번호에 특수문자가 포함되어야 합니다.");
  });

  it("공백이 포함되면 에러 메시지를 반환한다", () => {
    const value = "abcdefg1 !";
    const result = validatePassword(value);
    expect(result).toBe("비밀번호에는 공백이 포함될 수 없습니다.");
  });

  it("모든 조건을 만족하면 빈 문자열을 반환한다", () => {
    const value = "abcdefg12!";
    const result = validatePassword(value);
    expect(result).toBe("");
  });
});
