/**
 * MDAJAX
 * @description A universal AJAX module.
 * @author Mateusz Dziurkiewicz
 *
 * @param {String} method The HTTP method to use
 * @param {String} path API Path. e.g. /api/v1/my-account
 * @param {Object} data Optional payload.
 *
 * @returns {Promise} API Response
 * @example const response = await mdajax('get', '/api/v1/my-account/social');
 */

var mdajax_debug = false;

mdajax = async (method, path, data = {}) => {
	// If mdajax_debug is enabled, we'll output what the module is doing to the console.
	let tx = 'color: rgb(0, 255, 145';
	let rx = 'color: rgb(0, 255, 145';

	if (method.toUpperCase() == 'GET') {
		if (mdajax_debug) {
			console.log('GET %c>>>', tx, path);
		}

		return new Promise((resolve) => {
			$.ajax({
				method: 'GET',
				url: path,
				contentType: 'application/json',
				dataType: 'json',

				success: (r, textStatus, xhr) => {
					if (mdajax_debug) {
						console.log('GET %c<<<', rx, path, response);
					}

					let response = new Response(r, xhr.status);
					resolve(response);
				},
			}).catch((xhr) => {
				const error_details = {
					status: xhr.status,
					response: xhr.responseText,
				};

				console.error(`${method.toUpperCase()} to ${path} encountered an exception.`, error_details);

				let response = new Response(error_details['response'], error_details['status']);
				resolve(response);
			});
		});
	} else {
		if (mdajax_debug) {
			console.log(`${method.toUpperCase()} %c>>>`, tx, path, data);
		}

		return new Promise((resolve) => {
			$.ajax({
				method: method.toUpperCase(),
				url: path,
				data: JSON.stringify(data),
				contentType: 'application/json',
				dataType: 'json',

				success: (r, textStatus, xhr) => {
					if (mdajax_debug) {
						console.log(`${method.toUpperCase()} %c<<<`, rx, path, response);
					}

					let response = new Response(r, xhr.status);
					resolve(response);
				},
			}).catch((xhr) => {
				const error_details = {
					status: xhr.status,
					response: xhr.responseText,
				};

				console.error(`${method.toUpperCase()} to ${path} encountered an exception.`, error_details);

				let response = new Response(error_details['response'], error_details['status']);
				resolve(response);
			});
		});
	}
};

mdajax.upload = (path, formData, progress = false, progressBarID = '') => {
	// If mdajax_debug is enabled, we'll output what the module is doing to the console.
	let tx = 'color: rgb(0, 255, 145';
	let rx = 'color: rgb(0, 255, 145';

	if (mdajax_debug) {
		console.log('POST (File Upload) %c>>>', tx, path, data);
	}

	return new Promise((resolve) => {
		$.ajax({
			xhr: () => {
				let xhr = new window.XMLHttpRequest();

				xhr.upload.addEventListener(
					'progress',
					((evnt) => {
						if (evnt.lengthComputable) {
							let progressPercentage = evnt.loaded / evnt.total;
							progressPercentage = parseInt(progressPercentage * 100);
						}

						if (progress) {
							$(`#${progressBarID}`).css({ width: `${progressPercentage}%` });
							$(`#${progressBarID}`).html(`${progressPercentage}%`);
						}
					},
					false)
				);

				return xhr;
			},

			method: 'POST',
			url: path,
			data: formData,
			contentType: false,
			processData: false,
			dataType: 'json',

			success: (r, textStatus, xhr) => {
				let response = new Response(r, xhr.status);

				if (mdajax_debug) {
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

			console.error(`Failed to upload file to ${path}`, error_details);

			let response = new Response(error_details['response'], error_details['status']);
			resolve(response);
		});
	});
};

/**
 * Response Class
 * @author Mateusz Dziurkiewicz
 * @description Represents ar response from MDAJAX
 *
 * @param {xhr} The XHR Response
 * @param {xhr} The XHR Status Code
 *
 * @returns {Object} The Response object.
 * @example let response = new Response(r, xhr.status);
 */
class Response {
	constructor(body, status) {
		this.body = body;
		this.status = status;
	}
}
