import React, { useState, MouseEvent } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

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

const Button = styled.button`
  background-color: white;
  border: 2px solid lightgrey;
  border-radius: 5px;
  padding: 10px;
  margin: 1px 0 1px 0;
  width: 100%;
  &:hover {
    border-color: #75cff0;
    background-color: #75cff0;
    cursor: pointer;
  }
`;

interface Props {
  searchHandler: (searchTerm: string) => void;
}

export default function SearchBar({ searchHandler }: Props) {
  const [search, setSearch] = useState<string>("");

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!search) return;
    searchHandler(search);
  };

  return (
    <>
      <h2>Search</h2>
      <form>
        <Input
          value={search}
          placeholder="eg. 'Toronto, ON'"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" onClick={handleSubmit}>
          Search
        </Button>
      </form>
    </>
  );
}

SearchBar.propTypes = {
  searchHandler: PropTypes.func,
};