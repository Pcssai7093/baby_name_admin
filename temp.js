// Example for Hindi (Devanagari)
const text = "Ankita";
const language = "te"; // Hindi
const url = `https://www.google.com/inputtools/request?text=${encodeURIComponent(
  text
)}&itc=${language}-t-i0-und`;

fetch(url)
  .then((response) => response.json())
.then((data) => console.log(data[1][0][1])); 