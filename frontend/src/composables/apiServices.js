import axios from 'axios';
import { API_BASE_URL } from '../../config';
const config = {headers: {
    Authorization: `${localStorage.getItem('token')}`,
  }
};

// ----------------- GET -----------------
export async function getArtist(id){
    const response = await axios.get(`${API_BASE_URL}/artist/one/${id}`, config);
    return response.data;
}

export async function getArtists(page){
    const response = await axios.get(`${API_BASE_URL}/artist/list/${page}`, config);
    return response.data;
}

export async function getAlbumsByArtist(artistId) {
    const response = await axios.get(`${API_BASE_URL}/album/list/${artistId}`,config);
    return response.data;
}

export async function getRandomAlbums() {
    const response = await axios.get(`${API_BASE_URL}/album/randomList`,config);
    return response.data;
}

export async function getAlbum(id) {
    const response = await axios.get(`${API_BASE_URL}/album/one/${id}`,config);
    return response.data;
}

export async function getSongsByAlbum(albumId) {
    const response = await axios.get(`${API_BASE_URL}/song/listByAlbum/${albumId}`,config);
    return response.data;
}

export async function getSong(id) {
    const response = await axios.get(`${API_BASE_URL}/song/one/${id}`,config);
    return response.data;
}

export async function getSongsByPlaylist(playlistId) {
    const response = await axios.get(`${API_BASE_URL}/playlist/songlist/${playlistId}`,config);
    return response.data;
}

export async function getPlaylists() {
    const response = await axios.get(`${API_BASE_URL}/playlist/list`,config);
    return response.data;
}

export async function getPlaylistsByUser(id) {
    const response = await axios.get(`${API_BASE_URL}/playlist/list/${id}`,config);
    return response.data;
}

export async function getUserProfile(id){
    const response = await axios.get(`${API_BASE_URL}/user/profile/${id}`, config);
    return response.data;
}

// ----------------- SEARCH -----------------

export async function getSongsBySearch(search) {
    const response = await axios.get(`${API_BASE_URL}/song/search/${search}`,config);
    return response.data;
}

export async function getAlbumsBySearch(search) {
    const response = await axios.get(`${API_BASE_URL}/album/search/${search}`,config);
    return response.data;
}

// ----------------- DELETE -----------------
export async function deleteArtist(id) {
    const response = await axios.delete(`${API_BASE_URL}/artist/remove/${id}`, config);
    return response.data; 
}

export async function deleteAlbum(id) {
    const response = await axios.delete(`${API_BASE_URL}/album/remove/${id}`, config);
    return response.data; 
}

export async function deleteSong(id) {
    const response = await axios.delete(`${API_BASE_URL}/song/remove/${id}`, config);
    return response.data; 
}

export async function removeSongFromPlaylist(songId, playlistId) {
    const response = await axios.delete(`${API_BASE_URL}/playlist/removeSong/${songId}`, config);
    return response.data; 
}

export async function deletePlaylist(id) {
    const response = await axios.delete(`${API_BASE_URL}/playlist/remove/${id}`, config);
    return response.data; 
}

// ----------------- POST -----------------
export async function saveAlbum(album) {
    const response = await axios.post(`${API_BASE_URL}/album/save`, album, config);
    return response.data; 
}

export async function saveSong(song) {
    const response = await axios.post(`${API_BASE_URL}/song/save`, song, config);
    return response.data;
}

export async function saveArtist(artist) {
    const response = await axios.post(`${API_BASE_URL}/artist/save`, artist, config);
    return response.data; 
}

export async function saveUser(user) {
    const response = await axios.post(`${API_BASE_URL}/user/register`, user, config);
    return response.data; 
}

export async function savePlaylist(name, user) {
    const response = await axios.post(`${API_BASE_URL}/playlist/save`,{name: name, user: user}, config);
    return response.data; 
}

export async function loginUser(email, password){
    const response = await axios.post(`${API_BASE_URL}/user/login`, {email, password});
    return response.data;
}

export async function addSongToAPlaylist(playlistId, song) {
    const response = await axios.post(`${API_BASE_URL}/playlist/addSong/`, {playlistId: playlistId, song: song}, config);
    return response.data; 
}

// ----------------- PUT -----------------
export async function uploadAlbumImage(image, id) {
    const response = await axios.put(`${API_BASE_URL}/album/upload/${id}`, image, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data; 
}

export async function updateAlbum(updatedAlbum, id) {
    const response = await axios.put(`${API_BASE_URL}/album/update/${id}`, updatedAlbum , config);
    console.log(updatedAlbum)
    return response.data; 
}

export async function uploadSongFile(file, id){
    const response = await axios.put(`${API_BASE_URL}/song/upload/${id}`, file, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }

export async function updateSong(updatedSong, id) {
    const response = await axios.put(`${API_BASE_URL}/song/update/${id}`, updatedSong , config);
    return response.data; 
}

export async function uploadArtistImage(image, id) {
    const response = await axios.put(`${API_BASE_URL}/artist/upload/${id}`, image, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data; 
}

export async function updateArtist(id, name, description) {
    const response = await axios.put(`${API_BASE_URL}/artist/update/${id}`, {name , description } , config);
    return response.data;
}

export async function updateUser(updatedUser) {
    const response = await axios.put(`${API_BASE_URL}/user/update`, updatedUser , config);
    return response.data; 
}

export async function uploadUserImage(image) {
    const response = await axios.put(`${API_BASE_URL}/user/upload`, image, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data; 
}

