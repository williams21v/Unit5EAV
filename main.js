//Script File

class MarsWeather {
    constructor() {

        this.getDailyImage();
        this.getWeather();
    }



    async getDailyImage() {

        fetch('https://api.nasa.gov/planetary/apod?api_key=tiQJub2srWoz8Gzkl7u6ILGAOeeB64nLl943LFVl')
        .then(response => response.json())
        .then(jsonObj => {

            this.dailyImageURL = jsonObj.hdurl;
            console.log(this.dailyImageURL);
            const element = document.querySelector('#daily_image');
            element.setAttribute('src', this.dailyImageURL);
        })
        .catch(err => console.error(err));
    }

    // "AT": { "av": -71.233, "ct": 326642, "mn": -101.024, "mx": -27.149 }, ### Atmospheric temperature data for Sol 259

    //figure out the SOL of Mars based on todays date on Earth

    /*"soles": [
        {
          "id": "4290",
          "terrestrial_date": "2025-05-05",
          "sol": "4531",
          "ls": "79",
          "season": "Month 3",
          "min_temp": "-80",
          "max_temp": "-28",
          "pressure": "821",
          "pressure_string": "Higher",
          "abs_humidity": "--",
          "wind_speed": "--",
          "wind_direction": "--",
          "atmo_opacity": "Sunny",
          "sunrise": "05:57",
          "sunset": "17:40",
          "local_uv_irradiance_index": "Moderate",
          "min_gts_temp": "-93",
          "max_gts_temp": "-16"
        }, 
        C to F (0°C × 9/5) + 32 = 32°F

        soles[0][min_temp]
        */
       
    getFarenheit(degreesInC) {
        return Math.round(((degreesInC * 9/5) + 32));
    };

    async getWeather() {
        fetch('https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json')
        .then(response => response.json())
        .then(jsonObj => {

            this.weather = jsonObj.soles[0];
            console.log(this.weather);
            this.highF = this.getFarenheit(this.weather.max_temp);
            console.log(this.highF);


            this.date = new Date(this.weather['terrestriaL_date']);
            console.log('today\'s date: ', this.date.toDateString());
        })
        .catch(err => console.error(err));
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.marsWeather = new MarsWeather();
});
