import http from "../http-common";

class SongDataService {
  getAll(page = 0) {
    return http.get(`?page=${page}`);
  }

  get(id) {
    return http.get(`/id/${id}`);
  }

  find(query, by = "title", page = 0) {
    return http.get(`?${by}=${query}&page=${page}`);
  } 

  createSong(data) {
    return http.post("/song", data);
  }

  updateSong(data) {
    return http.put("/song", data);
  }

  deleteSong(id, userId) {
    return http.delete(`/song?id=${id}`, {data:{user_id: userId}});
  }

  getGenres(id) {
    return http.get(`/genres`);
  }

}

export default new SongDataService();