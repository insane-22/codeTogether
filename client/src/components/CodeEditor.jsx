import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage, langNames } from "@uiw/codemirror-extensions-langs";
import { zebraStripes } from "@uiw/codemirror-extensions-zebra-stripes";
import "../styles/Editor.css";
import { useSocket } from "../context/SocketProvider";
import { useParams } from "react-router-dom";

const CodeEditor = () => {
  const { socket } = useSocket();
  const { roomId } = useParams();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("tsx");

  const onChange = (newValue) => {
    setCode(newValue);
    socket.emit("update code", { roomId, code: newValue });
    socket.emit("syncing the code", { roomId: roomId });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    socket.emit("update language", { roomId, languageUsed: e.target.value });
    socket.emit("syncing the language", { roomId: roomId });
  };

  useEffect(()=>{
    socket.on("on language change", ({ languageUsed }) => {
      setLanguage(languageUsed);
    });

    socket.on("on code change", ({ code }) => {
      setCode(code);
    });
  })

  return (
    <>
      <div className="languageFieldWrapper">
        <select
          className="languageField"
          name="language"
          id="language"
          value={language}
          onChange={handleLanguageChange}
        >
          {langNames.map((eachLanguage) => (
            <option key={eachLanguage} value={eachLanguage}>
              {eachLanguage}
            </option>
          ))}
        </select>
      </div>

      <CodeMirror
        value={code}
        width="83vw"
        onChange={onChange}
        height="calc(100vh - 45px)"
        extensions={[zebraStripes({ step: 2 }), loadLanguage(language)]}
        className="CodeMirror"
      />
    </>
  );
};

export default CodeEditor;
