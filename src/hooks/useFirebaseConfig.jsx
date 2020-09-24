// `useFirebaseConfig` handles fetching of remote config stored in
// firebase firestore. To use it, wrap your components inside
// `<FirebaseConfigProvider projectId={'your-project-id'}>`.

import React, { createContext, useContext, useEffect, useState } from "react";
import get from "lodash/get";

const FirebaseConfigContext = createContext({});

async function fetchConfig(projectId) {
  const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/config`;

  const { json, error } = await fetch(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then((res) => res.json())
    .then((json) => ({ json }))
    .catch((e) => ({ error }));

  if (error) {
    return { error };
  }

  // Transform firebase firestore REST output to key-value.
  let config = {};
  for (let i = 0; i < json.documents.length; i++) {
    const { name, fields } = json.documents[i];
    const key = name.split("/config/")[1];

    config[key] = {};
    Object.keys(fields).forEach((field) => {
      config[key][field] = Object.values(fields[field])[0];
    });
  }

  return { config };
}

export const FirebaseConfigProvider = ({ projectId, children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({});

  useEffect(() => {
    fetchConfig(projectId).then(({ config, error }) => {
      setConfig(config);
      setError(error);
      setLoading(false);
    });
  }, [projectId]);

  if (loading) {
    return (
      <div style={{ marginTop: "2em", textAlign: "center", color: "gray" }}>
        loading config..
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: "2em", textAlign: "center", color: "gray" }}>
        error: could not load remote config: {error}
      </div>
    );
  }

  return (
    <FirebaseConfigContext.Provider value={config}>
      {children}
    </FirebaseConfigContext.Provider>
  );
};

export default function useFirebaseConfig(configPath = "") {
  const config = useContext(FirebaseConfigContext);

  if (!configPath) {
    return config;
  }

  return get(config, configPath);
}
