import fetch from "node-fetch";

export function get({ id }) {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/pen?id=" + id, {
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    return response.json();
  });
}

export function list() {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/api/pen`, {
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    return response.json();
  });
}
