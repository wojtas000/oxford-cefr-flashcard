import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useDeck } from '../context/DeckContext';
import { FlashcardComponent } from '../components/Flashcard';
import { ArrowLeft, RefreshCw, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react-native';

export const StudyScreen = ({ navigation }: any) => {
  const { cards, currentIndex, nextCard, previousCard, shuffleDeck, resetDeck, mode, markAsDone } = useDeck();
  const [flipped, setFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setFlipped(false);
    // Add a tiny delay so the card flips back before moving to next
    setTimeout(() => {
      nextCard();
    }, 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => {
      previousCard();
    }, 150);
  };

  const handleShuffle = () => {
    setFlipped(false);
    shuffleDeck();
  };

  const handleReset = () => {
    setFlipped(false);
    resetDeck();
  };

  const handleMarkAsDone = () => {
    setFlipped(false);
    setTimeout(() => {
      markAsDone(currentCard.id);
    }, 150);
  };

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.emptyText}>No cards available for this level.</Text>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
          <ArrowLeft color="#CDD6F4" size={24} />
        </Pressable>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {cards.length}
        </Text>
        <Pressable onPress={handleShuffle} style={styles.iconButton}>
          <RefreshCw color="#CDD6F4" size={24} />
        </Pressable>
      </View>

      <View style={styles.progressBarContainer}>
        <View 
          style={[styles.progressBarFill, { width: `${((currentIndex + 1) / cards.length) * 100}%` }]} 
        />
      </View>

      <View style={styles.cardContainer}>
        <FlashcardComponent 
          card={currentCard} 
          mode={mode} 
          flipped={flipped} 
          onFlip={() => setFlipped(!flipped)} 
        />
      </View>

      <View style={styles.controlsContainer}>
        <Pressable 
          style={[styles.controlButton, currentIndex === 0 && styles.controlButtonDisabled]} 
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft color={currentIndex === 0 ? "#585B70" : "#CDD6F4"} size={32} />
        </Pressable>
        
        <Pressable 
          style={styles.doneButton} 
          onPress={handleMarkAsDone}
        >
          <CheckCircle color="#A6E3A1" size={24} style={{ marginRight: 8 }} />
          <Text style={styles.doneText}>Mark Done</Text>
        </Pressable>

        <Pressable 
          style={[styles.controlButton, currentIndex === cards.length - 1 && styles.controlButtonDisabled]} 
          onPress={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight color={currentIndex === cards.length - 1 ? "#585B70" : "#CDD6F4"} size={32} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#11111B', // Mocha base
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  iconButton: {
    padding: 8,
  },
  progressText: {
    color: '#BAC2DE',
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#313244',
    marginHorizontal: 24,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 40,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#89B4FA',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 20,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E1E2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#313244',
  },
  controlButtonDisabled: {
    backgroundColor: '#11111B',
    borderColor: '#181825',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#A6E3A1',
  },
  doneText: {
    color: '#A6E3A1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#CDD6F4',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#89B4FA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#11111B',
    fontWeight: 'bold',
  },
});
