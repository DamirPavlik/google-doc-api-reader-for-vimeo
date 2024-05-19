import "./App.css";
import LoginButton from "./components/loginButton";
import LogoutButton from "./components/logoutButton";
import { gapi } from "gapi-script";
import React, { useEffect, useRef, useState } from "react";

const clientId = import.meta.env.VITE_CLIENT_ID;
const apiKey = import.meta.env.VITE_API_KEY;
const scopes = import.meta.env.VITE_SCOPES;

function App() {
  const [documentId, setDocumentId] = useState("");
  const [vimeoId, setVimeoId] = useState([]);
  const [allElements, setAllElements] = useState([]);
  const [title, setTitle] = useState([]);
  const [titleAndIds, setTitleAndIds] = useState([]);
  const codeRef = useRef(null);

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        scope: scopes,
      });
    };

    gapi.load("client:auth2", start);
  });

  const fetchCourses = () => {
    let accessToken = gapi.auth.getToken().access_token;

    fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
    })
      .then((res) => {
        return res.json();
      })
      .then((doc) => {
        let content = doc.body.content;

        for (let i = 0; i < content.length; i++) {
          let item = content[i];
          if (item.paragraph) {
            let elements = item.paragraph.elements;
            for (let j = 0; j < elements.length; j++) {
              let el = elements[j];
              let textRun = el.textRun;
              setAllElements((prevState) => [...prevState, textRun]);
              if (textRun && textRun.content.includes("https://vimeo.com/")) {
                let currentVimeoId = textRun.content.replace(
                  "https://vimeo.com/",
                  ""
                );
                setVimeoId((prevState) => [...prevState, currentVimeoId]);
              }
            }
          }
        }
      });
  };

  const addTitles = () => {
    for (let i = 0; i < allElements.length; i++) {
      if (
        allElements[i] &&
        allElements[i].content.includes("https://vimeo.com/")
      ) {
        let cleanTitle = allElements[i - 1].content.replace("\n", "").replace("\v", "").trim();
        setTitle(prevState => [...prevState, cleanTitle]);
      }
    }
  };

  const createTitlesAndIdsObjects = () => {
    for (let i = 0; i < vimeoId.length; i++) {
      let obj = {
        vimeoId: vimeoId[i],
        title: title[i]
      }

      setTitleAndIds(prevState => [...prevState, obj]);
    }
  }

  const copyToClipboard = () => {
    const codeText = codeRef.current.innerText;
    navigator.clipboard.writeText(codeText).then(() => {
      alert("Code copied to clipboard!");
    });
  }

  return (
    <div id="App">
      <div className="d-flex mb-20">
        <LoginButton></LoginButton>
        <LogoutButton></LogoutButton>
      </div>
      <input
        type="text"
        placeholder="Document Id"
        className="mb-20"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
      />
      <button onClick={() => fetchCourses()} className="mr-10">Fetch Video IDs</button>
      <button onClick={() => addTitles()} className="mr-10">Fetch Titles</button>
      <button onClick={() => createTitlesAndIdsObjects()}>Create Titles and IDs object</button>
      <code>
        <pre ref={codeRef}>
        <button onClick={copyToClipboard} className="copy-to-clipboard">Copy To Clipboard</button>
          {`
        <?php
          $pp = [
            'Module',
            ${titleAndIds.map((titleAndId) => 
              `[
                "${titleAndId.title}",
                "${titleAndId.vimeoId}"
               ],
              `).join("")}
          ];

          $course_id = 126286;
          $modules = [];

          foreach($pp as $p) {
              if(is_string($p)) {
                  $modules[] = $p;
              } else {
                  $post_id = wp_insert_post([
                      'post_type' => 'sfwd-lessons',
                      'post_title' => $p[0],
                      'post_content' => '',
                      'post_status' => 'publish',
                      'post_parent' => $course_id
                  ]);

                  $modules[] = $post_id;
                  // Set course ID meta
                  update_post_meta($post_id, 'pg_video_id', $p[1]);
                  update_post_meta($post_id, 'pg_lesson_type', 'video');

                  \\PG\\Lessons\\set_video_things($post_id);
              }
          }
          update_post_meta($course_id, 'pgz_course_modules', $modules);
        ?>
        `}
        </pre>
      </code>
    </div>
  );
}

export default App;
