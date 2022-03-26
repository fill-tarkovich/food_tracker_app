import Chart from "chart.js/auto";
import { FetchWrapper } from "./fetch-wrapper";

const nameInput = document.querySelector("#food-name");
const carbsInput = document.querySelector("#carbs");
const proteinInput = document.querySelector("#protein");
const fatInput = document.querySelector("#fat");
const form = document.querySelector("form");
const total = document.querySelector(".total-amount");
const cards = document.querySelector(".cards");

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/"
);

function postData(fat, protein, carbs, name) {
  API.post("filipp102", {
    fields: {
      fat: {
        integerValue: fat.value,
      },
      protein: {
        integerValue: protein.value,
      },
      carbs: {
        integerValue: carbs.value,
      },
      name: {
        stringValue: name.value,
      },
    },
  });
}

function createChart(carbsCalo, proteinCalo, fatCalo) {
  const nutriChart = document.getElementById("chart").getContext("2d");
  const chart = new Chart(nutriChart, {
    type: "bar",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          data: [carbsCalo, proteinCalo, fatCalo],
          backgroundColor: [
            "rgb(22, 66, 95)",
            "rgb(34, 99, 143)",
            "rgb(57, 140, 195)",
          ],
          label: "Your statistics:",
        },
      ],
    },
    options: {},
  });
}

function countCalories() {
  API.get("filipp102").then((data) => {
    let carbs = data.documents.reduce((sum, current) => {
      return sum + Number(current.fields.carbs.integerValue);
    }, 0);
    let carbsCalories = carbs * 4;
    let protein = data.documents.reduce(function (sum, current) {
      return sum + Number(current.fields.protein.integerValue);
    }, 0);
    let proteinCalories = protein * 4;
    let fat = data.documents.reduce(function (sum, current) {
      return sum + Number(current.fields.fat.integerValue);
    }, 0);
    let fatCalories = fat * 9;
    let totalCalories = carbs * 4 + protein * 4 + fat * 9;
    total.textContent = totalCalories;
    createChart(carbsCalories, proteinCalories, fatCalories);
  });
}

const renderCard = () => {
  API.get("filipp102").then((data) => {
    data.documents.forEach((card) => {
      let calories =
        card.fields.carbs.integerValue * 4 +
        card.fields.protein.integerValue * 4 +
        card.fields.fat.integerValue * 9;
      cards.insertAdjacentHTML(
        "beforeend",
        `
      <div class="card">
      <h3 >${card.fields.name.stringValue}</h3>
      <p><span>${calories}</span> calories</p>
      <ul>
        <li>
          <p>Carbs</p>
          <p class="carb-amount">${
            card.fields.carbs.integerValue || card.fields.carb.integerValue
          }g</p>
        </li>
        <li>
          <p>Protein</p>
          <p class="protein-amount">${card.fields.protein.integerValue}g</p>
        </li>
        <li>
          <p>Fat</p>
          <p class="fat-amount">${card.fields.fat.integerValue}g</p>
        </li>
      </ul>
    </div>`
      );
    });
  });
  form.reset();
};

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (nameInput !== "" && carbsInput && proteinInput && fatInput) {
    postData(fatInput, proteinInput, carbsInput, nameInput);
    countCalories();
    renderCard();
  }
});
countCalories();
renderCard();
