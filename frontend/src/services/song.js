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
    return http.post("/song-new", data);
  }

  updateSong(data) {
    return http.put("/song-edit", data);
  }

  deleteSong(id, userId) {
    return http.delete(`/song-delete?id=${id}`, {data:{user_id: userId}});
  }

  getGenres(id) {
    return http.get(`/genres`);
  }

}

export default new SongDataService();