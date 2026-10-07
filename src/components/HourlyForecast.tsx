import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { HourlyForecast as HourlyType } from '../services/weatherApi';
import { getWeatherIcon, formatTime } from '../utils/weatherUtils';

interface Props {
  data: HourlyType[];
  timezone: number;
}

const HourlyForecast: React.FC<Props> = ({ data, timezone }) => {
  const renderItem = ({ item, index }: { item: HourlyType; index: number }) => (
    <View style={styles.hourItem}>
      <Text style={styles.timeText}>
        {index === 0 ? 'Bây giờ' : formatTime(item.dt, timezone)}
      </Text>
      <Text style={styles.weatherIcon}>{getWeatherIcon(item.weather_icon)}</Text>
      {item.pop > 0 && (
        <Text style={styles.popText}>{item.pop}%</Text>
      )}
      <Text style={styles.tempText}>{item.temp}°</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Dự báo theo giờ</Text>
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.dt.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 12,
  },
  hourItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 65,
  },
  timeText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 8,
  },
  weatherIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  popText: {
    fontSize: 11,
    color: '#69D2E7',
    fontWeight: '600',
    marginBottom: 2,
  },
  tempText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default HourlyForecast;
