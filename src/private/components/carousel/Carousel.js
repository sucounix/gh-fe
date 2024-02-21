import React, { useState, useContext, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useViewportSize } from "@mantine/hooks";
import "./carousel.css";

const Carousel = (props) => {
  const { children, setShowStartShadow } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState(children.length);
  const { width } = useViewportSize();
  // the current screen width calculate from
  // (current active index)*(screen width)*(ratio =0.4)
  const [currentScreenWidth, setCurrentScreenWidth] = useState(0);

  // Set the length to match current children from props
  useEffect(() => {
    setLength(children.length);
  }, [children]);

  useEffect(() => {
    setCurrentScreenWidth(currentIndex * window.innerWidth * 0.5);
    setShowStartShadow(currentIndex != 0);
  }, [currentIndex]);

  const checkIsNotVisiable = () => {
    //the next button should be active till the last element be visible in the screen
    let element = document.querySelector("#last__item");
    let rightPos = element.getBoundingClientRect().right;
    let halfOfScreenWidth = width / 2;
    return rightPos - halfOfScreenWidth > halfOfScreenWidth;
  };

  const next = () => {
    if (currentIndex < length && checkIsNotVisiable()) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= length) {
      newIndex = length - 1;
    }
    setCurrentIndex(newIndex);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => checkIsNotVisiable() && updateIndex(currentIndex + 1),
    onSwipedRight: () => updateIndex(currentIndex - 1),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div>
      <div className="carousel-container" {...handlers}>
        <div className="carousel-wrapper">
          <div className="carousel-content-wrapper">
            <div className="screen_div">
              <div
                className={`carousel-content `}
                style={{
                  transform:
                    width > 810
                      ? `translateX(-${currentScreenWidth * 0.1}%)`
                      : `translateX(-${currentScreenWidth * 0.15}%)`,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="buttons__div">
        <button className="left-arrow" onClick={prev}>
          &lt;
        </button>
        <button className="right-arrow" onClick={next}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Carousel;
