import { FeatureCollection } from "geojson";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import styled from "styled-components";

const Preview = styled.div`
  border: 1px solid lightgrey;
  padding: 5px;
  margin: 0 5px;
  &:hover {
    background-color: lightgrey;
    cursor: pointer;
  }
`;

interface Props {
  autoCompleteList: FeatureCollection | undefined;
  previewOnClick: (result: any) => void;
  setShowPreview: (bool: boolean) => void;
}

export default function PreviewResults({
  autoCompleteList,
  previewOnClick,
  setShowPreview,
}: Props) {

  useEffect(() => {
    if (autoCompleteList && Object.keys(autoCompleteList as {}).includes("features")
    ) {
      setShowPreview(true);
    }
  }, [autoCompleteList]);

  return (
    <>
      {autoCompleteList?.features.map((result: any) => (
        // use onMouseDown instead of onClick to prevent conflict with searchBar onBlur
        <Preview key={result.place_name} onMouseDown={() => previewOnClick(result)}>
          {result.place_name}
        </Preview>
      ))}
    </>
  );
}

PreviewResults.propTypes = {
  autoCompleteList: PropTypes.object,
  previewOnClick: PropTypes.func,
  setShowPreview: PropTypes.func,
};