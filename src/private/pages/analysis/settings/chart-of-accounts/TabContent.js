import React, { useState } from "react";
import Section from "./Section";
import "./style/ChartOfAccounts.scss";

const TabContentChartOfAccounts = ({
  title,
  dataTestId,
  data = [],
  classificationData,
  classificationLoading,
  setCurrentItemChanged,
  currentItemChange,
  updateItemPriority,
  updateItemClassification,
}) => {
  // when start drag any item all the other section should be disabled except the current section
  const [activeSectionIndexDragged, setActiveSectionIndexDragged] =
    useState(-1);

  const handleActiveSectionDrag = (activeSectionIndex) => {
    setActiveSectionIndexDragged(activeSectionIndex);
  };

  return (
    <div className="tab__content" data-testid={dataTestId}>
      <p className="tab__content__title">{title}</p>
      {data &&
        data.length > 0 &&
        data.map((section, sectionIndex) => {
          return (
            <div key={`row_${sectionIndex}`} className="section">
              <p
                className={
                  activeSectionIndexDragged !== -1 &&
                  activeSectionIndexDragged !== sectionIndex
                    ? " section__title__accounts disabled"
                    : "section__title__accounts"
                }
              >
                {section.name}
              </p>

              <Section
                dataTestId={`account__section__${sectionIndex}`}
                cardsData={section.accounts}
                disabled={
                  activeSectionIndexDragged !== -1 &&
                  activeSectionIndexDragged !== sectionIndex
                    ? true
                    : false
                }
                sectionIndex={sectionIndex}
                handleActiveSectionDrag={handleActiveSectionDrag}
                classificationData={classificationData}
                classificationLoading={classificationLoading}
                setCurrentItemChanged={setCurrentItemChanged}
                currentItemChange={currentItemChange}
                updateItemPriority={updateItemPriority}
                updateItemClassification={updateItemClassification}
              />
            </div>
          );
        })}
    </div>
  );
};

export default TabContentChartOfAccounts;
