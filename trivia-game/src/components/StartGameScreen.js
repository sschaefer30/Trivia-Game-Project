export default function StartGameScreen(props) {
    return (
        <section className="StartGameBox">
            <div className="StartGameTextBox">
                <h1> Quizzical </h1>
                <h3> Come test your trivia skills! </h3>
                <button className="StartQuizButton" onClick={props.startGame}> Start Quiz </button>
            </div>
        </section>
    )
}