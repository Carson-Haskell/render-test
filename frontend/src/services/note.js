import axios from "axios";
const baseUrl = "/api/notes";

const getAll = () => axios.get(baseUrl).then(res => res.data);

const create = newObject =>
  axios.post(baseUrl, newObject).then(res => res.data);

const update = (id, newObject) =>
  axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data);

const noteService = {
  getAll,
  create,
  update,
};

export default noteService;
