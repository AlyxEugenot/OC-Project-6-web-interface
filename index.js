const api_root = "http://localhost:8000/api/v1";

async function callAPI(request) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the response data as JSON
      } else {
        throw new Error("API request failed");
      }
    })
    .then((data) => {
      if (data.ok) {
        console.log(data);
        return data;
      } else {
        console.error(`Server error: ${data.error}`);
      }
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error); // Example: Logging the error to the console
    });
}

const response = await callAPI(`${api_root}/titles/`);
document.body.addEventListener()
// const response1 = await callAPI(`${api_root}/genres/`);
console.log(await response);

//TODO voir conseils de JB : donner une variable en entrée (pour que sa permanence reste après la fin de la fonction)
