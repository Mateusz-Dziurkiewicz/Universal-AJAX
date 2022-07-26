# UAJAX
A Universal Ajax Module

### Usage
```js
// data and path are optional...
let response = await uajax(method, path, data = {}, headers = {});

if (response.status == 200) {
  console.log('Yo, I got a 200!, response.body);
} else {
  console.log(`I got something else! Looks like a Status: ${response.status}!.`, response.body);
}
```
