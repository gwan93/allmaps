import styled from 'styled-components'
const fs = require('fs');

const StyledSidebar = styled.div`
  border: 2px solid blue;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const getFileList = (dirPath) => {
  return fs.readdirSync(dirPath)
}

const getFileContent = (filePath) => {
  return require(filePath);
}

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