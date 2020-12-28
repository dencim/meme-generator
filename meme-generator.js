import { useState, useEffect } from "react";
import Head from "next/head";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Title from "../../components/Title";
import Memes from "../../components/Memes";

const MemeGenerator = () => {
  const [allText, setAllText] = useState(`Temp Line 1\nTemp Line 2`); //default text
  const [picSelected, setPicSelected] = useState("1"); //default have first pic selected
  const [error, setError] = useState("");

  var ctx;
  var canvas;
  var preview;

  const default_pics = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14"];

  //when page loads, handle submit with deafault values
  useEffect(() => {
    handleSubmit();
  }, []);

  //Handle meme Generation
  const handleSubmit = () => {
    //image
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    preview = document.getElementById(picSelected);

    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, 500, 100);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(preview, 25, 100, 450, 380);

    //text
    ctx.fillStyle = "black";
    const sentences = allText.replace(/\r/g, "").split(/\n/);
    let t = "";
    let m = "";
    let l = "";
    let offset = 0;

    //if one line
    if (sentences.length === 1) {
      t = sentences[0];
      m = "";
      l = "";
      offset = 50;
      ctx.font = "25px serif";
    }
    //if two lines
    else if (sentences.length === 2) {
      t = sentences[0];
      m = sentences[1];
      l = "";
      offset = 35;
      ctx.font = "20px serif";
    }
    //if 3 lines
    else if (sentences.length === 3) {
      t = sentences[0];
      m = sentences[1];
      l = sentences[2];
      offset = 28;
      ctx.font = "20px serif";
    }

    ctx.fillText(t, 25, offset, 450);
    ctx.fillText(m, 25, offset * 2, 450);
    ctx.fillText(l, 25, offset * 3, 450);
  };
  //Opens users files
  const insertImg = (input) => {
    setPicSelected("preview");
    const reader = new FileReader();
    preview = document.getElementById("preview");
    reader.onload = (e) => {
      preview.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(input[0]);
  };
  //Handles Text input area
  //Checks for max length of sentence etc
  const changeTextArea = (input) => {
    const sentences = input.replace(/\r/g, "").split(/\n/);
    if (sentences.length > 3) {
      setError("You can only use 3 lines for the meme :(");
    } else if (
      (sentences[0] != null && sentences[0].length > 48) ||
      (sentences[1] != null && sentences[1].length > 48) ||
      (sentences[2] != null && sentences[2].length > 48)
    ) {
      setError("Error: Max line length reached");
    } else {
      setAllText(input);
      setError("");
    }
  };
  //OnClick For download Button
  const downloadImg = () => {
    var link = document.createElement("a");
    link.download = "meme.jpg";
    link.href = document.getElementById("canvas").toDataURL();
    link.click();
  };
  return (
    <main>
      <Head>
        <title>Meme Generator - Denis Cimic</title>
      </Head>
      <Navbar active="2" />
      <section
        className="hero wrapper has-text-centered"
        style={{ paddingTop: "30px", paddingBottom: "30px" }}
      >
        <Title title="Meme generator" color="#2F353F" />
        <h2>Select a photo from below or upload your own.</h2>
        <div className="all_memes">
          {/* Displays all memes with onclick functions  */}
          {default_pics.map((pic, index) => (
            <button
              key={index}
              className={
                picSelected === pic
                  ? "greenBack meme_background_btn"
                  : "meme_background_btn"
              }
              onClick={() => {
                setPicSelected(pic);
              }}
            >
              <img
                src={"../meme_option_" + pic + ".jpg"}
                id={pic}
                alt={"meme " + pic}
              ></img>
            </button>
          ))}
        </div>
        <div
          style={{ borderBottom: "1px solid black", paddingBottom: "10px" }}
          className="containerC"
        >
          {/* <h1 style={{ fontWeight: "bold" }}>How it works:</h1> */}
          <div className="filePickerContainer">
            <div className="filePicker">
              <label>
                {" "}
                Upload Picture - 4x3 ratio to minimize skew{" "}
                <input
                  type="file"
                  onChange={(e) => insertImg(e.target.files)}
                ></input>{" "}
              </label>
            </div>
            {/* User uploaded image preview */}
            <button
              className="filePickerImg"
              style={{ padding: "5px" }}
              className={
                picSelected === "preview"
                  ? "filePickerImg greenBack"
                  : "filePickerImg"
              }
              onClick={() => {
                setPicSelected("preview");
              }}
            >
              <img src="../prev_og.jpg" alt="Project picture" id="preview" />
            </button>
          </div>
          <div className="text-section">
            <label className="text1">
              <p>Text:</p>
              <textarea
                value={allText}
                rows="3"
                className="user_text"
                onChange={(e) => changeTextArea(e.target.value)}
              ></textarea>
            </label>
            <p style={{ color: "red" }}>{error} </p>
            <button
              className="generate_btn"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Generate Meme!
            </button>
          </div>

          <p
            style={{
              fontSize: "1.5em",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            Generated:
          </p>
          <canvas
            id="canvas"
            className="canvas_obj"
            height="500"
            width="500"
          ></canvas>
          <br />

          <button
            style={{ borderRadius: "10px", padding: "10px" }}
            className="download_btn"
            onClick={() => {
              downloadImg();
            }}
          >
            DOWNLOAD MEME (.jpg)
          </button>
        </div>
      </section>
      <Memes />
      <Footer />
      <style jsx>{`
        .filePickerContainer {
          display: flex;
          justify-content: center;
          padding-bottom: 10px;
          border-bottom: 2px dashed grey;
        }
        .filePicker {
          width: 20%;
          border: 2px solid grey;
          border-radius: 25px;
          padding: 10px;
        }
        .filePickerImg {
          paddingbottom: 15px;
          width: 10%;
        }
        .meme_background_btn {
          margin: 10px;
          padding: 10px;
          height: 190px;
          width: 225px;
        }
        .text-section {
          padding-bottom: 10px;
          border-bottom: 2px dashed grey;
        }
        .text1 {
          //border: 2px solid grey;
          font-size: 1.3em;
        }
        .user_text {
          resize: none;
          font-size: 1.2em;
          width: 50%;
        }
        .greenBack {
          background-color: #90ee90;
        }
        .all_memes {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 1550px;
          margin: auto;
          width: 90%;
        }
        .generate_btn {
          background-color: #3bb9ff;
          color: white;
          font-size: 1.5em;
          width: 30%;
          border-radius: 10px;
          padding: 10px 0 10px 0;
          margin: 10px;
        }
        .generate_btn:hover {
          transform: scale(1.1);
        }
        .download_btn {
          background-color: #ff5733;
          color: white;
          borderradius: 10px;
          padding: 10px;
          font-size: 1.1em;
        }
        .download_btn:hover {
          transform: scale(1.1);
        }
        .canvas_obj {
          border: 1px solid black;
        }

        @media screen and (max-width: 790px) {
          .filePicker {
            width: 40%;
          }
          .filePickerImg {
            width: 40%;
          }
          .canvas_obj {
            width: 90vw;
          }
          .user_text {
            font-size: 4vw;
            width: 60%;
          }
          .generate_btn {
            width: 80%;
          }
          .all_memes {
            width: 100%;
          }
        }
        @media screen and (max-width: 512px) {
          .meme_background_btn {
            height: auto;
            width: 40%;
          }
          .user_text {
            width: 95%;
          }
        }
      `}</style>
    </main>
  );
};
export default MemeGenerator;
