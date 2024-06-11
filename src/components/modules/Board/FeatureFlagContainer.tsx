"use client";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { BoardData } from "./FeatureFlagBoard";
import { Button } from "../../ui/button";
import { Draggable, Droppable } from "@hello-pangea/dnd";

type ContainerActions = {
  onDelete: (id: string) => void;
};

export default function FeatureFlagContainer({
  id,
  name,
  flags,
  canDelete,
  onDelete,
}: BoardData & ContainerActions) {
  return (
    <Droppable droppableId={id}>
      {(prov) => (
        <Card
          ref={prov.innerRef}
          {...prov.droppableProps}
          className=" w-72 h-[calc(100vh-160px)] overflow-y-auto"
        >
          <CardHeader>
            <CardTitle className="flex text-lg justify-between items-center">
              <div>
                {name} {flags.length}
              </div>
              {canDelete && (
                <Button
                  onClick={() => onDelete(id)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash width={15} />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {flags.map((flag, index) => (
              <Draggable draggableId={flag.name} key={flag.name} index={index}>
                {(prov) => (
                  <Alert
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    key={flag.name}
                  >
                    <AlertTitle
                      {...prov.dragHandleProps}
                      className="break-words"
                    >
                      {flag.name}
                    </AlertTitle>
                    <AlertDescription>{flag.description}</AlertDescription>
                  </Alert>
                )}
              </Draggable>
            ))}
          </CardContent>
          {prov.placeholder}
        </Card>
      )}
    </Droppable>
  );
}
