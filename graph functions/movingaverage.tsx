// import { Type } from "typescript";






export function processma(data, days: number) {
  const keys = Object.keys(data);
  let keyval = [];
  for (let key in keys) {
    keyval.push([key,[]]);
  }
  const date_idx = keys.indexOf("Date");
  var tmp_daysma = {} as typeof data;
  var initial_sums = {};

  for (let i = 0; i < keys.length; i++) {
    tmp_daysma[keys[i]] = [];
    if (i !== date_idx) {
      initial_sums[keys[i]] = sum(keys[i]);
    }
  }

  function sum(key) {
    var key_sum: number = 0.0;
    for (var i = 0; i < days - 1; i++) {
      key_sum += Number(data[key][i]);
    }
    return key_sum;
  }

  if (data[keys[0]].length >= days) {
    for (let i = 0; i <= data.Date.length - days; i++) {
      for (let j = 0; j < keys.length; j++) {
        if (j !== date_idx) {
          initial_sums[keys[j]] += Number(data[keys[j]].at(i + days - 1));
          tmp_daysma[keys[j]].push((initial_sums[keys[j]] / days).toString());
          initial_sums[keys[j]] -= Number(data[keys[j]].at(i));
        } else {
          tmp_daysma[keys[j]].push(data.Date.at(i + days - 1));
        }
      }
    }
  }
  return tmp_daysma;
}
