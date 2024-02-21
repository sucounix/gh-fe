import React, { useState, useRef, useEffect, useContext } from "react";
import { Input, Popover, Tooltip } from "@mantine/core";

import "./DropdownMultiColumns.css";

const DropdownMultiColumns = ({
  labelComponent,
  currentList,
  data,
  handleAddNewMetric,
  currentYAxisUnits,
}) => {
  const ref = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [FirstColumnSelected, setFirstColumnSelected] = useState(null);

  const [listOfViews, setListOfViews] = useState([]);
  const [LastColumnItems, setLastColumnItems] = useState([]);
  // it will save a copy to reset to the original values when clear the search value
  const [LastColumnItemsCopy, setLastColumnItemsCopy] = useState([]);

  const [selectedView, setSelectedView] = useState(null);
  const [selectedLastColumnItem, setSelectedLastColumnItem] = useState(null);

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSelectedLastColumnItem(null);
    if (data.length > 0) {
      setFirstColumnSelected(data[0]);
    }
  }, [data, showPopup]);

  useEffect(() => {
    // if the selected item has views
    // will save all views in {listOfViews} state
    if (FirstColumnSelected && FirstColumnSelected.children.length > 0) {
      let arr = [];
      for (let i = 0; i < FirstColumnSelected.children.length; i++) {
        if (FirstColumnSelected.children[i].name) {
          arr.push(FirstColumnSelected.children[i].name);
        }
      }

      setListOfViews(arr);
      // this means the selected item in the first column hasn't views
      if (FirstColumnSelected.children[0].name) {
        setSelectedView(FirstColumnSelected.children[0].name);
        setLastColumnItems(FirstColumnSelected.children[0].sections);
        setLastColumnItemsCopy(FirstColumnSelected.children[0].sections);
      } else {
        // will make the first view is selected by default
        // so can render the section items
        setSelectedView("");
        setLastColumnItems(FirstColumnSelected.children[0].sections);
        setLastColumnItemsCopy(FirstColumnSelected.children[0].sections);
      }
    } else {
      setListOfViews([]);
    }
    setSearchValue("");
  }, [FirstColumnSelected]);

  // when select new view
  // should render it's section items

  useEffect(() => {
    if (FirstColumnSelected && FirstColumnSelected.children.length > 0) {
      let currentView = FirstColumnSelected.children.findIndex((group) => {
        return group.name === selectedView;
      });
      if (currentView != -1) {
        setLastColumnItems(FirstColumnSelected.children[currentView].sections);
        setLastColumnItemsCopy(
          FirstColumnSelected.children[currentView].sections
        );
      }
    }
    setSearchValue("");
  }, [selectedView]);

  const handleFirstColumnSelected = (group) => {
    setFirstColumnSelected(group);
  };

  const handleSelectedView = (view) => {
    setSelectedView(view);
  };

  const handleSelectLastColumnItem = (item) => {
    setSelectedLastColumnItem(item);
    handleAddNewMetric(item);
    setShowPopup(false);
  };

  const handleSearchInput = (value) => {
    let arr = [];
    for (let i = 0; i < LastColumnItemsCopy.length; i++) {
      let obj = {};
      let matchingItems = LastColumnItemsCopy[i].items.filter((item) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      });
      obj.name = LastColumnItemsCopy[i].name;
      obj.items = matchingItems;
      arr.push(obj);
    }
    setSearchValue(value);
    setLastColumnItems(arr);
  };

  const isAllowUnit = (item) => {
    if (
      currentYAxisUnits &&
      currentYAxisUnits.size === 2 &&
      !currentYAxisUnits.has(item.type)
    )
      return false;

    return true;
  };
  const isAlreadySelected = (item) => {
    let obj = currentList.find((metric) => {
      if (metric.name === item.name) return metric;
    });
    return obj ? true : false;
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Popover
          position="bottom"
          withArrow
          shadow="md"
          zIndex={500}
          classNames={"popover_container"}
          opened={showPopup}
          onChange={setShowPopup}
        >
          <Popover.Target>
            <span
              onClick={() => setShowPopup(true)}
              data-testid="label_component_multi_columns"
            >
              {labelComponent}
            </span>
          </Popover.Target>
          <Popover.Dropdown>
            <div className="popup__div" data-testid="popup__div_multi_columns">
              <div className="title__div">
                <p>Select a metric</p>
              </div>
              {data && (
                <div className="options__div">
                  <div className="first__column" data-testid="level1">
                    {data.length > 0 &&
                      data.map((group, groupIndex) => {
                        return (
                          <p
                            key={`group_${groupIndex}`}
                            onClick={() => {
                              handleFirstColumnSelected(group, groupIndex);
                            }}
                            data-testid={`level_1_metric_${group.name}`}
                            className={
                              FirstColumnSelected &&
                              FirstColumnSelected.name === group.name
                                ? "selected__option"
                                : "normal__option"
                            }
                          >
                            {group.name}
                          </p>
                        );
                      })}
                  </div>

                  {listOfViews.length > 0 ? (
                    <div className="sub__group__div" data-testid="level2">
                      {listOfViews.map((view, viewIndex) => {
                        return (
                          <p
                            key={`view_${viewIndex}`}
                            onClick={() => {
                              handleSelectedView(view);
                            }}
                            data-testid={`level_2_metric_${view}`}
                            className={
                              selectedView && selectedView === view
                                ? "selected__option"
                                : "normal__option"
                            }
                          >
                            {view}
                          </p>
                        );
                      })}
                    </div>
                  ) : null}

                  {LastColumnItems.length > 0 && (
                    <div className="items__column" data-testid="level3">
                      <div className="input__div">
                        <Input
                          icon={<i className="fa fa-search"></i>}
                          placeholder="Search for"
                          value={searchValue}
                          onChange={(e) => {
                            handleSearchInput(e.target.value);
                          }}
                          data-testid="level3_search_input"
                        />
                      </div>
                      {LastColumnItems.length > 0 &&
                        LastColumnItems.map((section, sectionIndex) => {
                          return (
                            section.items.length > 0 && (
                              <div key={`section_${sectionIndex}`}>
                                <div className="section__title__div">
                                  <div className="title__before"></div>
                                  <p
                                    className="section__title"
                                    data-testid={`level3_section_${section.name}`}
                                  >
                                    {section.name}
                                  </p>
                                  <div className="title__after"></div>
                                </div>
                                {section.items.map((item, itemIndex) => {
                                  return !isAllowUnit(item) ? (
                                    <Tooltip
                                      key={`sectoion_${sectionIndex}_tooltip_unit_${itemIndex}`}
                                      events={{
                                        hover: true,
                                        focus: true,
                                        touch: false,
                                      }}
                                      label="The chart can’t have metrics with more than two different units"
                                    >
                                      <p
                                        className="disable__option"
                                        data-testid={`level_3_metric_${item.name}`}
                                      >
                                        {item.name}
                                      </p>
                                    </Tooltip>
                                  ) : isAlreadySelected(item) ? (
                                    <Tooltip
                                      key={`sectoion_${sectionIndex}_tooltip_exit_${itemIndex}`}
                                      events={{
                                        hover: true,
                                        focus: true,
                                        touch: false,
                                      }}
                                      label="You already chose these "
                                    >
                                      <p
                                        className={"disable__option"}
                                        data-testid={`level_3_metric_${item.name}`}
                                      >
                                        {item.name}
                                      </p>
                                    </Tooltip>
                                  ) : (
                                    <p
                                      key={`sectoion_${sectionIndex}_without_tooltip_${itemIndex}`}
                                      onClick={() => {
                                        handleSelectLastColumnItem(
                                          item,
                                          sectionIndex,
                                          itemIndex
                                        );
                                      }}
                                      data-testid={`level_3_metric_${item.name}`}
                                      className={
                                        selectedLastColumnItem &&
                                        selectedLastColumnItem.name ===
                                          item.name
                                          ? "selected__option"
                                          : "normal__option"
                                      }
                                    >
                                      {item.name}
                                    </p>
                                  );
                                })}
                              </div>
                            )
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>
    </div>
  );
};
export default DropdownMultiColumns;
