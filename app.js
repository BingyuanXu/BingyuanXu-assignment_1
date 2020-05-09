const form = document.querySelector(`form`);
const input = form.querySelector(`input`);
const apiKey = `Ehg5Nso4pNe0kGRIfPW`;
const streetContainer = document.querySelector(`.streets`);


form.addEventListener(`keypress`, function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    getStreet(input.value);
  }
});

streetContainer.addEventListener(`click`, function(event){
  if (event.target.tagName === `A`) {
    console.log(event.target.tagName);
  }
})

function getStreet(inputStName) {
  fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${inputStName}&usage=long`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("There is a problem (;T__T:)");
      }
    })
    .then(json => buildStreetList(json.streets))
}

function buildStreetList(streetArray) {
  let html = ``;
  streetContainer.innerHTML = ``;
  
  if (streetArray !== []) {
    streetArray.forEach(ele => {
      html += `<a href="#" data-street-key="${ele.key}">${ele.name}</a>`;
    });
  } else {
    html = `No Streets found`;
  }

  streetContainer.insertAdjacentHTML(`beforeend`, `${html}`)
}
