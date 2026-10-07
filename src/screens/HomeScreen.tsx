import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import { getWeatherData, WeatherData, DailyForecast as DailyType } from '../services/weatherApi';
import {
  getWeatherIcon,
  getWeatherBackground,
  getWeatherBackgroundImage,
  weatherImages,
  capitalizeFirst,
} from '../utils/weatherUtils';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import WeatherMetrics from '../components/WeatherMetrics';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền truy cập vị trí',
            message: 'Ứng dụng cần quyền truy cập vị trí để hiển thị thời tiết tại vị trí của bạn.',
            buttonPositive: 'Đồng ý',
            buttonNegative: 'Từ chối',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  };

  const fetchWeather = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLocationGranted(false);
        setError('Không có quyền truy cập vị trí. Vui lòng cấp quyền trong Cài đặt.');
        setLoading(false);
        setRefreshing(false);
        return;
      }
      setLocationGranted(true);

      const location = await getCurrentLocation();
      const data = await getWeatherData(location.lat, location.lon);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      if (err.code === 1) {
        setError('Không có quyền truy cập vị trí.');
      } else if (err.code === 2) {
        setError('Không thể xác định vị trí. Vui lòng bật GPS.');
      } else if (err.code === 3) {
        setError('Hết thời gian chờ lấy vị trí.');
      } else {
        setError('Không thể tải dữ liệu thời tiết. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWeather(true);
  }, [fetchWeather]);

  const handleDayPress = (day: DailyType) => {
    navigation.navigate('Detail', {
      day,
      city: weatherData?.current.city,
      current: weatherData?.current,
    });
  };

  const handleViewAllForecast = () => {
    navigation.navigate('Forecast', {
      daily: weatherData?.daily,
      city: weatherData?.current.city,
      current: weatherData?.current,
    });
  };

  if (loading) {
    return (
      <ImageBackground
        source={weatherImages.nang}
        style={styles.container}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.35)', 'rgba(0, 0, 0, 0.6)']}
          style={styles.loadingContainer}
        >
          <StatusBar barStyle="light-content" />
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Đang tải dữ liệu thời tiết...</Text>
          <Text style={styles.loadingSubtext}>Vui lòng chờ trong giây lát</Text>
        </LinearGradient>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground
        source={weatherImages.may}
        style={styles.container}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.65)']}
          style={styles.loadingContainer}
        >
          <StatusBar barStyle="light-content" />
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchWeather()}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
          {!locationGranted && (
            <Text style={styles.hintText}>
              Mẹo: Vào Cài đặt {'>'} Ứng dụng {'>'} WeatherApp {'>'} Quyền để cấp quyền vị trí.
            </Text>
          )}
        </LinearGradient>
      </ImageBackground>
    );
  }

  if (!weatherData) {
    return null;
  }

  const { current, hourly, daily } = weatherData;
  const bgImage = getWeatherBackgroundImage(
    current.weather_icon,
    current.temp,
    current.weather_main,
  );

  return (
    <ImageBackground
      source={bgImage}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0.55)']}
        style={styles.overlay}
      >
        <StatusBar barStyle="light-content" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>⋮</Text>
            </TouchableOpacity>
          </View>

          {/* Current Weather */}
          <View style={styles.currentWeather}>
            <Text style={styles.cityName}>{current.city}</Text>
            <Text style={styles.temperature}>{current.temp}°</Text>
            <Text style={styles.description}>
              {capitalizeFirst(current.weather_description)}  {current.temp_max}°/{current.temp_min}°
            </Text>

            {/* AQI Badge (simulated) */}
            <View style={styles.aqiBadge}>
              <Text style={styles.aqiIcon}>🍃</Text>
              <Text style={styles.aqiText}>AQI {Math.floor(Math.random() * 50) + 50}</Text>
            </View>
          </View>

          <View style={styles.spacer} />

          <DailyForecast
            data={daily}
            onDayPress={handleDayPress}
            onViewAll={handleViewAllForecast}
          />

          <HourlyForecast data={hourly} timezone={current.timezone} />

          <WeatherMetrics data={current} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 0,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 30,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 16,
    lineHeight: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: (StatusBar.currentHeight || 40) + 8,
    paddingBottom: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  currentWeather: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  cityName: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  temperature: {
    fontSize: 96,
    color: '#FFFFFF',
    fontWeight: '200',
    lineHeight: 110,
    letterSpacing: -2,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    marginTop: -4,
  },
  aqiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  aqiIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  aqiText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  spacer: {
    height: width * 0.45,
  },
});

export default HomeScreen;
