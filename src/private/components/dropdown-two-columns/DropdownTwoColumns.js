import React, { useState, useRef, useEffect } from "react";
import { Loader, Flex } from "@mantine/core";

import "./DropdownTwoColumns.css";

const DropdownTwoColumns = ({
  labelComponent,
  classificationLoading,
  data,
  handleNewClassifySelected,
}) => {
  const ref = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [firstColumnSelected, setFirstColumnSelected] = useState(null);

  const [secondColumn, setSecondColumn] = useState([]);
  const [selectedView, setSelectedView] = useState(null);

  useEffect(() => {
    setSelectedView(null);
    if (data && data.length > 0) {
      setFirstColumnSelected(data[0]);
    }
  }, [showPopup]);

  useEffect(() => {
    // if the selected item has items
    // will save all items in {secondColumn} state
    if (firstColumnSelected && firstColumnSelected.items.length > 0) {
      let arr = [];
      for (let i = 0; i < firstColumnSelected.items.length; i++) {
        if (firstColumnSelected.items[i].name) {
          arr.push({
            name: firstColumnSelected.items[i].name,
            code: firstColumnSelected.items[i].code,
          });
        }
      }
      setSecondColumn(arr);
    } else {
      setSecondColumn([]);
    }
  }, [firstColumnSelected]);

  // when select new view
  // should render it's section items

  useEffect(() => {
    // when click outside the component it should hide
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPopup(false);
        clearSelectedOptions();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setShowPopup]);

  const handleFirstColumnSelected = (group) => {
    setFirstColumnSelected(group);
  };

  const handleSelectedView = (view) => {
    setSelectedView(view);
    handleNewClassifySelected(view);
    setShowPopup(false);
  };

  const clearSelectedOptions = () => {
    setFirstColumnSelected(null);
    setSelectedView(null);
  };

  return (
    <div className="DropdownTwoColumns" data-testid="DropdownTwoColumns">
      <div
        onClick={() => {
          setShowPopup(true);
        }}
        className="label__component"
        data-testid="label__component"
      >
        {labelComponent}
      </div>
      {showPopup && (
        <div ref={ref} className="popup__div" data-testid="popup__div">
          {classificationLoading || !data ? (
            <Flex
              align={"center"}
              justify="center"
              h="100%"
              mt="10%"
              data-testid={"loader_dropdown_two_columns"}
            >
              <Loader />
            </Flex>
          ) : (
            <>
              <div className="title__div">
                <p>Select something</p>
              </div>
              <div className="options__div">
                <div className="first__column">
                  {data.length > 0 &&
                    data.map((group, groupIndex) => {
                      return (
                        <p
                          key={`group_${groupIndex}`}
                          onClick={() => {
                            handleFirstColumnSelected(group, groupIndex);
                          }}
                          className={
                            firstColumnSelected &&
                            firstColumnSelected.name === group.name
                              ? "selected__option"
                              : "normal__option"
                          }
                          data-testid={`first_column_${groupIndex}`}
                        >
                          {group.name}
                        </p>
                      );
                    })}
                </div>

                {secondColumn.length > 0 ? (
                  <div className="sub__group__div">
                    {secondColumn.map((view, viewIndex) => {
                      return (
                        <p
                          key={`view_${viewIndex}`}
                          onClick={() => {
                            handleSelectedView(view);
                          }}
                          className={
                            selectedView && selectedView.name === view.name
                              ? "selected__option"
                              : "normal__option"
                          }
                          data-testid={`second_column_${viewIndex}`}
                        >
                          {view.name}
                        </p>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default DropdownTwoColumns;
