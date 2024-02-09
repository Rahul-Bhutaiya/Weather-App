const yourWeatherTab=document.querySelector('[your-weather]');
const searchWeatherTab=document.querySelector('[search-weather]');

const grantAccessContainer=document.querySelector('[grant-access-container]');
const searchCityContainer=document.querySelector('[search-city-container]');
const loaderContainer=document.querySelector('[loader-container]');
const weatherInformationContainer=document.querySelector('[weather-information-container]');

// initial values
const apiKey='d1845658f92b31c64bd94f06f7188c9c';
let currentTab=yourWeatherTab;
currentTab.classList.add('current-tab');
checkFromSessionStorage();

yourWeatherTab.addEventListener('click',()=>{
    switchTab(yourWeatherTab);
})
searchWeatherTab.addEventListener('click',()=>{
    switchTab(searchWeatherTab);
})

function switchTab(clickedTab){
    if(currentTab!==clickedTab){
        currentTab.classList.remove('current-tab');
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');
    
        if(searchCityContainer.classList.contains('active')){
            searchCityContainer.classList.remove('active');
            weatherInformationContainer.classList.remove('active');
            errorHandlerContainer.classList.remove('active');  
            checkFromSessionStorage();
        }
        else{
            weatherInformationContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchCityContainer.classList.add('active');
        }
    }
}

function checkFromSessionStorage(){
    let latLong=sessionStorage.getItem('latlong');
    if(!latLong){
        grantAccessContainer.classList.add('active');
    }
    else{
        latLong=JSON.parse(latLong);
        fetchUserWeatherInfo(latLong);
    }
}

async function fetchUserWeatherInfo(latLong){
    try{
        const{lat,long}=latLong;
        grantAccessContainer.classList.remove('active');
        loaderContainer.classList.add('active');
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`)
        const data=await response.json();
        loaderContainer.classList.remove('active');
        weatherInformationContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err){
        loaderContainer.classList.remove('active');
        //HW
    }
}

function renderWeatherInfo(data){
    const cityName=document.querySelector('[city-name-display]');
    const countryFlag=document.querySelector('[country-flag]');
    const weatherDescriptionText=document.querySelector('[weather-description-text]');
    const weatherDescriptionImg=document.querySelector('[weather-description-img]');
    const weatherTemperature=document.querySelector('[weather-temperature]');
    const windSpeed=document.querySelector('[windspeed-value]');
    const humidity=document.querySelector('[humidity-value]');
    const clouds=document.querySelector('[clouds-value]');

    cityName.textContent=data?.name;
    countryFlag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDescriptionText.textContent=data?.weather?.[0]?.description;
    weatherDescriptionImg.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    weatherTemperature.textContent=`${data?.main?.temp} °C`;
    windSpeed.textContent=`${data?.wind?.speed} m/s`;
    humidity.textContent=`${data?.main?.humidity}%`;
    clouds.textContent=`${data?.clouds?.all}%`;
}

const grantAccessButton=document.querySelector('[grant-access-btn]');

function getLatLong(obj){
    const latlong={
        lat:obj.coords.latitude,
        long:obj.coords.longitude,
    }

    sessionStorage.setItem('latlong',JSON.stringify(latlong));
    checkFromSessionStorage();
}

function getGeolocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getLatLong)
    }
    else{
        alert("Your Browser Doesn't Supporting Our Feature...");
    }
}

grantAccessButton.addEventListener('click',getGeolocation);

const inputCityName=document.querySelector('[input-city-name]');

searchCityContainer.addEventListener('submit',(e)=>{
    e.preventDefault();
    const city=inputCityName.value;
    inputCityName.value='';
    if(city){
        getCityWeather(city);
    }
});

const errorHandlerContainer=document.querySelector('[error-handler-container]');

async function getCityWeather(city){
    weatherInformationContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    loaderContainer.classList.add('active');
    errorHandlerContainer.classList.remove('active');  
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if(response.status===200){
            const data=await response.json();
            loaderContainer.classList.remove('active');
            weatherInformationContainer.classList.add('active');
            renderWeatherInfo(data)       
        }
        else{
            loaderContainer.classList.remove('active');
            errorHandlerContainer.classList.add('active');    
        }
    }
    catch(err){
        loaderContainer.classList.remove('active');
        weatherInformationContainer.classList.remove('active');
        errorHandlerContainer.classList.add('active');
    }
}
