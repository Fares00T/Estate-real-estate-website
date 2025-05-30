import { createContext, useEffect, useState, useRef } from "react";

// Create context inside the same file
const CloudinaryScriptContext = createContext();

function UploadWidget({ uwConfig, setState }) {
  const [loaded, setLoaded] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!loaded) {
      const existingScript = document.getElementById("uw");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "uw";
        script.async = true;
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.onload = () => setLoaded(true);
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && !widgetRef.current) {
      if (window.cloudinary && window.cloudinary.createUploadWidget) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Done! Image info:", result.info);
              setState((prev) => [...prev, result.info.secure_url]);
            }
          }
        );
      } else {
        // Sometimes window.cloudinary may not be ready immediately after script load
        // Add a small delay and retry
        const timer = setTimeout(() => {
          if (window.cloudinary && window.cloudinary.createUploadWidget) {
            widgetRef.current = window.cloudinary.createUploadWidget(
              uwConfig,
              (error, result) => {
                if (!error && result && result.event === "success") {
                  console.log("Done! Image info:", result.info);
                  setState((prev) => [...prev, result.info.secure_url]);
                }
              }
            );
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [loaded, uwConfig, setState]);

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button className="cloudinary-button" onClick={openWidget}>
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
