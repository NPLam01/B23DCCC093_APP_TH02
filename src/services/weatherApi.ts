import axios from 'axios';

const API_KEY = '4d8fb5b93d4af21d66a2948710284366';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  clouds: number;
  uvi?: number;
  rain_1h?: number;
  snow_1h?: number;
  sunrise: number;
  sunset: number;
  dt: number;
  timezone: number;
  city: string;
  country: string;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  wind_speed: number;
  wind_deg: number;
  pop: number;
  rain_3h?: number;
}

export interface DailyForecast {
  dt: number;
  temp_min: number;
  temp_max: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  pop: number;
  rain?: number;
  pressure: number;
  clouds: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

async function getCityName(lat: number, lon: number): Promise<{ city: string; country: string }> {
  try {
    const response = await axios.get(`${GEO_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
        appid: API_KEY,
      },
    });
    if (response.data && response.data.length > 0) {
      return {
        city: response.data[0].local_names?.vi || response.data[0].name,
        country: response.data[0].country,
      };
    }
    return { city: 'Unknown', country: '' };
  } catch {
    return { city: 'Unknown', country: '' };
  }
}


async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'vi',
    },
  });

  const data = response.data;
  const cityInfo = await getCityName(lat, lon);

  return {
    temp: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    temp_min: Math.round(data.main.temp_min),
    temp_max: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,
    wind_speed: data.wind.speed,
    wind_deg: data.wind.deg,
    wind_gust: data.wind.gust,
    weather_main: data.weather[0].main,
    weather_description: data.weather[0].description,
    weather_icon: data.weather[0].icon,
    clouds: data.clouds.all,
    rain_1h: data.rain?.['1h'],
    snow_1h: data.snow?.['1h'],
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    dt: data.dt,
    timezone: data.timezone,
    city: cityInfo.city,
    country: cityInfo.country,
  };
}

// Get 5-day / 3-hour forecast
async function getForecast(lat: number, lon: number): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'vi',
      cnt: 40,
    },
  });

  const data = response.data;

  const hourly: HourlyForecast[] = data.list.slice(0, 8).map((item: any) => ({
    dt: item.dt,
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    weather_main: item.weather[0].main,
    weather_description: item.weather[0].description,
    weather_icon: item.weather[0].icon,
    wind_speed: item.wind.speed,
    wind_deg: item.wind.deg,
    pop: Math.round(item.pop * 100),
    rain_3h: item.rain?.['3h'],
  }));

  const dailyMap: { [key: string]: any } = {};
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap[date]) {
      dailyMap[date] = {
        dt: item.dt,
        temps: [],
        weather: item.weather[0],
        humidity: [],
        wind_speed: [],
        wind_deg: item.wind.deg,
        pop: [],
        rain: 0,
        pressure: [],
        clouds: [],
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].humidity.push(item.main.humidity);
    dailyMap[date].wind_speed.push(item.wind.speed);
    dailyMap[date].pop.push(item.pop);
    dailyMap[date].rain += item.rain?.['3h'] || 0;
    dailyMap[date].pressure.push(item.main.pressure);
    dailyMap[date].clouds.push(item.clouds.all);
  });

  const daily: DailyForecast[] = Object.values(dailyMap).map((day: any) => ({
    dt: day.dt,
    temp_min: Math.round(Math.min(...day.temps)),
    temp_max: Math.round(Math.max(...day.temps)),
    weather_main: day.weather.main,
    weather_description: day.weather.description,
    weather_icon: day.weather.icon,
    humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length),
    wind_speed: Math.round(day.wind_speed.reduce((a: number, b: number) => a + b, 0) / day.wind_speed.length * 10) / 10,
    wind_deg: day.wind_deg,
    pop: Math.round(Math.max(...day.pop) * 100),
    rain: Math.round(day.rain * 10) / 10,
    pressure: Math.round(day.pressure.reduce((a: number, b: number) => a + b, 0) / day.pressure.length),
    clouds: Math.round(day.clouds.reduce((a: number, b: number) => a + b, 0) / day.clouds.length),
  }));

  return { hourly, daily };
}


export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const [current, forecast] = await Promise.all([
    getCurrentWeather(lat, lon),
    getForecast(lat, lon),
  ]);

  return {
    current,
    hourly: forecast.hourly,
    daily: forecast.daily,
  };
}

export default {
  getWeatherData,
};
