import { render, screen } from "@testing-library/react";
import ListItem from "@/components/common/list/list-item/ListItem";

jest.mock("@/components/common/list/list-item/ListItemRow", () =>
  jest.fn(() => <li data-testid="list-item-row" />),
);

describe("ListItem 컴포넌트", () => {
  it("items 개수만큼 ListItemRow를 렌더링한다", () => {
    render(
      <ListItem
        items={[
          { id: 1, label: "할 일 1", checked: false },
          { id: 2, label: "할 일 2", checked: true },
        ]}
        onToggleChecked={jest.fn()}
      />,
    );

    expect(screen.getAllByTestId("list-item-row")).toHaveLength(2);
  });

  it("items가 비어 있어도 에러 없이 렌더링된다", () => {
    render(
      <ListItem
        items={[]}
        onToggleChecked={jest.fn()}
      />,
    );

    expect(screen.queryAllByTestId("list-item-row")).toHaveLength(0);
  });
});
