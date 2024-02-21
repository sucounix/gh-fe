import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import AstraChatAffix from "../../components/astra-chat/AstraChatAffix";
import { Outlet } from "react-router-dom";

function AnalysisHome() {
  useEffect(() => {
    // const astraWrapper = ReactDOM.createRoot(
    //   document.getElementById("analysis-astra")
    // );
    // astraWrapper.render(<AstraChatAffix subscriptionInfo={subscriptionInfo} />);
    // return () => {
    //   astraWrapper.unmount();
    // };
  }, []);
  return (
    <>
      {/* <div id="analysis-astra"></div> */}
      <AstraChatAffix />
      <Outlet />
    </>
  );
}

export default AnalysisHome;
