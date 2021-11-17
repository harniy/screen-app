import React, { useState, useMemo, useEffect } from "react";
import "./App.css";

import Loader from "react-loader-spinner";

function App() {
  const [url, setUrl] = useState("");
  const [screenFromServer, setScreenFromServer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')

  const getScreenshot = async () => {
    setIsLoading(true);
    setScreenFromServer("");
    try {
      const response = await fetch("http://localhost:7000/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      setScreenFromServer(data.img);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if(!url.includes('http') && url !== '') {
      setError('Error: URL must start with "http://" or "https://"')
    } else if (screenFromServer === undefined) {
      setError('Error: incorrect URL, please check and try again')
    } else {
      setError('')
    }
  }, [screenFromServer, url])
  

  const createImage = useMemo(() => {
    return `data:image/png;base64, ${screenFromServer}`;
  }, [screenFromServer]);

  return (
    <div className="App">
      <div className="section">
        <div className="section__inputs">
          <h1>
            <span className="h1__span">Web</span>Screen SAVER
          </h1>

          <input
            placeholder="Url..."
            onChange={(e) => setUrl(e.target.value)}
          />
          {error !== '' && (
            <span className="url__error">{error}</span>
          )}
          <button onClick={getScreenshot}>screen</button>
        </div>
        <div className="section__outputs">
          {isLoading && (
            <div className="loader">
              <Loader type="Puff" color="#629164c2" height={100} width={100} />
              <p>Please wait, image is Loading...</p>
            </div>
          )}
          {screenFromServer !== "" && screenFromServer !== undefined ? (
            <a href={createImage} download={`${String(Date.now()).slice(-5)}.jpeg`}>
              <img className="screenshot" src={createImage} />
            </a>
          ) : ''}
        </div>
      </div>
    </div>
  );
}

export default App;
