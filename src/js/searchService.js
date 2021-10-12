import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { config } from './config';
import axios from 'axios';
import templateFunc from '../templates/card-markup.hbs';

export class SearchImageService {
  constructor() {
    this.inputSearch = '';
    this.page = 1;
    this.galleryContainer = document.querySelector('.gallery');
    this.counterItems = 0;
  }

  fetchImages = async () => {
    console.log(this);

    try {
      const response = await axios.get(
        `${config.BASE_URL}?key=${config.API_KEY}&q=${this.inputSearch}&${config.FILTER_OPTIONS}&per_page=40&page=${this.page}`,
      );

      this.page += 1;

      console.log('SearchImageService ~ response', response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  };
  addGalleryMarkup(res) {
    this.galleryContainer.insertAdjacentHTML('beforeend', templateFunc(res));
  }
  resetPage() {
    this.page = 1;
  }
  checkEnd(totalHits) {
    if (document.querySelectorAll('.card').length >= totalHits) {
      const btnLoad = document.querySelector('button[data-action="load"]');
      btnLoad.classList.add('hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  }
  get SearchValue() {
    return this.inputSearch;
  }
  set SearchValue(newRequest) {
    this.inputSearch = newRequest;
  }
}
