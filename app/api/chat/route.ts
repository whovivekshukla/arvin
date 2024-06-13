import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";
import fetch from "node-fetch";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
  error?: {
    message: string;
  };
}

async function getTemperature(location: string): Promise<number | null> {
  const apiKey = "c5ee4c29a76f4604a0d173827240806";
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

  try {
    const response = await fetch(apiUrl);
    const data = (await response.json()) as WeatherApiResponse;

    if (response.ok) {
      const temperature = data.current.temp_c;
      return temperature;
    } else {
      console.error(`Error: ${data.error?.message}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),

    messages: convertToCoreMessages(messages),
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: "show the weather in a given city to the user",
        parameters: z.object({ city: z.string() }),
        execute: async ({ city }: { city: string }) => {
          return await getTemperature(city);
        },
      },
    },
  });

  return result.toAIStreamResponse();
}
