// TODO remove this
// TODO remove this
// TODO remove this
const width_text = document.getElementById("width");
function updateSize() {
  width_text.textContent = window.innerWidth;
}
updateSize();
window.addEventListener("resize", updateSize);

const movie_panel = document.getElementsByClassName("panel")[0];
movie_panel.getElementsByTagName("h1")[0].textContent = "pwet";
// TODO remove this
// TODO remove this
// TODO remove this

const api_root = "http://localhost:8000/api/v1";

async function callAPI(request) {
  const response = await fetch(request);
  try {
    if (!response.ok) {
      throw new Error("API request failed");
    }
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

async function getFirstTitle() {
  const res = await callAPI(`${api_root}/titles/`);
  console.log(res.results[0].title);
}
getFirstTitle();

// async function callAPI(request) {
//   fetch(request)
//     .then((response) => {
//       if (response.ok) {
//         return response.json(); // Parse the response data as JSON
//       } else {
//         throw new Error("API request failed");
//       }
//     })
//     .then((data) => {
//       if (data.ok) {
//         console.log(data);
//         return data;
//       } else {
//         console.error(`Server error: ${data.error}`);
//       }
//     })
//     .catch((error) => {
//       // Handle any errors here
//       console.error(error); // Example: Logging the error to the console
//     });
// }

// const response = await callAPI(`${api_root}/titles/`);
// document.body.addEventListener();
// // const response1 = await callAPI(`${api_root}/genres/`);
// console.log(await response);

//TODO voir conseils de JB : donner une variable en entrée (pour que sa permanence reste après la fin de la fonction)
