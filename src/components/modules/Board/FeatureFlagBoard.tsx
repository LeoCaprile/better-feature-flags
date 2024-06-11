"use client";
import { FeatureFlags } from "@/services/gitlab/types";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import FeatureFlagContainer from "./FeatureFlagContainer";
import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Input } from "../../ui/input";
import { nanoid } from "nanoid";
import { DragDropContext } from "@hello-pangea/dnd";
import { createBoardStore } from "./BoardStore";
import { Skeleton } from "@/components/ui/skeleton";

export interface BoardData {
  id: string;
  name: string;
  flags: FeatureFlags[];
  canDelete: boolean;
}

type FeatureFlagBoardProps = {
  initialBoardData: BoardData;
};

export default function FeatureFlagBoard({
  initialBoardData,
}: FeatureFlagBoardProps) {
  const useBoardStore = useMemo(
    () => createBoardStore(initialBoardData),
    [initialBoardData]
  );
  const { _rehydrated, boards, addBoard, onBoardDrag, deleteBoard } =
    useBoardStore();
  const [newBoardName, setNewBoardName] = useState<string>("");

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const boardName = e.target.value;
    setNewBoardName(boardName);
  }

  function handleBoardCreate() {
    addBoard({ id: nanoid(), flags: [], name: newBoardName, canDelete: true });
    setNewBoardName("");
  }

  return (
    <div className="flex gap-5">
      {_rehydrated ? (
        <>
          <DragDropContext onDragEnd={onBoardDrag}>
            {boards.map((board) => (
              <FeatureFlagContainer
                key={board.name}
                onDelete={deleteBoard}
                {...board}
              ></FeatureFlagContainer>
            ))}
          </DragDropContext>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-72">
                <PlusIcon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>New column</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input onChange={handleOnChange} aria-label="name" />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleBoardCreate}
                  disabled={!newBoardName}
                >
                  Create
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <>
          <Skeleton className="w-72 h-[calc(100vh-160px)]" />
          <Skeleton className="w-72 h-[calc(100vh-160px)]" />
        </>
      )}
    </div>
  );
}
