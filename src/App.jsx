import './App.css'
import LoginButton from './components/loginButton';
import LogoutButton from './components/logoutButton';
import { gapi } from 'gapi-script';
import React, { useEffect, useState } from "react"

const clientId = import.meta.env.VITE_CLIENT_ID;
const apiKey = import.meta.env.VITE_API_KEY;
const scopes = import.meta.env.VITE_SCOPES;

function App() {
  const [documentId, setDocumentId] = useState("");
  const [vimeoId, setVimeoId] = useState([]);

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        scope: scopes
      })
    }

    gapi.load('client:auth2', start);
  });

  const fetchCourses = () => {
    let accessToken = gapi.auth.getToken().access_token;

    fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
      headers: new Headers({"Authorization" : `Bearer ${accessToken}`})
    }).then(res => {
      return res.json();
    }).then(doc => {
      let content = doc.body.content
      content.forEach(content => {
         if (content.paragraph) {
          let elements = content.paragraph.elements;
          elements.forEach(el => {
            let textRun = el.textRun;
            if (textRun.content.includes('https://vimeo.com/')) {
              let currentVimeoId = textRun.content.replace("https://vimeo.com/", "");
              setVimeoId(prevState => [...prevState, currentVimeoId]);
            }
          });
        }
      })
    })
  }

  const createCodeSnippet = () => {
    console.log(vimeoId);
  }

  return (
    <div id="App">
      <LoginButton></LoginButton>
      <LogoutButton></LogoutButton>
      <input type="text" placeholder='Document Id' value={documentId} onChange={(e) => setDocumentId(e.target.value)}/>
      <button onClick={() => fetchCourses()}>Fetch Data</button>
      <button onClick={() => createCodeSnippet()}>Create Code Snippet</button>
      <code>
        <pre>
        {`
        <?php
          $pp = [
              'Module',
              ${vimeoId.map((id, index) => `
              [
                  'title_${index + 1}',
                  '${id.trim()}'
              ],`).join('')}
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
  )
}

export default App
