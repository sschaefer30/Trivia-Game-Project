import { useState, useEffect } from 'react'
import Question from './Question'
import { nanoid } from 'nanoid'

export default function QuestionsScreen() {
    const [questions, setQuestions] = useState([])
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)

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
        for (let i = 0; i < questions.length; i++) {
            if (selections.get(questions[i].id) === questions[i].correct_answer) {
                setScore(prev => prev + 1)
            }
        }
        setSubmitted(true)
    }

    function updateSelections(id, selection) {
        selections.set(id, selection)
    }

    function newGame() {
        window.location.reload(true)
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

    return (
        <section>
            {questionsElements}
            <div className="SubBox">
                {!submitted && <button onClick={submitQuiz} className="SubmissionButton"> Submit Answers </button>}
                {submitted && <h1> Your score: {score} </h1>}
            </div>

            {submitted && 
                <div className="SubmissionEntities">
                    <button onClick={newGame} className="NewGameButton"> New Game </button>
                </div>
            }

        </section>
    )
}