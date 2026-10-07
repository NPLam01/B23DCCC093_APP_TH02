import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { CurrentWeather } from '../services/weatherApi';
import { getWindDirection } from '../utils/weatherUtils';

interface Props {
  data: CurrentWeather;
}

const MetricCard: React.FC<{
  icon: string;
  title: string;
  value: string;
  subtitle?: string;
}> = ({ icon, title, value, subtitle }) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
  </View>
);

const WeatherMetrics: React.FC<Props> = ({ data }) => {
  const windDir = getWindDirection(data.wind_deg);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MetricCard
          icon="🌡️"
          title="Cảm giác như"
          value={`${data.feels_like}°`}
          subtitle={
            data.feels_like > data.temp
              ? 'Nóng hơn thực tế'
              : data.feels_like < data.temp
                ? 'Lạnh hơn thực tế'
                : 'Tương tự nhiệt độ thực'
          }
        />
        <MetricCard
          icon="💧"
          title="Độ ẩm"
          value={`${data.humidity}%`}
          subtitle={
            data.humidity > 70
              ? 'Độ ẩm cao'
              : data.humidity < 30
                ? 'Độ ẩm thấp'
                : 'Độ ẩm vừa phải'
          }
        />
      </View>
      <View style={styles.row}>
        <MetricCard
          icon="💨"
          title="Tốc độ gió"
          value={`${data.wind_speed} m/s`}
          subtitle={`Hướng ${windDir}`}
        />
        <MetricCard
          icon="🔭"
          title="Tầm nhìn"
          value={`${(data.visibility / 1000).toFixed(1)} km`}
          subtitle={
            data.visibility >= 10000
              ? 'Tầm nhìn tốt'
              : data.visibility >= 5000
                ? 'Tầm nhìn trung bình'
                : 'Tầm nhìn hạn chế'
          }
        />
      </View>
      <View style={styles.row}>
        <MetricCard
          icon="🧭"
          title="Áp suất"
          value={`${data.pressure} hPa`}
          subtitle={
            data.pressure > 1020
              ? 'Áp suất cao'
              : data.pressure < 1000
                ? 'Áp suất thấp'
                : 'Áp suất bình thường'
          }
        />
        <MetricCard
          icon="☁️"
          title="Mây che phủ"
          value={`${data.clouds}%`}
          subtitle={
            data.clouds > 75
              ? 'Nhiều mây'
              : data.clouds > 25
                ? 'Ít mây'
                : 'Trời quang'
          }
        />
      </View>
      <View style={styles.row}>
        <MetricCard
          icon="🌅"
          title="Bình minh"
          value={new Date((data.sunrise + data.timezone) * 1000).toISOString().substr(11, 5)}
        />
        <MetricCard
          icon="🌇"
          title="Hoàng hôn"
          value={new Date((data.sunset + data.timezone) * 1000).toISOString().substr(11, 5)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 16,
  },
});

export default WeatherMetrics;
