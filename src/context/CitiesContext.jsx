import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CititesContext = createContext();

const BASE_URL = "http://localhost:8000";

const initialState = {
  cities: [],
  isloading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isloading: true };
    case "cities/loaded":
      return { ...state, cities: action.payload, isloading: false };
    case "city/loaded":
      return { ...state, currentCity: action.payload, isloading: false };

    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,

        isloading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isloading: false,
        currentCity: {},
      };

    case "rejected":
      return { ...state, isloading: false, error: action.payload };

    default:
      throw new Error("unkown Action Type");
  }
}

function CititesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isloading, setIsloading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  const [{ cities, isloading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading", payload: true });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: `Error: There was an error loading data ${err}`,
        });
        console.log(error);
        // console.log("Error: There was an error loading data ", err);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return; //  No need to reload the city info
    dispatch({ type: "loading", payload: true });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: `Error: There was an error loading data ${err}`,
      });
      console.log(error);
      // console.log("Error: There was an error loading data ", err);
    }
  }

  async function createCity(newCity) {
    console.log(newCity);
    dispatch({ type: "loading", payload: true });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      // setCities([...cities, data]);
      dispatch({ type: "city/created", payload: data });
      // setCities((cities) => [...cities, data]);
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: `Error: There was an error loading data ${err}`,
      });
      console.log(error);
      // console.log("Error: There was an error loading data ", err);
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading", payload: true });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "Delete",
      });
      dispatch({ type: "city/deleted", payload: id });

      // setCities((city) => city.filter((city) => city.id !== id));
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: `Error: There was an error loading data ${err}`,
      });
      console.log(error);
      // console.log("Error: There was an error loading data ", err);
    }
  }

  return (
    <CititesContext.Provider
      value={{
        cities,
        isloading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CititesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CititesContext);
  if (context === undefined)
    throw new Error("useCities must be used within the CitiesProvider");
  return context;
}

export { CititesProvider, useCities };
