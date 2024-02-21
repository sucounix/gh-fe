import React, { useEffect } from "react";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SingleItem from "./SingleItem";

const Section = ({
  cardsData,
  dataTestId,
  classificationData,
  classificationLoading,
  disabled,
  sectionIndex,
  handleActiveSectionDrag,
  setCurrentItemChanged,
  currentItemChange,
  updateItemPriority,
  updateItemClassification,
}) => {
  const [state, handlers] = useListState(cardsData);

  useEffect(() => {
    handlers.setState(cardsData);
  }, [cardsData]);

  const items =
    state.length > 0 &&
    state.map((item, index) => (
      <Draggable
        key={JSON.stringify(item.priority)}
        index={index}
        draggableId={JSON.stringify(item.priority)}
      >
        {(provided, snapshot) => (
          <SingleItem
            provided={provided}
            snapshot={snapshot}
            item={item}
            index={index}
            classificationData={classificationData}
            classificationLoading={classificationLoading}
            disabled={disabled}
            setCurrentItemChanged={setCurrentItemChanged}
            handleNewClassifySelected={handleNewClassifySelected}
          />
        )}
      </Draggable>
    ));

  const handleNewClassifySelected = (newClassification) => {
    updateItemClassification(currentItemChange.uuid, newClassification.code);
  };

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        handleActiveSectionDrag(-1);
        if (destination) {
          let destinationIndex =
            destination?.index === 0
              ? 0
              : source.index > destination.index
              ? destination.index
              : destination.index + 1;
          if (currentItemChange)
            updateItemPriority(currentItemChange.uuid, destinationIndex);
        }
        handlers.reorder({
          from: source.index,
          to: destination?.index || 0,
        });
        setCurrentItemChanged(null);
      }}
      onDragStart={(item) => {
        setCurrentItemChanged(cardsData[item.source.index]);
        // all sections will be disables except this {sectionIndex}
        handleActiveSectionDrag(sectionIndex);
      }}
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default Section;
