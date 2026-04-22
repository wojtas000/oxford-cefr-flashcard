import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { Flashcard, StudyMode, CefrLevel } from '../types';
import rawData from '../assets/data/flashcards.json';

interface DeckContextType {
  mode: StudyMode;
  setMode: (mode: StudyMode) => void;
  cefrLevel: CefrLevel;
  setCefrLevel: (level: CefrLevel) => void;
  cards: Flashcard[]; // These will be the ACTIVE cards (not marked as done)
  totalCardsCount: number; // Total cards for the current level (including done)
  doneCount: number;
  currentIndex: number;
  nextCard: () => void;
  previousCard: () => void;
  shuffleDeck: () => void;
  resetDeck: () => void; // Resets position
  markAsDone: (id: string) => void;
  resetProgress: () => void; // Clears done cards
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export const DeckProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<StudyMode>('en_to_en');
  const [cefrLevel, setCefrLevel] = useState<CefrLevel>('both');
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [doneCardIds, setDoneCardIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize and filter cards based on CEFR level
  useEffect(() => {
    let parsedCards: Flashcard[] = Object.entries(rawData).map(([id, data]: [string, any]) => ({
      id,
      word: data.word,
      type: data.type,
      cefr: data.cefr as 'b2' | 'c1',
      definition: data.definition,
      example: data.example,
      phon_br: data.phon_br,
      phon_n_am: data.phon_n_am,
      word_pl: data.word_pl || '',
    }));

    if (cefrLevel !== 'both') {
      parsedCards = parsedCards.filter(c => c.cefr === cefrLevel);
    }

    setAllCards(parsedCards);
    setCurrentIndex(0);
  }, [cefrLevel]);

  // Compute the active cards
  const activeCards = useMemo(() => {
    return allCards.filter(c => !doneCardIds.has(c.id));
  }, [allCards, doneCardIds]);

  // Make sure currentIndex stays within bounds when activeCards changes
  useEffect(() => {
    if (activeCards.length > 0 && currentIndex >= activeCards.length) {
      setCurrentIndex(Math.max(0, activeCards.length - 1));
    }
  }, [activeCards.length, currentIndex]);

  const nextCard = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, Math.max(0, activeCards.length - 1)));
  };

  const previousCard = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const shuffleDeck = () => {
    setAllCards((prevCards) => [...prevCards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
  };

  const markAsDone = (id: string) => {
    setDoneCardIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    // The activeCards array will automatically shrink.
    // If currentIndex is not at the end, it will automatically point to the next card
    // because the current element is removed. If it is at the end, the useEffect above will clamp it.
  };

  const resetProgress = () => {
    setDoneCardIds(new Set());
    setCurrentIndex(0);
  };

  return (
    <DeckContext.Provider
      value={{
        mode,
        setMode,
        cefrLevel,
        setCefrLevel,
        cards: activeCards,
        totalCardsCount: allCards.length,
        doneCount: doneCardIds.size,
        currentIndex,
        nextCard,
        previousCard,
        shuffleDeck,
        resetDeck,
        markAsDone,
        resetProgress,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => {
  const context = useContext(DeckContext);
  if (context === undefined) {
    throw new Error('useDeck must be used within a DeckProvider');
  }
  return context;
};
