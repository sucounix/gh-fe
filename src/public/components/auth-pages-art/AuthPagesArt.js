import React, { useEffect, useState } from "react";
import "./style/AuthPagesArt.scss";
import dots from "../../../assets/images/review-dots.svg";
import femtologo from "../../../assets/images/femto-logo.svg";
import { Link } from "react-router-dom";

const allReviews = [
  {
    text: "Femto has saved my business 15 days on monthly basis lost in manual data aggregation",
  },
  {
    text: "Femto allowed us to conclude instant budgeting and planning progress through featuring rich modules",
  },
  {
    text: "The rich user interface and designs have allowed us to monitor cash flow in various previews and execute immediate action plans",
  },
  {
    text: "I loved working with Femto, the product was very easy to use & helped me accelerate my planning significantly.",
  },
  {
    text: "After suffering with endless sheets that took forever to finalize, I found Femto which supported in my financial analysis from A-Z.",
  },
  {
    text: "Simple tool for complex analysis!",
  },
  {
    text: "Femto makes it super simple for anyone to build out financial models for their business.",
  },
  {
    text: "without long working hours, it allows me to see where my business stands today & forecast for the future seamlessly.",
  },
  {
    text: "Femto allowed me to achieve informative decision-making significantly with easy-to-read dashboards and very insightful analysis.",
  },
  {
    text: "Femto classification codes has allowed us to integrate our existing management accounts and financials instantly with no technical implementation needed.",
  },
  {
    text: "The instant integration with Quickbooks has enabled us to achieve a full finance back office digital transformation.",
  },
  {
    text: "Femto allowed us to allocate our expenses to various business lines and channels to be able to achieve breakdown unit economic",
  },
  {
    text: "Femto's provides really good customer service support with is 24/7 chatbot to answer all your enquiries and solve all your problems.",
  },
  {
    text: "Femto allows you to integrate with excel to extract analysis with multiple views that can be customised according to your preferences.",
  },
  {
    text: "Femto is an analytic and budget tool that saved us various days and helped us extract immediate reports with several chart views.",
  },
  {
    text: "Femto does a great job analysing financials and generating quick reports in just a few minutes.",
  },
  {
    text: "Femto has an excellent interface that allows you to evaluate your company’s financial performance through automatic reports. You simply import your figures, and it does all the magic.",
  },
];

function AuthPagesArt() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const randomReviews = [];
    /* 
      Extracting 2 random reviews from the array of reviews
    */
    while (randomReviews.length < 2) {
      const randomIndex = Math.floor(Math.random() * allReviews.length);
      if (!randomReviews.includes(allReviews[randomIndex])) {
        randomReviews.push(allReviews[randomIndex]);
      }
    }

    setReviews(randomReviews);
  }, []);

  return (
    <div className="artwork__wrapper">
      <Link to="/">
        <img src={femtologo} alt="femto logo" width={150} />
      </Link>
      <div className="artwork__content">
        <div className="artwork__content__text">
          <p className="artwork__content__text__title">
            Start your <br /> journey with us
          </p>
          <p className="artwork__content__text__description">
            Get a complete picture of your business finances with our FP&A
            software.
          </p>
        </div>
      </div>
      <div className="artwork__reviews">
        <div className="artwork__review">
          <img
            src={dots}
            alt="femto logo"
            width={50}
            style={{
              position: "absolute",
              top: "-1rem",
              right: "-1rem",
              zIndex: 0,
            }}
          />
          <div className="review__body">
            <p className="artwork__review__text">{reviews[0]?.text}</p>
          </div>
        </div>
        <div className="artwork__review">
          <img
            src={dots}
            alt="femto logo"
            width={50}
            style={{
              position: "absolute",
              bottom: "-0.5rem",
              left: "-1rem",
              zIndex: 0,
            }}
          />
          <div className="review__body">
            <p className="artwork__review__text">{reviews[1]?.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPagesArt;
