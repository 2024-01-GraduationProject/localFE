import { useState, useEffect } from "react";
import api from "../../api";

const UseRandomAgeGender = () => {
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomAgeGender = async () => {
      try {
        const [agesResponse, gendersResponse] = await Promise.all([
          api.get("/ages"),
          api.get("/genders"),
        ]);

        const agesData = await agesResponse.data;
        const gendersData = await gendersResponse.data;

        const ages = agesData.map((item) => item.age);
        const genders = gendersData.map((item) => item.gender);

        const randomAge = ages[Math.floor(Math.random() * ages.length)];
        const randomGender =
          genders[Math.floor(Math.random() * genders.length)];

        setAge(randomAge); // 배열로 저장 Ex) [20, 30, 40]
        setGender(randomGender); // Ex) ["Male", "Female"]
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomAgeGender();
  }, []);

  return { age, gender, loading, error };
};

export default UseRandomAgeGender;
