import { useEffect, useState } from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  ExternalLink,
  Sun,
} from 'lucide-react';

interface WeatherDay {
  date: string;
  code: number;
  high: number;
  low: number;
  precipitationChance: number;
}

interface ForecastState {
  days: WeatherDay[] | null;
  loading: boolean;
  error: string | null;
}

interface ForecastResponse {
  daily?: {
    time?: unknown;
    weather_code?: unknown;
    temperature_2m_max?: unknown;
    temperature_2m_min?: unknown;
    precipitation_probability_max?: unknown;
  };
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item));
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function parseForecast(payload: ForecastResponse): WeatherDay[] {
  const { daily } = payload;
  const dates = daily?.time;
  const codes = daily?.weather_code;
  const highs = daily?.temperature_2m_max;
  const lows = daily?.temperature_2m_min;
  const precipitation = daily?.precipitation_probability_max;
  if (
    !isStringArray(dates) ||
    !isNumberArray(codes) ||
    !isNumberArray(highs) ||
    !isNumberArray(lows) ||
    !isNumberArray(precipitation)
  ) {
    throw new Error('The weather service returned an unexpected forecast.');
  }

  const count = dates.length;
  if (
    codes.length !== count ||
    highs.length !== count ||
    lows.length !== count ||
    precipitation.length !== count
  ) {
    throw new Error('The weather service returned an incomplete forecast.');
  }

  return dates.map((date, index) => ({
    date,
    code: codes[index],
    high: highs[index],
    low: lows[index],
    precipitationChance: precipitation[index],
  }));
}

function describeWeather(code: number): { label: string; Icon: typeof Sun } {
  if (code === 0) return { label: 'Clear', Icon: Sun };
  if (code === 1 || code === 2) return { label: 'Partly cloudy', Icon: CloudSun };
  if (code === 3) return { label: 'Cloudy', Icon: Cloud };
  if (code === 45 || code === 48) return { label: 'Fog', Icon: CloudFog };
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return { label: 'Drizzle', Icon: CloudDrizzle };
  }
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67 || code === 80 || code === 81 || code === 82) {
    return { label: 'Rain', Icon: CloudRain };
  }
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return { label: 'Snow', Icon: CloudSnow };
  }
  if (code === 95 || code === 96 || code === 99) return { label: 'Thunderstorm', Icon: CloudLightning };
  return { label: 'Conditions unavailable', Icon: Cloud };
}

function formatForecastDay(value: string): { weekday: string; date: string } {
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return {
    weekday: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(parsed),
    date: new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(parsed),
  };
}

export default function WeatherForecast({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const [state, setState] = useState<ForecastState>({
    days: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      forecast_days: '7',
      timezone: 'auto',
    });

    setState({ days: null, loading: true, error: null });
    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Weather forecast request failed (${response.status}).`);
        }
        return (await response.json()) as ForecastResponse;
      })
      .then((payload) => {
        setState({ days: parseForecast(payload), loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          days: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Could not load the weather forecast.',
        });
      });

    return () => controller.abort();
  }, [latitude, longitude]);

  return (
    <section className="container-page mt-12" aria-labelledby="weather-heading">
      <div className="overflow-hidden rounded-3xl border border-sea-100 bg-white shadow-soft">
        <div className="flex flex-col gap-2 border-b border-sea-100 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-600">
              Local outlook
            </span>
            <h2 id="weather-heading" className="mt-1 font-display text-2xl font-semibold text-sea-950">
              7-day weather forecast
            </h2>
          </div>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-sea-500 hover:text-sea-800"
          >
            Weather data by Open-Meteo <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {state.loading ? (
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 lg:grid-cols-7">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-2xl bg-sea-50" />
            ))}
          </div>
        ) : state.error ? (
          <p role="status" className="px-5 py-6 text-sm text-terracotta-700 sm:px-7">
            {state.error}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 lg:grid-cols-7 sm:px-7">
              {state.days?.map((day) => {
                const weather = describeWeather(day.code);
                const Icon = weather.Icon;
                const formatted = formatForecastDay(day.date);
                return (
                  <article
                    key={day.date}
                    className="flex min-h-32 flex-col items-center rounded-2xl bg-ivory-50 px-3 py-4 text-center"
                  >
                    <span className="text-xs font-semibold text-sea-800">{formatted.weekday}</span>
                    <time dateTime={day.date} className="mt-0.5 text-[11px] text-sea-400">
                      {formatted.date}
                    </time>
                    <Icon className="mt-3 h-6 w-6 text-sea-600" aria-hidden="true" />
                    <span className="mt-2 text-xs text-sea-600">{weather.label}</span>
                    <span className="mt-1 text-sm font-semibold text-sea-950">
                      {Math.round(day.high)}° <span className="font-normal text-sea-400">/ {Math.round(day.low)}°</span>
                    </span>
                    <span className="mt-1 text-[10px] text-sea-400">
                      {Math.round(day.precipitationChance)}% rain chance
                    </span>
                  </article>
                );
              })}
            </div>
            <p className="px-5 pb-5 text-xs text-sea-400 sm:px-7">
              Forecasts extend about a week; conditions can change. Check again closer to your visit.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
