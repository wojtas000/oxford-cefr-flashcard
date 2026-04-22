import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useDeck } from '../context/DeckContext';
import { StudyMode, CefrLevel } from '../types';
import { BookOpen, Languages, Settings2, RotateCcw } from 'lucide-react-native';

export const HomeScreen = ({ navigation }: any) => {
  const { mode, setMode, cefrLevel, setCefrLevel, cards, totalCardsCount, doneCount, resetProgress } = useDeck();

  const handleStart = () => {
    navigation.navigate('Study');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Oxford 5000</Text>
          <Text style={styles.subtitle}>Flashcard Mastery</Text>
        </View>

        <View style={styles.statsCard}>
          <BookOpen color="#A6E3A1" size={32} />
          <View style={styles.statsInfo}>
            <Text style={styles.statsValue}>{totalCardsCount - doneCount} / {totalCardsCount}</Text>
            <Text style={styles.statsLabel}>Cards Remaining</Text>
          </View>
          {doneCount > 0 && (
            <Pressable style={styles.globalResetButton} onPress={resetProgress}>
              <RotateCcw color="#F38BA8" size={20} />
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Settings2 color="#BAC2DE" size={20} style={{ marginRight: 8 }} />
            CEFR Level
          </Text>
          <View style={styles.buttonRow}>
            {(['b2', 'c1', 'both'] as CefrLevel[]).map((level) => (
              <Pressable
                key={level}
                style={[styles.toggleButton, cefrLevel === level && styles.toggleButtonActive]}
                onPress={() => setCefrLevel(level)}
              >
                <Text
                  style={[styles.toggleText, cefrLevel === level && styles.toggleTextActive]}
                >
                  {level.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Languages color="#BAC2DE" size={20} style={{ marginRight: 8 }} />
            Study Mode
          </Text>
          <View style={styles.modeColumn}>
            <Pressable
              style={[styles.modeButton, mode === 'en_to_en' && styles.modeButtonActive]}
              onPress={() => setMode('en_to_en')}
            >
              <Text style={[styles.modeText, mode === 'en_to_en' && styles.modeTextActive]}>
                English Definition → Word
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modeButton, mode === 'pl_to_en' && styles.modeButtonActive]}
              onPress={() => setMode('pl_to_en')}
            >
              <Text style={[styles.modeText, mode === 'pl_to_en' && styles.modeTextActive]}>
                Polish Word → English Word
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start Studying</Text>
          </Pressable>
        </View>
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
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#CDD6F4', // Text
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A6ADC8', // Subtext0
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  statsCard: {
    backgroundColor: '#1E1E2E', // Mantle
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#313244', // Surface0
  },
  statsInfo: {
    marginLeft: 20,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#CDD6F4',
  },
  statsLabel: {
    fontSize: 14,
    color: '#7F849C', // Overlay0
    marginTop: 4,
  },
  globalResetButton: {
    marginLeft: 'auto',
    padding: 10,
    backgroundColor: '#313244',
    borderRadius: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#BAC2DE', // Subtext1
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#313244',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#89B4FA', // Blue
    borderColor: '#89B4FA',
  },
  toggleText: {
    color: '#A6ADC8',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#11111B', // Base
  },
  modeColumn: {
    gap: 12,
  },
  modeButton: {
    backgroundColor: '#1E1E2E',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#313244',
  },
  modeButtonActive: {
    backgroundColor: '#CBA6F7', // Mauve
    borderColor: '#CBA6F7',
  },
  modeText: {
    color: '#A6ADC8',
    fontWeight: '600',
    fontSize: 16,
  },
  modeTextActive: {
    color: '#11111B',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#A6E3A1', // Green
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#A6E3A1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  startButtonText: {
    color: '#11111B',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
