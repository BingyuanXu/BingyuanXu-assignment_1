const form = document.querySelector(`form`);
const input = form.querySelector(`input`);
const  apiKey = `Ehg5Nso4pNe0kGRIfPW`;

form.addEventListener(`keypress`, function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    console.log(input.value);
  }
});


function getStreet(inputStName){
fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${inputStName}&usage=long`)
.then(response => response.json())
.then(json => console.log(json))
}
