import React, {useState} from 'react'
import StartGameScreen from './components/StartGameScreen'
import QuestionsScreen from './components/QuestionsScreen'
import './style.css';

function App() {
  const [gameInProgress, setGameInProgress] = useState(false)

  function startGame() {
    setGameInProgress(true)
  }


  return (
    <main>
      {
        !gameInProgress ? <StartGameScreen startGame={startGame}/> : <QuestionsScreen />
      }
    </main>
  );
}

export default App;
