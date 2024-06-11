"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BoardData } from "./FeatureFlagBoard";
import type { DropResult } from "@hello-pangea/dnd";

type BoardStore = {
  _rehydrated: boolean;
  boards: BoardData[];
  addBoard: (board: BoardData) => void;
  deleteBoard: (id: string) => void;
  onBoardDrag: (event: DropResult) => void;
};

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const createBoardStore = (initialBoard: BoardData) =>
  create(
    persist<BoardStore>(
      (set, get) => ({
        _rehydrated: false,
        boards: (() => [initialBoard])(),
        addBoard: (board) =>
          set(({ boards }) => ({
            boards: [...boards, board],
          })),
        deleteBoard: (id) =>
          set((state) => {
            state.boards
              .find((board) => board.id === id)
              ?.flags.forEach((flag) => {
                state.boards[0].flags.push(flag);
              });
            return { boards: state.boards.filter((board) => board.id !== id) };
          }),
        onBoardDrag: (event: DropResult) => {
          if (!event.destination) return;

          const boardsClone = get().boards;

          //order on same column
          if (event.destination.droppableId === event.source.droppableId) {
            const findIndex = boardsClone.findIndex(
              (board) => board.id === event.destination?.droppableId
            );

            const activeBoard = boardsClone[findIndex];

            const reorderedBoardItems = reorder(
              activeBoard?.flags ?? [],
              event.source.index,
              event.destination.index
            );

            set(({ boards }) => {
              if (activeBoard) {
                activeBoard.flags = reorderedBoardItems;
                boards[findIndex] = activeBoard;
                return { boards: [...boards] };
              }

              return { boards };
            });
          } else {
            const sourceBoardIndex = boardsClone.findIndex(
              (board) => board.id === event.source.droppableId
            );
            const destinationBoardIndex = boardsClone.findIndex(
              (board) => board.id === event.destination?.droppableId
            );

            const startIndex = event.source.index;
            const endIndex = event.destination.index;

            const sourceBoardData = boardsClone[sourceBoardIndex];
            const destinationBoardData = boardsClone[destinationBoardIndex];

            const [removed] = sourceBoardData.flags.splice(startIndex, 1);
            destinationBoardData.flags.splice(endIndex, 0, removed);

            set(({ boards }) => {
              boards[sourceBoardIndex] = sourceBoardData;
              boards[destinationBoardIndex] = destinationBoardData;
              return { boards };
            });
          }
        },
      }),
      {
        name: "board-store",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          if (state) {
            syncBoardStore(state, initialBoard);
            state._rehydrated = true;
          }
        },
      }
    )
  );

export function syncBoardStore(state: BoardStore, initialBoard: BoardData) {
  const allFlags = state?.boards.flatMap((board) => board.flags);
  const serverFlags = initialBoard.flags;

  // check if there are new flags from the server
  if (allFlags && serverFlags) {
    const diffServerCurrent = serverFlags.filter(
      (serverFlag) => !allFlags.some((flag) => flag.name === serverFlag.name)
    );

    //if there are new flags or changed name of flags they go back to backlog
    if (diffServerCurrent.length > 0) {
      state.boards[0].flags = [...state.boards[0].flags, ...diffServerCurrent];
    }

    // check if there are flags that were deleted from the server
    const diffCurrentServer = allFlags.filter(
      (flag) => !serverFlags.some((serverFlag) => serverFlag.name === flag.name)
    );

    if (diffCurrentServer.length > 0) {
      state.boards.forEach((board) => {
        board.flags = board.flags.filter(
          (flag) =>
            !diffCurrentServer.some(
              (deletedFlag) => deletedFlag.name === flag.name
            )
        );
      });
    }
  }
}
