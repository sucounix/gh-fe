import React, { createContext, useState } from "react";
import financials_thumbnail from "../assets/images/Financial Statements Thumbnail.png";
import Upload_Guidelines_thumbnail from "../assets/images/Upload Guidelines.png";
import Breakeven_Analysis_thumbnail from "../assets/images/Breakeven Analysis.png";
import Trend_Analysis_thumbnail from "../assets/images/Trend Analysis - Website_Moment.jpg";
import KPIs_Thumbnail from "../assets/images/KPIs Thumbnail.png";
import settings_thumbnail from "../assets/images/settings_thumbnail.png";
import Segmentation_thumbnail from "../assets/images/Segmentation_thumbnail.png";

const TutorialVideosContext = createContext({});

function TutorialVideosProvider({ children }) {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videosList] = useState(data);
  // each page will update it's target,
  // so,  will scroll to this video in the videos list and be selected by default
  const [targetVideoKey, setTargetVideoKey] = useState(null);

  const getVideo = (key) => {
    setCurrentVideo(
      videosList.find((item) => {
        return item.key === key;
      })
    );
  };

  const clearCurrentVideo = () => {
    setCurrentVideo(null);
  };

  return (
    <TutorialVideosContext.Provider
      value={{
        videosList,
        getVideo,
        currentVideo,
        setCurrentVideo,
        targetVideoKey,
        setTargetVideoKey,
        clearCurrentVideo,
      }}
    >
      {children}
    </TutorialVideosContext.Provider>
  );
}
const data = [
  {
    key: "upload_excel",
    videoLink:
      "https://www.youtube.com/watch?v=SDHJm5K5CVg&ab_channel=FemtoFP%26A",
    videoThumbnail: Upload_Guidelines_thumbnail,
    title: "Learn More About Our Uploading Guidelines!",
    desc: `Femto acknowledges finance professionals' love for excel. Adjust your spreadsheets with our easy-to-use classification codes and unlock Femto's seamless and comprehensive financial analysis tool kit.`,
    pathKey: "upload/excel",
  },
  {
    key: "financials",
    videoLink:
      "https://www.youtube.com/watch?v=x6XiENhETsI&ab_channel=FemtoFP%26A",
    videoThumbnail: financials_thumbnail,
    title: "Introducing Automated Financial Statements",
    desc: `Upload your classification codes and effortlessly track your company's financial health with Femto's automated financial statement. Instantly analyze profitability, gain valuable insights, and visualize cash flow patterns.`,
    pathKey: "financials",
  },
  {
    key: "upload_breakdown",
    videoLink:
      "https://www.youtube.com/watch?v=NAS1zXPkd-0&ab_channel=FemtoFP%26A",
    videoThumbnail: Segmentation_thumbnail,
    title: "Learn More About our Segmentation Guidelines!",
    desc: `Learn how to use Femto’s segmentation guidelines in order to unlock insights into your company’s divisions. 
    -Revenues Breakdowns
    -Volumes Breakdowns
    -Price Volume Mix
    -Clients Progression Analyses
    -Capacity Utilization
    And more ....`,
    pathKey: "segmentation-analysis",
  },
  {
    key: "segmentation",
    videoLink:
      "https://www.youtube.com/watch?v=bjww53RLpLo&ab_channel=FemtoFP%26A",
    videoThumbnail: Segmentation_thumbnail,
    title: "Introducing Femto's Segmentation Analysis!",
    desc: `Gain valuable insights by breaking down the drivers formulating your revenue streams for every business line, and sub-classes or tiers. Discover a new level of data-driven decision-making with Femto's Segmentation Analysis.`,
    pathKey: "segmentation-analysis",
  },
  {
    key: "breakeven",
    videoLink:
      "https://www.youtube.com/watch?v=TL1towaYC8Q&ab_channel=FemtoFP%26A",
    videoThumbnail: Breakeven_Analysis_thumbnail,
    title: "Introducing Femto's Breakeven Analysis!",
    desc: "Breakeven analysis allows you to understand the minimum level of sales needed to cover your expenses and start generating profits.",
    pathKey: "breakeven",
  },
  {
    key: "KPI",
    videoLink:
      "https://www.youtube.com/watch?v=0BTsw8SG-bY&ab_channel=FemtoFP%26A",
    videoThumbnail: KPIs_Thumbnail,
    title: "Introducing Femto's KPI Analysis!",
    desc: "Dissect your company's financial health with Femto's automated KPIs, to understand more about your company's performance.",
    pathKey: "kpi",
  },
  {
    key: "trend_analysis",
    videoLink:
      "https://www.youtube.com/watch?v=keKs_beqRFk&ab_channel=FemtoFP%26A",
    videoThumbnail: Trend_Analysis_thumbnail,
    title: "Introducing Femto's Trend Analysis tool!",
    desc: `Our trend analysis tool can be fully customizable to equip finance professionals with the ability to combine any different metrics from the chart of accounts into a single chart. Instantly visualize the correlation, the results and the needed actions.`,
    pathKey: "trend-analysis",
  },
  {
    key: "settings",
    videoLink:
      "https://www.youtube.com/watch?v=BRwfXcHRFEI&ab_channel=FemtoFP%26A",
    videoThumbnail: settings_thumbnail,
    title: "Introducing Femto's Settings Guidelines!",
    desc: `Customize your financial analysis with Femto's Settings! Seamlessly manage your data and tailor your analysis with Femto's powerful tools.`,
    pathKey: "settings",
  },
];
export { TutorialVideosProvider, TutorialVideosContext };
