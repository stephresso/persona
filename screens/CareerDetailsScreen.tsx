import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Career, CompanySize } from '../types';

interface CareerDetailsScreenProps {
  route: any;
  navigation: any;
}

const CareerDetailsScreen: React.FC<CareerDetailsScreenProps> = ({ route }) => {
  const { career } = route.params as { career: Career };
  const [selectedCompanySize, setSelectedCompanySize] = useState<CompanySize>('mid');

  const companySizeDetails = career.companySize[selectedCompanySize];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{career.title}</Text>
        <Text style={styles.category}>{career.category}</Text>
        <Text style={styles.description}>{career.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Skills</Text>
        <View style={styles.skillsContainer}>
          {career.skills.map((skill: string, index: number) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Size</Text>
        <Text style={styles.sectionSubtitle}>
          Choose a company size to see how this role varies
        </Text>
        <View style={styles.companySizeButtons}>
          <TouchableOpacity
            style={[
              styles.sizeButton,
              selectedCompanySize === 'startup' && styles.sizeButtonActive,
            ]}
            onPress={() => setSelectedCompanySize('startup')}>
            <Text
              style={[
                styles.sizeButtonText,
                selectedCompanySize === 'startup' && styles.sizeButtonTextActive,
              ]}>
              Startup
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sizeButton,
              selectedCompanySize === 'mid' && styles.sizeButtonActive,
            ]}
            onPress={() => setSelectedCompanySize('mid')}>
            <Text
              style={[
                styles.sizeButtonText,
                selectedCompanySize === 'mid' && styles.sizeButtonTextActive,
              ]}>
              Mid-Size
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sizeButton,
              selectedCompanySize === 'enterprise' && styles.sizeButtonActive,
            ]}
            onPress={() => setSelectedCompanySize('enterprise')}>
            <Text
              style={[
                styles.sizeButtonText,
                selectedCompanySize === 'enterprise' && styles.sizeButtonTextActive,
              ]}>
              Enterprise
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsDescription}>
          {companySizeDetails.description}
        </Text>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Typical Tasks</Text>
          {companySizeDetails.typicalTasks.map((task: string, index: number) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>{task}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Pros</Text>
          {companySizeDetails.pros.map((pro: string, index: number) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.proBullet}>✓</Text>
              <Text style={styles.listItemText}>{pro}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Cons</Text>
          {companySizeDetails.cons.map((con: string, index: number) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.conBullet}>✗</Text>
              <Text style={styles.listItemText}>{con}</Text>
            </View>
          ))}
        </View>

        <View style={styles.salarySection}>
          <Text style={styles.detailSectionTitle}>Salary Range</Text>
          <Text style={styles.salaryText}>{career.salary[selectedCompanySize]}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  skillText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  companySizeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sizeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sizeButtonTextActive: {
    color: '#FFFFFF',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
    width: 20,
  },
  proBullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 10,
    width: 20,
  },
  conBullet: {
    fontSize: 16,
    color: '#F44336',
    marginRight: 10,
    width: 20,
  },
  listItemText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    flex: 1,
  },
  salarySection: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  salaryText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
});

export default CareerDetailsScreen;
