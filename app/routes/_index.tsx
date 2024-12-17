import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Typescript Weather App" },
    { name: "description", content: "Get Current Weather Information !" },
  ];
};

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherResponse {
  coord: { lon: number; lat: number };
  weather: WeatherCondition[]; // Array of weather condition objects
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number; // Corrected from 'pressure'
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number }; // Optional 'gust' field
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Remix Loader Function for fetching weather data from OpenWeatherMap API
export async function loader({ request }: LoaderFunctionArgs) {
  let url = new URL(request.url);

  let searchParams = url.searchParams;

  let city = searchParams.get("q") || "nairobi";

  if (!city) {
    throw new Response("City name is required", {
      status: 400,
      statusText: "bad request",
    });
  }
  // Fetch weather data
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
  );
  let weather: WeatherResponse = await response.json();

  return weather;
}

// Next.js Component for displaying weather data
export default function Index() {
  let weather = useLoaderData<typeof loader>();

  let [searchParams] = useSearchParams();
  let q = searchParams.get("q") || "";

  0let locations = [
    "Mombasa",
    "Nairobi",
    "Kisumu",
    "Kiribati",
    "Kakamega",
    "Bungoma",
    "Kitui",
  ];

  let navigation = useNavigation();
  console.log(navigation);

  let isSearching = Boolean(
    navigation.state === "loading" && navigation.location.search
  );

  console.log({ isSearching });
  return (
    <main
      className={`h-screen w-full bg-[url('https://images.unsplash.com/photo-1566352207769-3a591a2c9567?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-no-repeat bg-center grid grid-cols-4 gap-4 relative`}
    >
      {isSearching ? (
        <div className="w-full h-screen absolute inset-0 grid place-items-center ">
          <ThreeDots />
        </div>
      ) : null}
      {/* <div className="w-full h-screen absolute inset-0 grid place-items-center">
        <img src="./loader.svg" alt="" />
      </div> */}
      <div className="lg:col-span-3 flex flex-col justify-between p-9 lg:pb-32">
        {/* weather */}

        <h1 className="text-sm">Weather App</h1>
        <div className="flex gap-4 items-center">
          <span className="text-3xl lg:text-6xl font-bold ">
            {Math.round(weather.main.temp)} &deg;
            <span className="lg:text-3xl">C</span>
          </span>
          <span className="text-xl">{weather.name}</span>
          <div className="flex items-center">
            <span>{weather.weather[0].main}</span>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt=""
              className="w-12"
            />
          </div>
        </div>
      </div>
      <div className="backdrop-blur-md lg:col-span-1 px-5 lg:px-7">
        {/* from and details */}
        <Form className="flex items-centre mt-5">
          <input
            type="search"
            name="q"
            placeholder="Search location"
            aria-label="search location"
            className="bg-transparent border border-gray-300 px-4 py-1  rounded-md "
            autoComplete="off"
            defaultValue={q}
          />
          <button type="submit" className=" text-black bg-orange-500">
            <img src="/search.svg" alt="" className="w-16 " />
          </button>
        </Form>
        <ul className="space-y-4 text-gray-300 mt-4">
          {locations.map((item, index) => (
            <li key={index} className="">
              <Link
                to={`?q=${item}`}
                className="hover:text-gray-600 transition ease-in-out duration-300"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <h2>Weather Details</h2>
          <ul className="mt-4 text-gray-300">
            {weather.weather.map((item) => (
              <li key={item.id}>{item.main}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

// import {
//   isRouteErrorResponse,
//   useRouteError,
// } from "@remix-run/react";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.error(error);
    return (
      <div>
        <img src="./error.jpg" alt="" />
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    console.error({ error });
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="">
          <img src="./error.jpg" alt="" />
        </div>

        <h1 className="text-red-700 text-2xl">Error</h1>
        <p>{error.message}</p>
        {/* <p>The stack trace is:</p>
        <pre>{error.stack}</pre> */}
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
function ThreeDots() {
  return (
    <svg
      width="120"
      height="30"
      viewBox="0 0 120 30"
      xmlns="http://www.w3.org/2000/svg"
      fill="#fff"
    >
      <circle cx="15" cy="15" r="15">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="60" cy="15" r="9" fill-opacity="0.3">
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0s"
          dur="0.8s"
          values="9;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="0.5"
          to="0.5"
          begin="0s"
          dur="0.8s"
          values=".5;1;.5"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="105" cy="15" r="15">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
