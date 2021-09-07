import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapArea from './components/MapArea';
import styled from 'styled-components'

const StyledContainer = styled.div`
  // border: 2px solid orange;
  display: flex;
  flex-direction: row;
  padding: 1em 2em 1em 2em;
  flex: 1;
`

const StyledAppContainer = styled.div`
  // border: 2px solid yellow;
  display: flex;
  flex-direction: column;
  height: 100vh;
`


function App() {
  return (
    <StyledAppContainer>
      <Header/>
      <StyledContainer className="main-container">
        <Sidebar/>
        <MapArea/>
      </StyledContainer>
    </StyledAppContainer>
  );
}

export default App;
