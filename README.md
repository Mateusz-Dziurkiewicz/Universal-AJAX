# UAJAX
UAJAX is a Universal Ajax implementation, designed to simplify Ajax requests.

### Usage
Just load this script in your HTML and you're good to go!
```html
<script src="https://cdn.jsdelivr.net/gh/Mateusz-Dziurkiewicz/UAJAX@master/uajax.js"></script>
```

At the most basic level (using a `GET`), we simply asynchronously call UAJAX, providing a `method` and `path`. UAJAX will then perform your request, and return a Response object back to you - containing a `status` and `body`. Examples are always, great - so here's one!

```js
async function getWeatherForecast() {
	let response = await uajax('get', '/api/weather/forecast');
	
	if (response.status == 200) {
		// we got our weather forecast
		parseWeatherForecast(response.body);
	else {
		// error handling
	}
}
```

UAJAX support all other methods (`POST`, `PUT`, `DELETE` and `OPTIONS`), where we can provide some data and even headers if we want. Take a look!

```js
async function updateUsername(username) {
	let data = {
		username: 'JohnDoe123',
		newUserName: 'CaptainJackSparrow'
	}
	
	let headers = {
		Authorization: 'Bearer __TOKEN__'
	}

	let response = await uajax('post', '/api/users/user-name', data, headers);
	
	if (response.status == 200) {
		refreshUI();
	else {
		// error handling
	}
}
```
