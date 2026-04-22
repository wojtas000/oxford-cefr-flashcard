import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState<StudyMode>('en_to_en');
  const [cefrLevel, setCefrLevel] = useState<CefrLevel>('both');
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [doneCardIds, setDoneCardIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('deck_mode');
        const savedLevel = await AsyncStorage.getItem('deck_cefrLevel');
        const savedDoneIds = await AsyncStorage.getItem('deck_doneCardIds');
        const savedIndex = await AsyncStorage.getItem('deck_currentIndex');
        const savedAllCards = await AsyncStorage.getItem('deck_allCards');

        let initialLevel: CefrLevel = 'both';
        if (savedMode) setMode(savedMode as StudyMode);
        if (savedLevel) {
          initialLevel = savedLevel as CefrLevel;
          setCefrLevel(initialLevel);
        }
        if (savedDoneIds) setDoneCardIds(new Set(JSON.parse(savedDoneIds)));
        
        // initialize cards
        let parsedCards: Flashcard[] = [];
        if (savedAllCards) {
           parsedCards = JSON.parse(savedAllCards);
        } else {
           parsedCards = Object.entries(rawData).map(([id, data]: [string, any]) => ({
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
           if (initialLevel !== 'both') {
             parsedCards = parsedCards.filter(c => c.cefr === initialLevel);
           }
        }
        setAllCards(parsedCards);

        if (savedIndex) {
          setCurrentIndex(parseInt(savedIndex, 10));
        } else {
          setCurrentIndex(0);
        }
      } catch (e) {
        console.error('Failed to load saved state:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, []);

  // Update cards based on CEFR level change ONLY when user triggers it (isLoaded is true)
  useEffect(() => {
    if (!isLoaded) return; // Ignore initial render, loadState handles it

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
  }, [cefrLevel, isLoaded]);

  // Save state when it changes
  useEffect(() => {
    if (!isLoaded) return;
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('deck_mode', mode);
        await AsyncStorage.setItem('deck_cefrLevel', cefrLevel);
        await AsyncStorage.setItem('deck_doneCardIds', JSON.stringify(Array.from(doneCardIds)));
        await AsyncStorage.setItem('deck_currentIndex', currentIndex.toString());
        await AsyncStorage.setItem('deck_allCards', JSON.stringify(allCards));
      } catch (e) {
        console.error('Failed to save state:', e);
      }
    };
    saveState();
  }, [mode, cefrLevel, doneCardIds, currentIndex, allCards, isLoaded]);

  // Compute the active cards
  const activeCards = useMemo(() => {
    return allCards.filter(c => !doneCardIds.has(c.id));
  }, [allCards, doneCardIds]);

  // Make sure currentIndex stays within bounds when activeCards changes
  useEffect(() => {
    if (isLoaded && activeCards.length > 0 && currentIndex >= activeCards.length) {
      setCurrentIndex(Math.max(0, activeCards.length - 1));
    }
  }, [activeCards.length, currentIndex, isLoaded]);

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
  };

  const resetProgress = () => {
    setDoneCardIds(new Set());
    setCurrentIndex(0);
  };

  // Do not render children until data is loaded to prevent flashing of default states
  if (!isLoaded) {
    return null; // Or a loading spinner
  }

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
