
export const weatherImages = {
  nang: require('../../assets/nang.jpg'),
  troitoi: require('../../assets/troitoi.jpg'),
  mua: require('../../assets/mua.jpg'),
  may: require('../../assets/may.jpg'),
  lanh: require('../../assets/lanh.jpg'),
};

export const getWeatherBackgroundImage = (
  iconCode?: string,
  temp?: number,
  weatherMain?: string,
): any => {
  // Cold condition (<= 12°C or Snow)
  if ((temp !== undefined && temp <= 12 && weatherMain !== 'Rain') || weatherMain?.toLowerCase() === 'snow') {
    return weatherImages.lanh;
  }

  if (!iconCode) {
    return weatherImages.nang;
  }

  const code = iconCode.substring(0, 2);
  const isNight = iconCode.endsWith('n');

  // Snow
  if (code === '13') {
    return weatherImages.lanh;
  }

  // Rain, Drizzle, Thunderstorm
  if (
    code === '09' ||
    code === '10' ||
    code === '11' ||
    ['rain', 'drizzle', 'thunderstorm'].includes(weatherMain?.toLowerCase() || '')
  ) {
    return weatherImages.mua;
  }

  // Night condition
  if (isNight) {
    return weatherImages.troitoi;
  }

  // Cloudy, Fog, Mist, Haze
  if (
    code === '03' ||
    code === '04' ||
    code === '50' ||
    ['clouds', 'mist', 'fog', 'haze', 'smoke', 'dust'].includes(weatherMain?.toLowerCase() || '')
  ) {
    return weatherImages.may;
  }

  // Sunny / Clear day (01d, 02d)
  return weatherImages.nang;
};

export const getWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '🌨️',
    '13n': '🌨️',
    '50d': '🌫️',
    '50n': '🌫️',
  };
  return iconMap[iconCode] || '☁️';
};

export const getWeatherBackground = (iconCode: string): string[] => {
  const code = iconCode.substring(0, 2);
  const isDay = iconCode.endsWith('d');

  if (isDay) {
    switch (code) {
      case '01': return ['#4A90D9', '#87CEEB', '#B0E0E6']; // Clear sky
      case '02': return ['#5B9BD5', '#8BB8E8', '#C4D8E8']; // Few clouds
      case '03':
      case '04': return ['#6B7B8D', '#8B9DAF', '#A8B8C8']; // Cloudy
      case '09':
      case '10': return ['#4A6B8A', '#5C7D9E', '#7B9DB5']; // Rain
      case '11': return ['#3A4A5C', '#4A5A6C', '#5A6A7C']; // Thunderstorm
      case '13': return ['#8BA5C2', '#A8C0D8', '#C5D8E8']; // Snow
      case '50': return ['#8B9DAF', '#A0B0C0', '#B5C5D5']; // Mist
      default: return ['#4A90D9', '#87CEEB', '#B0E0E6'];
    }
  } else {
    switch (code) {
      case '01': return ['#1A1A3E', '#2D2D6B', '#4A4A8A']; // Clear night
      case '02': return ['#1E2A3A', '#2E3A4A', '#3E4A5A']; // Few clouds
      case '03':
      case '04': return ['#2A2A3A', '#3A3A4A', '#4A4A5A']; // Cloudy
      case '09':
      case '10': return ['#1A2A3A', '#2A3A4A', '#3A4A5A']; // Rain
      case '11': return ['#151520', '#252530', '#353540']; // Thunderstorm
      case '13': return ['#2A3A4A', '#3A4A5A', '#4A5A6A']; // Snow
      case '50': return ['#2A2A3A', '#3A3A4A', '#4A4A5A']; // Mist
      default: return ['#1A1A3E', '#2D2D6B', '#4A4A8A'];
    }
  }
};

export const formatTime = (timestamp: number, timezoneOffset: number = 0): string => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const hours = utcDate.getHours().toString().padStart(2, '0');
  const minutes = utcDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hôm nay';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Ngày mai';
  }

  const days = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
  return days[date.getDay()];
};

export const formatFullDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const months = [
    'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
    'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12',
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

export const getWindDirection = (deg: number): string => {
  const directions = ['B', 'ĐB', 'Đ', 'ĐN', 'N', 'TN', 'T', 'TB'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

export const getUVLevel = (uvi: number): { label: string; color: string } => {
  if (uvi <= 2) { return { label: 'Thấp', color: '#4CAF50' }; }
  if (uvi <= 5) { return { label: 'Trung bình', color: '#FFC107' }; }
  if (uvi <= 7) { return { label: 'Cao', color: '#FF9800' }; }
  if (uvi <= 10) { return { label: 'Rất cao', color: '#F44336' }; }
  return { label: 'Cực cao', color: '#9C27B0' };
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
