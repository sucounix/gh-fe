import React, { useState, useEffect } from "react";
import { Accordion } from "@mantine/core";
import { FAQsData } from "./FAQsData";
import "./style/FAQs.css";

const FAQs = () => {
  return (
    <div className="faq__div" data-testid="faq__div">
      <div className="div__start">
        <p className="title1">FAQ</p>
        <p className="title2">
          Have a question about using Femto? Check out some of our frequently
          asked questions.
        </p>
      </div>
      <div>
        {FAQsData.map((item) => {
          return (
            <Accordion className="single__item__faq">
              <Accordion.Item value="customization">
                <Accordion.Control>
                  <p className="question">{item.question}</p>
                </Accordion.Control>
                <Accordion.Panel>
                  <div className="answer">
                    {item.content.map((item, itemIndex) => {
                      return (
                        <div key={itemIndex} className="answer">
                          <p
                            key={`text_${itemIndex}`}
                            style={{ fontWeight: item?.title_bold && "500" }}
                            dangerouslySetInnerHTML={{
                              __html: item.text,
                            }}
                          ></p>
                          <div className="list__div">
                            <ol>
                              {item.numericList &&
                                item.numericList.map(
                                  (listItem, listItemIndex) => {
                                    return (
                                      <li
                                        key={`numbrtList_${itemIndex}_${listItemIndex}`}
                                      >
                                        <p
                                          className="list__item"
                                          dangerouslySetInnerHTML={{
                                            __html: listItem,
                                          }}
                                        ></p>
                                      </li>
                                    );
                                  }
                                )}
                            </ol>
                            <ul>
                              {item.dotList &&
                                item.dotList.map((listItem, listItemIndex) => {
                                  return (
                                    <li
                                      key={`dotList_${itemIndex}_${listItemIndex}`}
                                    >
                                      <p
                                        className="list__item_dot"
                                        dangerouslySetInnerHTML={{
                                          __html: listItem,
                                        }}
                                      ></p>
                                    </li>
                                  );
                                })}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default FAQs;
