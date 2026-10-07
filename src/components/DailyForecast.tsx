import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { DailyForecast as DailyType } from '../services/weatherApi';
import { getWeatherIcon, formatDay, capitalizeFirst } from '../utils/weatherUtils';

interface Props {
  data: DailyType[];
  onDayPress: (day: DailyType) => void;
  onViewAll: () => void;
}

const DailyForecast: React.FC<Props> = ({ data, onDayPress, onViewAll }) => {
  const displayData = data.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>📅</Text>
          <Text style={styles.sectionTitle}>Dự báo 5 ngày</Text>
        </View>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.moreText}>Thêm chi tiết  ›</Text>
        </TouchableOpacity>
      </View>

      {displayData.map((day, index) => (
        <TouchableOpacity
          key={day.dt}
          style={[styles.dayRow, index < displayData.length - 1 && styles.dayRowBorder]}
          onPress={() => onDayPress(day)}
          activeOpacity={0.7}
        >
          <Text style={styles.dayName}>{formatDay(day.dt)}</Text>
          <Text style={styles.weatherIcon}>{getWeatherIcon(day.weather_icon)}</Text>
          <Text style={styles.weatherDesc} numberOfLines={1}>
            {capitalizeFirst(day.weather_description)}
          </Text>
          <View style={styles.tempContainer}>
            <Text style={styles.tempMax}>{day.temp_max}°</Text>
            <Text style={styles.tempDivider}>/</Text>
            <Text style={styles.tempMin}>{day.temp_min}°</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
        <Text style={styles.viewAllText}>Dự báo 5 ngày</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moreText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dayRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  dayName: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    width: 75,
  },
  weatherIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  weatherDesc: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 8,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tempMax: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tempDivider: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  tempMin: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  viewAllButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default DailyForecast;
