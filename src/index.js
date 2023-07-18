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
        values: ["vaesto"]
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

const getDataT = async () => {
  const url1 =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res1 = await fetch(url1, {
    method: "GET"
  });
  const data1 = await res1.json();
  return data1;
};

async function dataedit(areacodes) {
  const newurl =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const newquery = JSONquery;
  newquery.query[1].selection.values[0] = Object(areacodes);
  console.log(newquery);
  let res2 = await fetch(newurl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newquery)
  });
  if (!res2.ok) {
    return;
  }
  const data2 = await res2.json();
  return data2;
}

const buildChart = async () => {
  const data = await getData();
  const years = Object.values(data.dimension.Vuosi.category.label);
  const value = Object.values(data.value);

  const chartData = {
    labels: years,
    datasets: [{ values: value }]
  };

  const chart = new Chart("#chart", {
    title: "municipality chart",
    data: chartData,
    type: "line",
    height: 450,
    colors: ["#eb5146"]
  });
};

async function calculatePrePoint() {
  const data = await getData();
  const value = Object.values(data.value);
  let sum = 0;
  for (let i = 1; i < value.length; i++) {
    sum += value[i] - value[i - 1];
  }
  const totalsum = Math.ceil(sum / (value.length - 1));
  return totalsum;
}

async function addDataPoint() {
  const data = await getData();
  const years = Object.values(data.dimension.Vuosi.category.label);
  const value = Object.values(data.value);
  const totalsum = await calculatePrePoint();
  const newDataP = value[value.length - 1] + totalsum;
  const prediction = "prediction";
  years.push(prediction);
  value.push(newDataP);
  console.log(value);

  const chartData = {
    labels: years,
    datasets: [{ values: value }]
  };

  const chart5 = new Chart("#chart", {
    title: "municipality chart",
    data: chartData,
    Type: "line",
    height: 450,
    colors: ["#eb5146"]
  });
}

async function createchart(inputvalue) {
  const buildChart1 = async () => {
    const data1 = await getDataT();
    const areacodes = Object.values(data1.variables[1].values);
    const areanames = Object.values(data1.variables[1].valueTexts);

    for (let i = 0; i <= areanames.length; i++) {
      if (
        inputvalue.charAt(0).toUpperCase() + inputvalue.slice(1) ===
        areanames[i]
      ) {
        const data2 = await dataedit(areacodes[i]);
        const years = Object.values(data2.dimension.Vuosi.category.label);
        const value = Object.values(data2.value);

        const chartDatat = {
          labels: years,
          datasets: [{ values: value }]
        };
        const chart1 = new Chart("#chart", {
          title: "municipality chart",
          data: chartDatat,
          Type: "line",
          height: 450,
          colors: ["#eb5146"]
        });
      }
    }
  };
  buildChart1();
}

buildChart();

const submitbtn = document.getElementById("submit-data");
const estimatebtn = document.getElementById("add-data");
const navigatebtn = document.getElementById("navigation");

submitbtn.addEventListener("click", function (event) {
  event.preventDefault();
  const input = document.getElementById("input-area");
  let inputvalue = input.value;
  createchart(inputvalue);
});

estimatebtn.addEventListener("click", function (event) {
  event.preventDefault();
  addDataPoint();
});

navigatebtn.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "newchart.html";
});
