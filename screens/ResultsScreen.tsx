import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { fetchCareerRecommendations } from '../utils/api';
import { Archetype, Career } from '../types';

interface ResultsScreenProps {
  route: any;
  navigation: any;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ route, navigation }) => {
  const { archetype } = route.params as { archetype: Archetype };
  const [recommendations, setRecommendations] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await fetchCareerRecommendations(archetype.id);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewCareerDetails = (career: Career) => {
    navigation.navigate('CareerDetails', { career });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.archetypeCard}>
        <Text style={styles.archetypeLabel}>Your Persona Type</Text>
        <Text style={styles.archetypeName}>{archetype.name}</Text>
        <Text style={styles.archetypeDescription}>{archetype.description}</Text>

        <View style={styles.traitsContainer}>
          <Text style={styles.traitsLabel}>Key Traits:</Text>
          <View style={styles.traitsGrid}>
            {archetype.traits.map((trait: string, index: number) => (
              <View key={index} style={styles.traitBadge}>
                <Text style={styles.traitText}>{trait}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.recommendationsSection}>
        <Text style={styles.sectionTitle}>Recommended Careers</Text>
        <Text style={styles.sectionSubtitle}>
          Based on your personality type
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <View style={styles.careersContainer}>
            {recommendations.map((career) => (
              <TouchableOpacity
                key={career.id}
                style={styles.careerCard}
                onPress={() => viewCareerDetails(career)}
                activeOpacity={0.7}>
                <View style={styles.careerHeader}>
                  <View style={styles.careerTitleContainer}>
                    <Text style={styles.careerTitle}>{career.title}</Text>
                    <Text style={styles.careerCategory}>{career.category}</Text>
                  </View>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{career.matchScore}% Match</Text>
                  </View>
                </View>
                <Text style={styles.careerDescription} numberOfLines={2}>
                  {career.description}
                </Text>
                <Text style={styles.viewMore}>View Details →</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.retakeButton}
        onPress={() => navigation.navigate('Quiz')}>
        <Text style={styles.retakeButtonText}>Retake Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  archetypeCard: {
    backgroundColor: '#007AFF',
    padding: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  archetypeLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  archetypeName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  archetypeDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 20,
  },
  traitsContainer: {
    marginTop: 10,
  },
  traitsLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 10,
    fontWeight: '600',
  },
  traitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  traitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  recommendationsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  loader: {
    marginTop: 30,
  },
  careersContainer: {
    gap: 15,
  },
  careerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  careerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  careerTitleContainer: {
    flex: 1,
  },
  careerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  careerCategory: {
    fontSize: 14,
    color: '#007AFF',
  },
  matchBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  careerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  viewMore: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  retakeButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default ResultsScreen;
