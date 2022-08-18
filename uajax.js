/**
 * UAJAX
 * @description A universal AJAX module.
 * @author Mateusz Dziurkiewicz
 *
 * @param {String} method The HTTP method to use
 * @param {String} path API Path. e.g. /api/v1/my-account
 * @param {Object} data Optional payload
 * @param {Object} headers Optional request headers
 *
 * @returns {Promise} API Response
 * @example const response = await uajax('get', '/api/v1/my-account/social');
 */

uajax_debug = true;

uajax = async (method, path, data = {}, headers = {}, contentType = 'application/json', dataType = 'json') => {
	// If uajax_debug is enabled, we'll output what the module is doing to the console.
	let tx = 'color: rgb(0, 255, 145)';
	let rx = 'color: rgb(52, 164, 250)';

	if (method.toUpperCase() == 'GET') {
		if (uajax_debug) {
			console.log('GET %c>>>', tx, path);
		}

		return new Promise((resolve) => {
			$.ajax({
				method: 'GET',
				url: path,
				contentType: contentType,
				dataType: dataType,
				headers: headers,

				success: (r, textStatus, xhr) => {
					let response = new UAJAXResponse(r, xhr.status);

					if (uajax_debug) {
						console.log('GET %c<<<', rx, path, response);
					}
					resolve(response);
				},
			}).catch((xhr) => {
				const error_details = {
					status: xhr.status,
					response: xhr.responseText,
				};

				if (uajax_debug) {
					console.error(`${method.toUpperCase()} to ${path} encountered an exception.`, error_details);
				}

				let response = new UAJAXResponse(error_details['response'], error_details['status']);
				resolve(response);
			});
		});
	} else {
		if (uajax_debug) {
			console.log(`${method.toUpperCase()} %c>>>`, tx, path, data);
		}

		return new Promise((resolve) => {
			$.ajax({
				method: method.toUpperCase(),
				url: path,
				data: JSON.stringify(data),
				contentType: contentType,
				dataType: dataType,
				headers: headers,

				success: (r, textStatus, xhr) => {
					let response = new UAJAXResponse(r, xhr.status);

					if (uajax_debug) {
						console.log(`${method.toUpperCase()} %c<<<`, rx, path, response);
					}
					resolve(response);
				},
			}).catch((xhr) => {
				const error_details = {
					status: xhr.status,
					response: xhr.responseText,
				};

				if (uajax_debug) {
					console.error(`${method.toUpperCase()} to ${path} encountered an exception.`, error_details);
				}

				let response = new UAJAXResponse(error_details['response'], error_details['status']);
				resolve(response);
			});
		});
	}
};

uajax.upload = (path, formData, progress = false, progressBarID = '') => {
	// If uajax_debug is enabled, we'll output what the module is doing to the console.
	let tx = 'color: rgb(0, 255, 145';
	let rx = 'color: rgb(52, 164, 250)';

	if (uajax_debug) {
		console.log('POST (File Upload) %c>>>', tx, path, formData);
	}

	return new Promise((resolve) => {
		$.ajax({
			xhr: () => {
				let xhr = new window.XMLHttpRequest();

				xhr.upload.addEventListener(
					'progress',
					function (evnt) {
						if (evnt.lengthComputable) {
							let progressPercentage = evnt.loaded / evnt.total;
							progressPercentage = parseInt(progressPercentage * 100);
						}

						if (progress) {
							$(`#${progressBarID}`).css({ width: `${progressPercentage}%` });
							$(`#${progressBarID}`).html(`${progressPercentage}%`);
						}
					},
					false
				);

				return xhr;
			},

			method: 'POST',
			url: path,
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			dataType: 'json',

			success: (r, textStatus, xhr) => {
				let response = new UAJAXResponse(r, xhr.status);

				if (uajax_debug) {
					console.log('POST (File Upload) %c<<<', rx, path, response);
				}

				if (progress) {
					$(`#${progressBarID}`).html('Upload completed!');
				}

				resolve(response);
			},
		}).catch((xhr) => {
			const error_details = {
				status: xhr.status,
				response: xhr.responseText,
			};

			if (uajax_debug) {
				console.error(`Failed to upload file to ${path}`, error_details);
			}

			let response = new UAJAXResponse(error_details['response'], error_details['status']);
			resolve(response);
		});
	});
};

/**
 * Response Class
 * @author Mateusz Dziurkiewicz
 * @description Represents a response from UAJAX
 *
 * @param {xhr} The XHR Response
 * @param {xhr} The XHR Status Code
 *
 * @returns {Object} The Response object.
 * @example let response = new UAJAXResponse(r, xhr.status);
 */
class UAJAXResponse {
	constructor(body, status) {
		this.body = body;
		this.status = status;
	}
}
