import './App.css';
import config from "./config";
import React from "react";
import Card from "./components/Card";
import Popup from "reactjs-popup";

class App extends React.Component {
    constructor() {
        super();
        this.state = {cards: this.prepareCard(), clicks: 0, isPopupOpened: false}
    }

    componentDidMount() {
        this.startGame();
    }

    startGame() {
        this.setState({
            cards: this.prepareCard(), clicks: 0, isPopupOpened: false
        })
    }

    prepareCard() {
        let id = 1;
        return [...config.cards, ...config.cards]
            .sort(() => Math.random() - 0.5)
            .map(item => ({...item, id: id++, isOpened: false, isCompleted: false}))
    }

    choiceCardHandler(openedItem) {
        if (openedItem.isCompleted || this.state.cards.filter(item => item.isOpened).length >= 2) {
            return;
        }
        this.setState({
            cards: this.state.cards.map(item => {
                return item.id === openedItem.id ? {...item, isOpened: true} : item;
            })
        }, () => {
            this.processChoosingCards();
        });


        this.setState({clicks: this.state.clicks + 1});
    }

    processChoosingCards() {
        const openedCards = this.state.cards.filter(item => item.isOpened);
        if (openedCards.length === 2) {
            if (openedCards[0].name === openedCards[1].name) {
                this.setState({
                    cards: this.state.cards.map(item => {
                        if (openedCards[0].id === item.id || openedCards[1].id === item.id) {
                            item.isCompleted = true;
                        }
                        item.isOpened = false;
                        return item;

                    })
                }, () => {
                    this.checkForAllCompleted();
                })
            } else {
                setTimeout(() => {
                    this.setState({
                        cards: this.state.cards.map(item => {
                            item.isOpened = false;
                            return item;
                        })
                    })
                }, 1000)

            }
        }
    }

    checkForAllCompleted() {
        if (this.state.cards.every(item => item.isCompleted)) {
            this.setState({isPopupOpened: true});
        }
    }

    closePopup() {
        this.setState({isPopupOpened: false});
        this.startGame();
    }

    render() {
        return (
            <div className="App">
                <header className="header">Memory Game</header>
                <div className="game">
                    <div className="score">Нажатий: {this.state.clicks}</div>
                    <div className="cards">
                        {
                            this.state.cards.map(item => (
                                <Card key={item.id} item={item} isShowed={item.isOpened || item.isCompleted}
                                      onChoice={this.choiceCardHandler.bind(this)}></Card>
                            ))
                        }
                    </div>
                </div>
                <Popup open={this.state.isPopupOpened} closeOnDocumentClick onClose={this.closePopup.bind(this)}>
                    <div className="modal">
                        <span className="close" onClick={this.closePopup.bind(this)}>
                            &times;
                        </span>
                        Игра завершена! Ваш результат: {this.state.clicks} кликов!
                    </div>
                </Popup>
            </div>
        );
    }
}

export default App;
