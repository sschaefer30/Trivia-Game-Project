import { useState, useEffect } from 'react'
import Question from './Question'
import { nanoid } from 'nanoid'

let LOCAL_STORAGE = 'key'
export default function QuestionsScreen() {
    const [questions, setQuestions] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)
    const [leaderboard, setLeaderboard] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE)))
    const [saved, setSaved] = useState(false)

    let selections = new Map()

    useEffect(() => {
        fetch('https://opentdb.com/api.php?amount=5')
            .then(res => res.json())
            .then(data => setQuestions(data.results.map(question => {
                return {
                    id: nanoid(),
                    question: parseString(question.question),
                    type: question.type,
                    correct_answer: parseString(question.correct_answer),
                    incorrect_answers: question.incorrect_answers.map(ans => parseString(ans)),
                    difficulty: question.difficulty
                }
            })))
    }, [])

    function parseString(toParse) {
        toParse = toParse.replace(/&quot;/g,'"')
        toParse = toParse.replace(/&#039;/g,"'")
        toParse = toParse.replace(/&eacute;/g,"é")
        toParse = toParse.replace(/&amp;/g,"&")
        return toParse
    }

    function submitQuiz() {
        let myScore = 0
        for (let i = 0; i < questions.length; i++) {
            if (selections.get(questions[i].id) === questions[i].correct_answer) {
                myScore++
            }
        }
        setSubmitted(true)
        setScore(myScore)
    }

    function updateSelections(id, selection) {
        selections.set(id, selection)
    }

    function newGame() {
        window.location.reload(true)
    }

    function saveScore() {
        if (saved) {
            alert("You have already saved your score!")
        } else {
            setSaved(true)
            var username = window.prompt("Enter your username: ")
            if (!localStorage.getItem(LOCAL_STORAGE)) {
                localStorage.setItem(LOCAL_STORAGE, JSON.stringify([{
                    key: nanoid(),
                    username: username,
                    score: score
                }]))
            }
            else {
                let newLeaderboard = [...leaderboard, {
                    key: nanoid(),
                    username: username,
                    score: score
                }]
                newLeaderboard.sort((a, b) => {
                    return b.score - a.score
                })
                localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newLeaderboard))
            }
        }
    }

    function clearLeaderboard() {
        if (window.confirm("Are you sure you want to DELETE your scores?") == true) {
            localStorage.clear()
        }
    }

    const questionsElements = questions.map(question => (
        <Question
            key={question.id}
            id={question.id}
            question={question.question}
            type={question.type}
            correct_answer={question.correct_answer}
            incorrect_answers={question.incorrect_answers}
            difficulty={question.difficulty}
            updateSelections={updateSelections}
            submitted={submitted}
            />
    ))
    const leaderboardElements = !leaderboard ? <h3> You don't have any scores saved! Press SAVE to start your leaderboard! </h3> 
        : leaderboard.map(player => (
            <h3>{player.username} : {player.score}</h3>
        ))

    return (
        <section>
            {questionsElements}
            <div className="SubBox">
                {!submitted && <button onClick={submitQuiz} className="SubmissionButton"> Submit Answers </button>}
                {submitted && <h1> Your score: {score} </h1>}
            </div>
            {submitted &&
                <div className="LeaderboardElements">
                    <div className="LeaderboardBox">
                        <h2><u>My Leaderboard!</u></h2>
                        {leaderboardElements}
                    </div>
                    <button onClick={saveScore} className="SaveButton"> Save to leaderboard! </button>
                    <button onClick={clearLeaderboard} className="ClearButton"> Clear scores </button>
                </div>
            }
            {submitted && 
                <div className="SubmissionEntities">
                    <button onClick={newGame} className="NewGameButton"> New Game </button>
                </div>
            }

        </section>
    )
}