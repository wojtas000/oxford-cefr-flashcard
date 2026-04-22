import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Flashcard as FlashcardType, StudyMode } from '../types';

interface FlashcardProps {
  card: FlashcardType;
  mode: StudyMode;
  flipped: boolean;
  onFlip: () => void;
}

export const FlashcardComponent: React.FC<FlashcardProps> = ({ card, mode, flipped, onFlip }) => {
  const flipAnim = useSharedValue(0);

  useEffect(() => {
    flipAnim.value = withSpring(flipped ? 1 : 0, {
      damping: 15,
      stiffness: 120,
    });
  }, [flipped]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [0, 180]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
      ],
      zIndex: flipped ? 0 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnim.value, [0, 1], [180, 360]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
      ],
      zIndex: flipped ? 1 : 0,
    };
  });

  const getFrontText = () => {
    if (mode === 'en_to_en') return card.definition;
    if (mode === 'pl_to_en') return card.word_pl;
    return '';
  };

  const getFrontLabel = () => {
    if (mode === 'en_to_en') return 'Definition';
    if (mode === 'pl_to_en') return 'Polish Word';
    return '';
  };

  return (
    <Pressable style={styles.container} onPress={onFlip}>
      {/* Front of Card */}
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <View style={styles.cardHeader}>
          <Text style={styles.levelBadge}>{card.cefr.toUpperCase()}</Text>
          <Text style={styles.typeLabel}>{card.type}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.frontLabel}>{getFrontLabel()}</Text>
          <Text style={styles.frontText}>{getFrontText()}</Text>
        </View>
        <Text style={styles.tapPrompt}>Tap to flip</Text>
      </Animated.View>

      {/* Back of Card */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <View style={styles.cardContent}>
          <Text style={styles.englishWord}>{card.word}</Text>
          {card.phon_br ? <Text style={styles.phonetics}>UK {card.phon_br}</Text> : null}
          {card.phon_n_am ? <Text style={styles.phonetics}>US {card.phon_n_am}</Text> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: '90%',
    height: 400,
    maxWidth: 400,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
  },
  cardFront: {
    backgroundColor: '#1E1E2E',
    borderColor: '#313244',
  },
  cardBack: {
    backgroundColor: '#89B4FA',
    borderColor: '#89B4FA',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  levelBadge: {
    color: '#A6E3A1',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  typeLabel: {
    color: '#BAC2DE',
    fontStyle: 'italic',
    fontSize: 14,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontLabel: {
    color: '#6C7086',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  frontText: {
    color: '#CDD6F4',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 34,
  },
  tapPrompt: {
    color: '#585B70',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 'auto',
  },
  englishWord: {
    color: '#11111B',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  phonetics: {
    color: '#313244',
    fontSize: 18,
    marginTop: 4,
  },
});
