import fetch from "node-fetch";

export function get({ id }) {
  return new Promise((resolve, reject) => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/pen?id=" + id, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function list() {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/api/pen/query`, {
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    return response.json();
  });
}
