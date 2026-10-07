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
  formatDay,
  formatFullDate,
  getWindDirection,
  capitalizeFirst,
  getWeatherBackgroundImage,
} from '../utils/weatherUtils';
import { DailyForecast as DailyType, CurrentWeather } from '../services/weatherApi';

interface Props {
  navigation: any;
  route: any;
}

const ForecastScreen: React.FC<Props> = ({ navigation, route }) => {
  const { daily, city, current } = route.params as {
    daily: DailyType[];
    city: string;
    current: CurrentWeather;
  };

  const bgImage = getWeatherBackgroundImage(
    current?.weather_icon || daily[0]?.weather_icon,
    current?.temp || daily[0]?.temp_max,
    current?.weather_main || daily[0]?.weather_main,
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

          <View style={styles.titleSection}>
            <Text style={styles.titleText}>Dự báo 5 ngày</Text>
            <Text style={styles.subtitleText}>{city}</Text>
          </View>

          {/* Day Cards */}
          {daily.map((day) => {
            const windDir = getWindDirection(day.wind_deg);

            return (
              <TouchableOpacity
                key={day.dt}
                style={styles.dayCard}
                onPress={() =>
                  navigation.navigate('Detail', {
                    day,
                    city,
                    current,
                  })
                }
                activeOpacity={0.8}
              >
                <View style={styles.dayCardHeader}>
                  <View style={styles.dayCardLeft}>
                    <Text style={styles.dayName}>{formatDay(day.dt)}</Text>
                    <Text style={styles.dayDate}>{formatFullDate(day.dt)}</Text>
                  </View>
                  <Text style={styles.dayEmoji}>{getWeatherIcon(day.weather_icon)}</Text>
                </View>

                <Text style={styles.dayDescription}>{capitalizeFirst(day.weather_description)}</Text>

                {/* Normal clean temperature display */}
                <View style={styles.tempInfoRow}>
                  <Text style={styles.tempLabelText}>Nhiệt độ:</Text>
                  <Text style={styles.tempHighText}>{day.temp_max}°</Text>
                  <Text style={styles.tempDividerText}>/</Text>
                  <Text style={styles.tempLowText}>{day.temp_min}°</Text>
                </View>

                {/* Detail Row */}
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>💧</Text>
                    <Text style={styles.detailText}>{day.humidity}%</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>🌧️</Text>
                    <Text style={styles.detailText}>{day.pop}%</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>💨</Text>
                    <Text style={styles.detailText}>{day.wind_speed} m/s {windDir}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayCardLeft: {},
  dayName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayDate: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  dayEmoji: {
    fontSize: 36,
  },
  dayDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  tempInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  tempLabelText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 8,
  },
  tempHighText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tempDividerText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 6,
  },
  tempLowText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  detailText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});

export default ForecastScreen;
