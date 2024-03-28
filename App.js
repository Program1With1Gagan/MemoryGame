import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Vibration } from 'react-native';

// Define your image sources here
const images = {
  cat1: require('./assets/Cat1.jpg'),
  cat2: require('./assets/Cat2.jpg'),
  cat3: require('./assets/Cat3.jpg'),
  cat4: require('./assets/Cat4.jpg')
};

const NUM_PAIRS = 4; // Number of pairs of cards

const App = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    
    const values = [];
    const catImages = Object.keys(images);
    for (let i = 1; i <= NUM_PAIRS; i++) {
      catImages.forEach(catImage => {
        values.push(catImage);
      });
    }
    // Shuffle the cards
    const shuffledValues = shuffleArray(values);
    const shuffledCards = shuffledValues.map(value => ({ value, flipped: false, matched: false }));
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMoves(0);
  };

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleCardPress = index => {
    if (cards[index].matched || flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlippedIndices(prevFlippedIndices => [...prevFlippedIndices, index]);

    // Vibrate when flipping a card
    Vibration.vibrate();

    if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      if (newCards[firstIndex].value === newCards[index].value) {
        newCards[firstIndex].matched = true;
        newCards[index].matched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setMoves(prevMoves => prevMoves + 1);

        const isGameFinished = newCards.every(card => card.matched);
        if (isGameFinished) {
          Alert.alert('Congratulations!', `You completed the game in ${moves + 1} moves!`, [
            { text: 'Restart ', onPress: initializeGame }
          ]);
        }
      } else {
        setTimeout(() => {
          newCards[firstIndex].flipped = false;
          newCards[index].flipped = false;
          setCards(newCards);
          setFlippedIndices([]);
          setMoves(prevMoves => prevMoves + 1);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.moves}>Moves: {moves}</Text>
      <View style={styles.board}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: card.flipped ? 'blue' : 'gray' }]}
            onPress={() => handleCardPress(index)}
            disabled={card.matched}
          >
            {card.flipped ? <Image source={images[card.value]} style={styles.image} /> : null}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: 80,
    height: 80,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  moves: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default App;
