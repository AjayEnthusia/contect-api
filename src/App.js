
import React, { useEffect, useState } from "react";

const CLIENT_ID = "623334439970-7pakna0jr580nb7gd6322ubbhkdiop7m.apps.googleusercontent.com";
const API_KEY = "AIzaSyA4n-lZ7qodBcJoKkPCHtrLfXrsNhVNkpI";
const DISCOVERY_DOCS = ["https://people.googleapis.com/$discovery/rest?version=v1"];
const SCOPES = "https://www.googleapis.com/auth/contacts.readonly";

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Load the Google API client library when the component mounts
    loadGapi();
    // eslint-disable-next-line 
  }, []);

  const handleLogin = () => {
    window.gapi.auth2.getAuthInstance().signIn().then(fetchContacts);
  };

  const loadGapi = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = initClient;
    document.body.appendChild(script);
  };
  const initClient = () => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          // Check if the user is already signed in
          if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
            fetchContacts();
          }
        });
    });
  };

  const fetchContacts = () => {
    window.gapi.client.people.people.connections
      .list({
        resourceName: "people/me",
        personFields: "names,emailAddresses",
      })
      .then((response) => {
        const contactsData = response.result.connections.map((contact) => ({
          name: contact.names && contact.names[0].displayName,
          email: contact.emailAddresses && contact.emailAddresses[0].value,
        }));
        setContacts(contactsData);
      });
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <h1>Google Contacts in JSON</h1>
      <button onClick={handleLogin} className='px-5 py-2 bg-blue-400 font-bold text-white w-full max-w-[250px] rounded-xl'>Get Contact</button>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>
            {contact.name} - {contact.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
