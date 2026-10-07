"use client";

import { useState } from "react";
import { useDeleteMutation } from "@/hooks/queries/todos/useDeleteMutation";
import { useDropdown } from "@/hooks/useDropdown";
import { useRouter } from "next/navigation";
import { DropdownItem } from "../../dropdown/Dropdown";
import { Todo } from "@/api/types/todo";
import { ActionType, ListActionType, ListItemVariant } from "./types";
import { KebabActionButton } from "./_components/kebabActionButton";
import DropdownPortal from "../../dropdown/dropdown-portal/DropdownPortal";
import { ListItemActionModals } from "./_components/ListItemActionModals";
import { ListItemIconActions } from "./_components/ListItemActionIcons";

type ListItemActionsProps = {
  id: number;
  todo?: Todo;
  variant?: ListItemVariant;
  actions?: ListActionType[];
};

export default function ListItemActions({
  id,
  todo,
  variant = "default",
  actions = [],
}: ListItemActionsProps) {
  const {
    open: dropdownOpen,
    toggle: toggleDropdown,
    close: closeDropdown,
    triggerRef,
  } = useDropdown<HTMLDivElement>();

  const deleteTodo = useDeleteMutation();
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  if (!actions.length) return null;

  const iconActions = actions.filter(
    (action): action is { type: ActionType } => action.type !== "more",
  );

  const hasMore = actions.some((action) => action.type === "more");

  const noteId = todo?.noteId;
  const dropdownItems: DropdownItem[] = [
    {
      text: noteId ? "노트 수정하기" : "노트 작성하기",
      onClick: () => {
        console.log("todo:", todo);
        if (noteId) {
          router.push(`/notes/${noteId}/edit`);
          return;
        }
        router.push(`/notes/new/${id}`);
        closeDropdown();
      },
    },
    {
      text: "수정하기",
      onClick: () => {
        closeDropdown();
        setEditOpen(true);
      },
    },
    {
      text: "삭제하기",
      onClick: () => {
        closeDropdown();
        setConfirmOpen(true);
      },
    },
  ];

  const onClickMore = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchorRect(rect);
    toggleDropdown();
  };

  return (
    <>
      <div className="relative ml-auto flex max-w-fit shrink-0 items-center justify-end">
        <ListItemIconActions
          todo={todo}
          actions={iconActions}
          variant={variant}
        />

        {hasMore && (
          <KebabActionButton
            variant={variant}
            toggleDropdown={onClickMore}
            triggerRef={triggerRef}
          />
        )}

        {dropdownOpen && anchorRect && (
          <DropdownPortal
            anchorRect={anchorRect}
            items={dropdownItems}
            onClose={() => {
              setAnchorRect(null);
              closeDropdown();
            }}
          />
        )}
      </div>

      <ListItemActionModals
        todo={todo}
        editOpen={editOpen}
        confirmOpen={confirmOpen}
        onCloseEdit={() => setEditOpen(false)}
        onCloseConfirm={() => setConfirmOpen(false)}
        onConfirmDelete={() => deleteTodo.mutate({ id })}
      />
    </>
  );
}
