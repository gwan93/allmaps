import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useCallback } from "react";
const debounce = require("lodash.debounce");

const Input = styled.input`
  box-sizing: border-box;
  border: 2px solid lightgrey;
  padding: 10px;
  margin: 1px 0 1px 0;
  border-radius: 5px;
  width: 100%;
  &:focus {
    outline: none;
    border: 2px solid black;
  }
`;

interface Props {
  searchHandler: (searchTerm: string) => void;
  autoCompleteHandler: (searchTerm: string) => void;
  setShowPreview: (bool: boolean) => void;
}

export default function SearchBar({
  searchHandler,
  autoCompleteHandler,
  setShowPreview,
}: Props) {

  const [search, setSearch] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    searchHandler(search);
  };

  const debounceSearchResults = useCallback(
    debounce((search: string) => autoCompleteHandler(search), 500), []
  );

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceSearchResults(e.target.value);
    setShowPreview(true);
  };

  return (
    <>
      <h2>Search</h2>
      <form onSubmit={handleSubmit}>
        <Input
          value={search}
          placeholder="eg. 'Toronto, ON'"
          onChange={onInputChangeHandler}
          onClick={() => setShowPreview(true)}
          onBlur={() => setShowPreview(false)}
        />
      </form>
    </>
  );
}

SearchBar.propTypes = {
  searchHandler: PropTypes.func,
  autoCompleteHandler: PropTypes.func,
  setShowPreview: PropTypes.func,
};
