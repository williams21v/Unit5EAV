class MarsWeather {
  constructor() {
    this.forceImgAPI = false;
    this.forceTempAPI = false;

    this.date = new Date();
    this.timestamp = this.date.toDateString();
    this.imgAPI = null;
    this.tempAPI = null;

    chrome.storage.local
      .get(['marsImg'])
      .then((data) => {
        if (
          !this.forceImgAPI &&
          data.marsImg &&
          data.marsImg.storeDate === this.timestamp
        ) {
          console.log('STORED IMG API:', data.marsImg);
          this.imgAPI = data.marsImg.api;
          this.imgDOM();
        } else {
          console.log('Img API NOT STORED');
          this.fetchImgAPI();
        }
      })
      .catch((error) => console.log(error));

    chrome.storage.local
      .get(['marsTemp'])
      .then((data) => {
        if (
          !this.forceTempAPI &&
          data.marsTemp &&
          data.marsTemp.storeDate === this.timestamp
        ) {
          console.log('STORED TEMP API:', data.marsTemp);
          this.tempAPI = data.marsTemp.api;
          this.tempDOM();
        } else {
          console.log('TEMP API NOT STORED');
          this.fetchTempAPI();
        }
      })
      .catch((error) => console.log(error));
  }

  fetchImgAPI() {
    fetch(
      'https://api.nasa.gov/planetary/apod?api_key=tiQJub2srWoz8Gzkl7u6ILGAOeeB64nLl943LFVl'
    )
      .then((response) => response.json())
      .then((jsonObj) => {
        //Chrome Storage
        const imgAPI = {
          storeDate: this.timestamp,
          api: jsonObj,
        };
        chrome.storage.local
          .set({ marsImg: imgAPI })
          .then(() => {
            console.log('IMG API saved to Chrome Storage');
            //Proceed with setup
            this.imgAPI = jsonObj;
            this.imgDOM();
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }

  imgDOM() {
    this.dailyImgURL = this.imgAPI.hdurl;
    const element = document.querySelector('#daily_image');
    element.setAttribute('src', this.dailyImgURL);
    console.log("Today's image URL: ", this.dailyImgURL);
  }

  getFarenheit(degreesInC) {
    return Math.round((degreesInC * 9) / 5 + 32);
  }

  fetchTempAPI() {
    fetch(
      'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json'
    )
      .then((response) => response.json())
      .then((jsonObj) => {
        //Chrome Storage
        const tempAPI = {
          storeDate: this.timestamp,
          api: jsonObj,
        };
        chrome.storage.local
          .set({ marsTemp: tempAPI })
          .then(() => {
            console.log('TEMP API saved to Chrome Storage');
            //Proceed with setup
            this.tempAPI = jsonObj;
            this.tempDOM();
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }

  tempDOM() {
    this.mostRecent = this.tempAPI.soles[0];
    console.log(this.mostRecent);
    this.highF = this.getFarenheit(this.mostRecent.max_temp);
    this.lowF = this.getFarenheit(this.mostRecent.min_temp);
    this.mostRecentDate = new Date(
      Date.parse(this.mostRecent['terrestrial_date'])
    );

    console.log('Most Recent Date: ', this.mostRecentDate.toDateString());
    console.log('High Temp (F): ', this.highF);
    console.log('Low Temp (F): ', this.lowF);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  //console.log('dom content loaded');
  window.marsWeather = new MarsWeather();
});
