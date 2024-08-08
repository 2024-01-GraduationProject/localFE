import React, { useState, useEffect } from "react";
import UseRandomAgeGender from "./UseRandomAgeGender";
import { useAuth } from "AuthContext";
const FamousBook = () => {
  const { age, gender, loading, error } = UseRandomAgeGender();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div id="famous_book">
        요즘 <strong>{age}</strong> <strong>{gender}</strong>이(가) 많이 보는 책
      </div>
    </>
  );
};

export default FamousBook;
