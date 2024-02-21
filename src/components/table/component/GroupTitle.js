import React from "react";

const GroupTitle = ({ columns, testIdSuffix, groupIndex }) => {
  return (
    <tr>
      <td
        className="sticky__title__cell"
        data-testid={`group_title_${groupIndex}_${testIdSuffix}_${columns[0].col_data}`}
      >
        <div className="cell_style">{columns[0].col_data}</div>
      </td>
    </tr>
  );
};

export default GroupTitle;
