import React from "react";
import Navigation from "../components/Navigation.tsx";
import "../styles/page.css"

function Home() {
  return (
    <div className="background">
      <Navigation />
      <h1>Home</h1>
    </div>
  );
}

export default Home;
