import { render, screen, fireEvent } from "@testing-library/react";
import AttachmentSection from "@/app/(protected)/_components/todo-modal/_components/sections/AttachmentSection";
import { PaperClipIcon } from "@heroicons/react/24/outline";

describe("AttachmentSection - 파일 유효성 검사", () => {
  const renderComponent = (onChange = jest.fn()) => {
    render(
      <AttachmentSection
        type="file"
        value={null}
        placeholder="파일을 업로드해주세요"
        icon={<PaperClipIcon />}
        onChange={onChange}
      />,
    );
  };

  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("3MB 초과 파일은 alert를 띄우고 onChange를 호출하지 않는다", () => {
    const onChange = jest.fn();
    renderComponent(onChange);

    const input = screen.getByLabelText("파일을 업로드해주세요");

    const bigFile = new File(
      ["a".repeat(4 * 1024 * 1024)], // 4MB
      "big.png",
      { type: "image/png" },
    );

    fireEvent.change(input, {
      target: { files: [bigFile] },
    });

    expect(window.alert).toHaveBeenCalledWith(
      "3MB 이하의 파일만 업로드 할 수 있습니다.",
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("3MB 이하 파일은 정상적으로 onChange가 호출된다", () => {
    const onChange = jest.fn();
    renderComponent(onChange);

    const input = screen.getByLabelText("파일을 업로드해주세요");

    const smallFile = new File(
      ["a".repeat(1024 * 1024)], // 1MB
      "small.png",
      { type: "image/png" },
    );

    fireEvent.change(input, {
      target: { files: [smallFile] },
    });

    expect(window.alert).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(smallFile);
  });
});
