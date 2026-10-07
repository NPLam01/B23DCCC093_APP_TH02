import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  getWeatherIcon,
  getWindDirection,
  formatFullDate,
  capitalizeFirst,
  getWeatherBackgroundImage,
} from '../utils/weatherUtils';
import { DailyForecast as DailyType, CurrentWeather } from '../services/weatherApi';

interface Props {
  navigation: any;
  route: any;
}

const DetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { day, city, current } = route.params as {
    day: DailyType;
    city: string;
    current: CurrentWeather;
  };

  const windDir = getWindDirection(day.wind_deg);
  const bgImage = getWeatherBackgroundImage(
    day.weather_icon || current?.weather_icon,
    day.temp_max,
    day.weather_main || current?.weather_main,
  );

  return (
    <ImageBackground source={bgImage} style={styles.container} resizeMode="cover">
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.55)']}
        style={styles.overlay}
      >
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backText}>‹  Quay lại</Text>
            </TouchableOpacity>
          </View>

          {/* Day Title */}
          <View style={styles.titleSection}>
            <Text style={styles.dateText}>{formatFullDate(day.dt)}</Text>
            <Text style={styles.cityText}>{city}</Text>
            <Text style={styles.weatherEmoji}>{getWeatherIcon(day.weather_icon)}</Text>
            <Text style={styles.weatherDesc}>
              {capitalizeFirst(day.weather_description)}
            </Text>
          </View>

          {/* Temperature */}
          <View style={styles.tempSection}>
            <View style={styles.tempRow}>
              <View style={styles.tempItem}>
                <Text style={styles.tempLabel}>Cao nhất</Text>
                <Text style={styles.tempValueHigh}>{day.temp_max}°</Text>
              </View>
              <View style={styles.tempDivider} />
              <View style={styles.tempItem}>
                <Text style={styles.tempLabel}>Thấp nhất</Text>
                <Text style={styles.tempValueLow}>{day.temp_min}°</Text>
              </View>
            </View>
          </View>

          {/* Detail Cards */}
          <View style={styles.detailGrid}>
            <View style={styles.detailRow}>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>💧</Text>
                <Text style={styles.detailLabel}>Độ ẩm</Text>
                <Text style={styles.detailValue}>{day.humidity}%</Text>
                <Text style={styles.detailSubvalue}>
                  {day.humidity > 70 ? 'Độ ẩm cao' : day.humidity < 30 ? 'Độ ẩm thấp' : 'Dễ chịu'}
                </Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>🌧️</Text>
                <Text style={styles.detailLabel}>Khả năng mưa</Text>
                <Text style={styles.detailValue}>{day.pop}%</Text>
                <Text style={styles.detailSubvalue}>
                  {day.pop > 50 ? 'Khả năng cao' : day.pop > 20 ? 'Có thể có mưa' : 'Ít khả năng'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>💨</Text>
                <Text style={styles.detailLabel}>Gió</Text>
                <Text style={styles.detailValue}>{day.wind_speed} m/s</Text>
                <Text style={styles.detailSubvalue}>Hướng {windDir}</Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>🧭</Text>
                <Text style={styles.detailLabel}>Áp suất</Text>
                <Text style={styles.detailValue}>{day.pressure} hPa</Text>
                <Text style={styles.detailSubvalue}>
                  {day.pressure > 1020 ? 'Cao' : day.pressure < 1000 ? 'Thấp' : 'Bình thường'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>☁️</Text>
                <Text style={styles.detailLabel}>Mây che phủ</Text>
                <Text style={styles.detailValue}>{day.clouds}%</Text>
                <Text style={styles.detailSubvalue}>
                  {day.clouds > 70 ? 'Nhiều mây' : day.clouds > 30 ? 'Mây rải rác' : 'Ít mây'}
                </Text>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>🌧️</Text>
                <Text style={styles.detailLabel}>Lượng mưa</Text>
                <Text style={styles.detailValue}>{day.rain || 0} mm</Text>
                <Text style={styles.detailSubvalue}>
                  {(day.rain || 0) > 10 ? 'Mưa nhiều' : (day.rain || 0) > 0 ? 'Mưa nhẹ' : 'Không mưa'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: (StatusBar.currentHeight || 40) + 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  dateText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  cityText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
  },
  weatherEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  weatherDesc: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  tempSection: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempItem: {
    flex: 1,
    alignItems: 'center',
  },
  tempLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontWeight: '500',
  },
  tempValueHigh: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  tempValueLow: {
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
  },
  tempDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  detailGrid: {
    marginHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 4,
  },
  detailIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  detailSubvalue: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default DetailScreen;
