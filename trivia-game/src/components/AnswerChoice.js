export default function AnswerChoice(props) {
    function preSubmitStyles() {
        return {
            backgroundColor: props.selected ? "#59E391" : "white"
        }
    }

    function submittedStyles() {
        if (props.selected) {
            return props.correct_answer === props.choice ? {backgroundColor: "green"} : {backgroundColor: "red", opacity: "50%"}
        } else {
            return props.correct_answer === props.choice ? {backgroundColor: "green"} : {backgroundColor: "white", opacity: "50%"}
        }
    }

    return (
        <button className="AnswerChoice" style={props.submitted ? submittedStyles() : preSubmitStyles()} onClick={() => props.chooseAnswer(props.id)}>
            {props.choice}
        </button>
    )
}