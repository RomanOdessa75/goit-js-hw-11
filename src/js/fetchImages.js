import axios from 'axios';

export default class Fetch {
  constructor() {}
  URL = 'https://pixabay.com/api/';

  options = {
    params: {
      key: '34916651-f99371deeade2de9e176e6ceb',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      q: '',
      page: 1,
      per_page: 40,
    },
  };

  async fetchImages(userQuery) {
    try {
      this.options.params.q = userQuery;
      const response = await axios.get(this.URL, this.options);
      // console.log(response.data.hits);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  pageIncrement() {
    this.options.params.page += 1;
  }

  pageRestart() {
    this.options.params.page = 1;
  }
}
