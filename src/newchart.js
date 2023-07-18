import "./styles.css";
import { Chart } from "frappe-charts";

const JSONquery = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"]
      }
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vm01", "vm11"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

const getData = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(JSONquery)
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();
  return data;
};

const buildChart = async () => {
  const data = await getData();
  const years = Object.values(data.dimension.Vuosi.category.label);
  const value = Object.values(data.value);
  console.log(data);
  const dataset1 = [];
  const dataset2 = [];

  for (let i = 0; i < value.length; i++) {
    if (i % 2 === 0) {
      dataset1.push(value[i]);
    } else {
      dataset2.push(value[i]);
    }
  }
  const chartdata = {
    labels: years,
    datasets: [
      { name: "Births", values: dataset1, colors: ["#63d0ff"] },
      { name: "Deaths", values: dataset2, colors: ["#363636"] }
    ]
  };

  const chart7 = new Chart("#chart", {
    title: "Births and deaths in whole country",
    data: chartdata,
    type: "bar",
    height: 450
  });
};

buildChart();

const navigatebtn = document.getElementById("navigation");

navigatebtn.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "index.html";
});
