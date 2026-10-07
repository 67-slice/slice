import { validateName } from "@/utils/validation/fields/validateName";

describe("이름 유효성 검사", () => {
  it("비어 있으면 에러 메시지를 반환한다", () => {
    const value = "";
    const result = validateName(value);
    expect(result).toBe("이름을 입력해주세요.");
  });

  it("공백만 있으면 에러 메시지를 반환한다", () => {
    const value = "   ";
    const result = validateName(value);
    expect(result).toBe("이름을 입력해주세요.");
  });

  it("2자 미만이면 에러 메시지를 반환한다", () => {
    const value = "슬";
    const result = validateName(value);
    expect(result).toBe("이름은 최소 2자 이상이어야 합니다.");
  });

  it("10자를 초과하면 에러 메시지를 반환한다", () => {
    const value = "슬라이스는할일관리투두앱서비스입니다";
    const result = validateName(value);
    expect(result).toBe("이름은 10자를 초과할 수 없습니다.");
  });

  it("모든 조건을 만족하면 빈 문자열을 반환한다", () => {
    const value = "슬라이스";
    const result = validateName(value);
    expect(result).toBe("");
  });
});
