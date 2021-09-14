import styled from 'styled-components'
const fs = require('fs');

const StyledSidebar = styled.div`
  border: 2px solid blue;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Accepts a directory path as a parameter
// Returns a list of all files in that directory
const getFileList = (dirPath) => {
  return fs.readdirSync(dirPath)
}

// Accepts a JSON's file path as a parameter
// Returns the contents of that JSON file
const getFileContent = (filePath) => {
  return require(filePath);
}

// Accepts a directory path as a parameter
// Returns an object with the keys as each file name
// within that directory and the values as 
// the contents of that file. 
// Expects each file to be a JSON file.
const getAllFileContents = async (dirPath) => {
  const data = {}
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fileContent = require(`${dirPath}/${file}`)
    data[file] = fileContent;
  }
  return data;
}

export default function Sidebar() {
  return (
    <StyledSidebar>
      This is the Sidebar
    </StyledSidebar>
  )
}