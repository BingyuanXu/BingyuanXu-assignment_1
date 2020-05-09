const form = document.querySelector(`form`);
const input = form.querySelector(`input`);

form.addEventListener(`keypress`, function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    console.log(input.value);
  }
});

