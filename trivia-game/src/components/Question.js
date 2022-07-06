import { useState } from 'react'
import { nanoid } from 'nanoid'
import AnswerChoice from './AnswerChoice'

export default function Question(props) {
    const [answerChoices, setAnswerChoices] = useState(initializeChoices())

    function initializeChoices() {
        if (props.type === 'boolean') {
            return [
                {
                    choice:"True",
                    selected: false,
                    key: nanoid(),
                    chooseAnswer: chooseAnswer
                },
                {
                    choice:"False",
                    selected: false,
                    key: nanoid(),
                    chooseAnswer: chooseAnswer
                }
            ]
        } else {
            let choices = structuredClone(props.incorrect_answers)
            choices.push(props.correct_answer)
            choices = shuffle(choices)
            return choices.map(choice => {
                return {
                    choice: choice,
                    selected: false,
                    key: nanoid(),
                    chooseAnswer: chooseAnswer
                }
            })
        }
    }

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    function chooseAnswer(key) {
        let newChoices = answerChoices.map(choice => {
            return key !== choice.key ?
                choice:
                {...choice, selected: true}
        })
        let selection = ""
        for (let i = 0; i < newChoices.length; i++) {
            if (newChoices[i].selected === true) {
                selection = newChoices[i].choice
            }
        }
        props.updateSelections(props.id, selection)
        setAnswerChoices(newChoices)
    }

    const answerChoicesElements = answerChoices.map(choice => (
        <AnswerChoice
            key={choice.key}
            id={choice.key}
            selected={choice.selected}
            choice={choice.choice}
            chooseAnswer={choice.chooseAnswer}
            submitted={props.submitted}
            correct_answer={props.correct_answer}
            />
    ))

    return (
        <div className="QuestionModule">
            <h2> {props.question} </h2>
            <div className="QuestionChoices">
                {answerChoicesElements}
            </div>
        </div>
    )
}