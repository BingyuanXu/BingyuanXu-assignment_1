const form = document.querySelector(`form`);
const input = form.querySelector(`input`);
const apiKey = `Ehg5Nso4pNe0kGRIfPW`;
const streetContainer = document.querySelector(`.streets`);
const tableContainer = document.querySelector(`tbody`);

form.addEventListener(`keypress`, function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    buildStreetList(input.value);
  }
})

streetContainer.addEventListener(`click`, function (event) {
  if (event.target.tagName === `A`) {
    stopInStreet(event.target.dataset.streetKey);
    addStreetNameEle(event.target.textContent);
  }
})

function getStreet(inputStName) {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${inputStName}&usage=long`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("There is a problem in street name (;T__T:)");
      }
    })
    .then(json => json.streets)
}

function buildStreetList(inputStName) {
  let html = ``;
  streetContainer.innerHTML = ``;

  getStreet(inputStName)
    .then(streetArray => {
      if (streetArray !== []) {
        streetArray.forEach(ele => {
          html += `<a href="#" data-street-key="${ele.key}">${ele.name}</a>`;
        });
      } else {
        html = `No Streets found`;
      }

      streetContainer.insertAdjacentHTML(`beforeend`, html)
    })
}

function addStreetNameEle(streetName) {
  const streetNameEle = document.querySelector(`#street-name`);
  streetNameEle.textContent = ``;
  streetNameEle.textContent = `Displaying results for ${streetName}`;
}

function buildSchedualTable(scheduleArray) {
  let html = '';
  tableContainer.innerHTML = '';

  for (let schedule of scheduleArray) {
    for (let routeSchedule of schedule[`route-schedules`]) {
      html += ` <tr>
      <td>${schedule.stop.street.name}</td>
      <td>${schedule.stop[`cross-street`].name}</td>
      <td>${schedule.stop.direction}</td>
      <td>${routeSchedule.route.number}</td>
      <td>${timeFormatter(routeSchedule[`scheduled-stops`][0].times.departure.estimated)}</td>
    </tr>`;
    }
  }

  tableContainer.insertAdjacentHTML(`beforeend`, html)
}

function scheduleArrayPromise(stopArray) {
  const stopKeyArray = stopArray.map(ele => ele.key);
  const jsonPromise = [];

  for (let stopKey of stopKeyArray) {
    jsonPromise.push(
      fetch(`https://api.winnipegtransit.com/v3/stops/${stopKey}/schedule.json?api-key=Ehg5Nso4pNe0kGRIfPW&max-results-per-route=2`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("There is a problem in stop names (;T__T:)");
          }
        })
        .then(json => json[`stop-schedule`])
    )
  }

  Promise.all(jsonPromise)
    .then(result => buildSchedualTable(result))
}

function stopInStreet(streetKey) {
  fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=${apiKey}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("There is a problem in stop names (;T__T:)");
      }
    })
    .then(json => scheduleArrayPromise(json.stops))
}

function timeFormatter(timeString) {
  const time = new Date(timeString);
  const options = {
    timeZone: "Canada/Central",
    hour12: true,
    hour: "numeric",
    minute: "numeric", seconds: "numeric"
  }
  return time.toLocaleTimeString(`en-US`, options);
}