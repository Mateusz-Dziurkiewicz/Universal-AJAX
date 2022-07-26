# UAJAX
UAJAX is a Universal AJAX implementation, designed to simplify AJAX requests.

## Requires
[jQuery 3.X](https://releases.jquery.com/)

## Usage
Just load this script after jQuery in your HTML and you're good to go!
```html
<script src="https://cdn.jsdelivr.net/gh/Mateusz-Dziurkiewicz/UAJAX@master/uajax.js"></script>
```
---
At the most basic level (using a `GET`), we simply asynchronously call UAJAX, providing a `method` and `path`. UAJAX will then perform your request, and return a Response object back to you - containing a `status` and `body`. Examples are always, great - so here's one!

```js
async function getWeatherForecast() {
	const response = await uajax('get', '/api/weather/forecast');

	if (response.status === 200) {
		// we got our weather forecast
		parseWeatherForecast(response.body);
	else {
		// error handling
	}
}
```

UAJAX supports all other methods (`POST`, `PUT`, `DELETE` and `OPTIONS`), where we can provide some data and even headers if we want. Take a look!

```js
async function updateUsername(username) {
	const data = {
		username: 'JohnDoe123',
		newUserName: 'CaptainJackSparrow'
	}

	const headers = {
		Authorization: 'Bearer __TOKEN__'
	}

	// You can provide any number of optional parameters after the path. Take a look at the uajax.js file to see what options are available to you.
	const response = await uajax('post', '/api/users/user-name', {data : data, headers : headers});

	if (response.status == 200) {
		refreshUI();
	else {
		// error handling
	}
}
```
UAJAX's debug mode is off by default, but it can be toggled with `uajaxDebug = true` in the developer console. This will log out all network events from UAJAX (including errors).