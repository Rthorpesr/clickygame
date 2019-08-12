import React, { PureComponent } from 'react';
import Header from './components/header/Header';
import Card from './components/card/Card';
import GameOver from './components/card/GameOver';

import './styles/main.css';

class App extends PureComponent {

  state = { 
    isFlipped: Array(16).fill(false),
    shuffledCard: App.duplicateCard().sort(() => Math.random() - 0.5),
    clickCount: 1,
    prevSelectedCard: -1,
    prevCardId: -1
  };

// duplicateCard method for duplicating the array of card numbers. This is because each card 
// number should have a duplicate. The duplicateCard method will return an array 
// of length 16 which is [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7]. This array is randomised 
// it is passed to the state object shuffledCard.
  static duplicateCard = () => 
    {
      return [0,1,2,3,4,5,6,7].reduce((preValue, current, index, array) => 
        {
          return preValue.concat([current, current])
        },[]);
    };

// handleClick contains the method for flipping card when it is clicked on to reveal 
// the card number. The method changes the isFlippedstate of the card to true and 
// prevents a card that is already flipped from responding to the click event. From
// check if the number of flipped cards is two so player can check if the two cards
// are a match.  

  handleClick = event => {
    event.preventDefault();
    const cardId = event.target.id;
    const newFlipps = this.state.isFlipped.slice();
    this.setState({
        prevSelectedCard: this.state.shuffledCard[cardId],
        prevCardId: cardId
    });

    if (newFlipps[cardId] === false) {
      newFlipps[cardId] = !newFlipps[cardId];
      this.setState(prevState => ({ 
        isFlipped: newFlipps,
        clickCount: this.state.clickCount + 1
      }));

      if (this.state.clickCount === 2) {
        this.setState({ clickCount: 1 });
        const prevCardId = this.state.prevCardId;
        const newCard = this.state.shuffledCard[cardId];
        const previousCard = this.state.prevSelectedCard;

        this.isCardMatch(previousCard, newCard, prevCardId, cardId);
      }
    }
  };

  // isCardMatch method checks if the two flipped cards are a match. This method is
  // called in handleClick (see above). The setTimeout method used while setting the 
  // state is so that the card flip will not be abrupt.
  isCardMatch = (card1, card2, card1Id, card2Id) => {
    if (card1 === card2) {
      const hideCard = this.state.shuffledCard.slice();
      hideCard[card1Id] = -1;
      hideCard[card2Id] = -1;
      setTimeout(() => {
        this.setState(prevState => ({
          shuffledCard: hideCard
        }))
      }, 1000);
    } else {
      const flipBack = this.state.isFlipped.slice();
      flipBack[card1Id] = false;
      flipBack[card2Id] = false;
      setTimeout(() => {
        this.setState(prevState => ({ isFlipped: flipBack }));
      }, 1000);
    }
  };


 // restartGame method. This method resets the game’s state.
  restartGame = () => {
    this.setState({
      isFlipped: Array(16).fill(false),
      shuffledCard: App.duplicateCard().sort(() => Math.random() - 0.5),
      clickCount: 1,
      prevSelectedCard: -1,
      prevCardId: -1
    });
  };


// checks to see if the game is over. If the game is over, the GameOver component 
// is displayed.
  isGameOver = () => {
    return this.state.isFlipped.every((element, index, array) => element !== false);
  };


// the render method passes the Header component to restartGame props. 
// The isGameOver method is used to render the GameOver component when the game 
// is over otherwise, the Card component is rendered.
  render() {
    return (
     <div>
       <Header restartGame={this.restartGame} />
       { this.isGameOver() ? <GameOver restartGame={this.restartGame} /> :
       <div className="grid-container">
          {
            this.state.shuffledCard.map((cardNumber, index) => 
              <Card
                key={index} 
                id={index} 
                cardNumber={cardNumber} 
                isFlipped={this.state.isFlipped[index]} 
                handleClick={this.handleClick}     
              />
            )
          }
        </div>
       }
     </div>
    );
  }
}

export default App;
