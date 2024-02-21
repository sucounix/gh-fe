import React from "react";
import { Button, Flex } from "@mantine/core";
import emptysegmentationcontent from "../../../../../assets/images/emptysegmentationcontent.png";

const RenderEmptySection = ({ viewName, requirements, renderUploadView }) => {
  return (
    <Flex
      align={"center"}
      justify="space-evenly"
      w={"60vw"}
      style={{ margin: "50px auto" }}
    >
      <div>
        <img src={emptysegmentationcontent} alt="empty content" />
      </div>
      <div data-testid="no_entries">
        <p className="title1">{`Ooops, No results found for ${viewName}`}</p>
        <p className="title2">Looking like there's no entries here yet.</p>
        <p className="title2">
          In order to view <b style={{ padding: "0 5px" }}>{viewName}</b> please
          upload
        </p>
        <ol type="1" style={{ fontWeight: "500" }}>
          {requirements.map((item, index) => {
            return <li key={`item_${index}`}>{item}</li>;
          })}
        </ol>
        <Button size="lg" onClick={renderUploadView}>
          Upload Segmentation analysis{" "}
        </Button>
      </div>
    </Flex>
  );
};

export default RenderEmptySection;
