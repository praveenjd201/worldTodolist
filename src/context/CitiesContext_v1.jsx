import { createContext, useContext, useEffect, useState } from "react";

const CititesContext = createContext();

const BASE_URL = "http://localhost:8000";

function CititesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsloading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        setCities(data);
      } catch (err) {
        console.log("Error: There was an error loading data ", err);
      } finally {
        setIsloading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsloading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      setCurrentCity(data);
    } catch (err) {
      console.log("Error: There was an error loading data ", err);
    } finally {
      setIsloading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsloading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // setCities([...cities, data]);
      setCities((cities) => [...cities, data]);
    } catch (err) {
      console.log("Error: There was an error loading data ", err);
    } finally {
      setIsloading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsloading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "Delete",
      });

      setCities((city) => city.filter((city) => city.id !== id));
    } catch (err) {
      console.log("Error: There was an error loading data ", err);
    } finally {
      setIsloading(false);
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
