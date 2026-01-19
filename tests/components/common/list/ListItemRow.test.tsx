import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ListItemRow from "@/components/common/list/list-item/ListItemRow";
import { ListActionType } from "@/components/common/list/list-item-actions/types";

jest.mock("@/components/common/checkbox/Checkbox", () => {
  const MockListToggleChecked = ({
    checked,
    onToggleChecked,
  }: {
    checked: boolean;
    onToggleChecked: (checked: boolean) => void;
  }) => (
    <input
      type="checkbox"
      data-testid="checkbox"
      checked={checked}
      onChange={(e) => onToggleChecked(e.target.checked)}
    />
  );

  MockListToggleChecked.displayName = "MockListToggleChecked";

  return MockListToggleChecked;
});

jest.mock("@/components/common/list/list-item-actions/ListItemActions", () => {
  const MockListItemActions = ({
    actions = [],
  }: {
    actions?: ListActionType[];
  }) => (
    <div data-testid="actions">
      {actions.map((action) => action.type).join(",")}
    </div>
  );

  MockListItemActions.displayName = "MockListItemActions";

  return MockListItemActions;
});
describe("ListItemRow 컴포넌트", () => {
  it("체크박스를 클릭하면 onToggleChecked가 호출된다", async () => {
    const user = userEvent.setup();
    const onToggleChecked = jest.fn();

    render(
      <ListItemRow
        item={{ id: 1, label: "할 일", checked: false }}
        onToggleChecked={onToggleChecked}
        variant="default"
      />,
    );

    await user.click(screen.getByTestId("checkbox"));

    expect(onToggleChecked).toHaveBeenCalledWith(1, true);
  });

  it("item에 link, file, note가 있으면 actions가 생성된다", () => {
    render(
      <ListItemRow
        item={{
          id: 1,
          label: "할 일",
          checked: false,
          link: true,
          file: true,
          note: true,
        }}
        onToggleChecked={jest.fn()}
        variant="default"
      />,
    );

    expect(screen.getByTestId("actions")).toHaveTextContent(
      "link,file,note,more",
    );
  });
});
