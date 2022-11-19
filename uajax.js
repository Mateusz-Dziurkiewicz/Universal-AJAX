/* eslint-disable no-console */

/**
 * UAJAX
 * @description A universal AJAX module.
 * @author Mateusz Dziurkiewicz
 */

var uajaxDebug = true;
const defaults = {
  data: {},
  headers: {},
  contentType: 'application/json',
  dataType: 'json',
  crossDomain: false,
};

/**
 * Process options and apply defaults to anything that is missing.
 * @param {Object} options - Initialize options object, or apply defaults
 * @returns {Object} Request options
 */
const applyDefaultOptions = (options) => {
  // Apply defaults if options are not provided
  const initializedOptions = options;

  if (Object.keys(initializedOptions).length < Object.keys(defaults).length) {
    Object.entries(defaults).forEach(([key, value]) => {
      initializedOptions[key] = initializedOptions[key] ?? value;
    });
  }

  return initializedOptions;
};

/**
 * Response Class
 * @author Mateusz Dziurkiewicz
 * @description Represents a response from UAJAX
 *
 * @param {xhr} The XHR Response
 * @param {xhr} The XHR Status Code
 *
 * @returns {Object} The Response object
 * @example let response = new UAJAXResponse(r, xhr.status);
 */
class UAJAXResponse {
  constructor(body, status) {
    this.body = body;
    this.status = status;
  }
}

/**
 * Universal AJAX Method
 * @param {String} method - Request method
 * @param {String} path - Request path
 * @param {Object} options - Request options
 * @returns Promise
 */
const uajax = async (method, path, { ...options } = {}) => {
  const tx = 'color: rgb(0, 255, 145)';
  const rx = 'color: rgb(52, 164, 250)';

  const initializedOptions = applyDefaultOptions(options);

  if (method.toUpperCase() === 'GET') {
    if (uajaxDebug) {
      console.log('GET %c>>>', tx, path);
    }

    return new Promise((resolve) => {
      $.ajax({
        method: 'GET',
        url: path,
        contentType: options.contentType,
        crossDomain: options.crossDomain,
        dataType: options.dataType,
        headers: options.headers,

        success: (r, textStatus, xhr) => {
          const response = new UAJAXResponse(r, xhr.status);

          if (uajaxDebug) {
            console.log('GET %c<<<', rx, path, response);
          }
          resolve(response);
        },
      }).catch((xhr) => {
        const errorDetails = {
          status: xhr.status,
          response: xhr.responseText,
        };

        if (uajaxDebug) {
          console.error(`${method.toUpperCase()} to ${path} encountered an exception.`, errorDetails);
        }

        const response = new UAJAXResponse(errorDetails.response, errorDetails.status);
        resolve(response);
      });
    });
  }
  if (uajaxDebug) {
    console.log(`${method.toUpperCase()} %c>>>`, tx, path, options.data);
  }

  return new Promise((resolve) => {
    $.ajax({
      method: method.toUpperCase(),
      url: path,
      data: JSON.stringify(options.data),
      contentType: initializedOptions.contentType,
      crossDomain: initializedOptions.crossDomain,
      dataType: initializedOptions.dataType,
      headers: initializedOptions.headers,

      success: (r, textStatus, xhr) => {
        const response = new UAJAXResponse(r, xhr.status);

        if (uajaxDebug) {
          console.log(`${method.toUpperCase()} %c<<<`, rx, path, response);
        }
        resolve(response);
      },
    }).catch((xhr) => {
      const errorDetails = {
        status: xhr.status,
        response: xhr.responseText,
      };

      if (uajaxDebug) {
        console.error(`${method.toUpperCase()} to ${path} encountered an exception.`, errorDetails);
      }

      const response = new UAJAXResponse(errorDetails.response, errorDetails.status);
      resolve(response);
    });
  });
};

/**
 * File upload method.
 * @param {String} method - Request method
 * @param {FormData} formData - FormData (such as a file)
 * @param {Boolean} progress - Set to true if progress is to be calculated. Requires progressBarID
 * @param {Boolean} progressBarID - ID of progress bar
 * @param {Object} options - Request options
 * @returns Promise
 */
uajax.upload = (path, formData, progress = false, progressBarID = '', { ...options } = {}) => {
  // If uajax_debug is enabled, we'll output what the module is doing to the console.
  const tx = 'color: rgb(0, 255, 145';
  const rx = 'color: rgb(52, 164, 250)';

  const initializedOptions = applyDefaultOptions(options);

  if (uajaxDebug) {
    console.log('POST (File Upload) %c>>>', tx, path, formData);
  }

  return new Promise((resolve) => {
    $.ajax({
      xhr: () => {
        const xhr = new window.XMLHttpRequest();

        xhr.upload.addEventListener(
          'progress',
          (evnt) => {
            let progressPercentage = 0;

            if (evnt.lengthComputable) {
              progressPercentage = evnt.loaded / evnt.total;
              progressPercentage = parseInt(progressPercentage * 100, 10);
            }

            if (progress) {
              $(`#${progressBarID}`).css({ width: `${progressPercentage}%` });
              $(`#${progressBarID}`).html(`${progressPercentage}%`);
            }
          },
          false,
        );

        return xhr;
      },

      method: 'POST',
      url: path,
      data: formData,
      cache: false,
      contentType: false,
      crossDomain: initializedOptions.crossDomain,
      processData: false,

      success: (r, textStatus, xhr) => {
        const response = new UAJAXResponse(r, xhr.status);

        if (uajaxDebug) {
          console.log('POST (File Upload) %c<<<', rx, path, response);
        }

        if (progress) {
          $(`#${progressBarID}`).html('Upload completed!');
        }

        resolve(response);
      },
    }).catch((xhr) => {
      const errorDetails = {
        status: xhr.status,
        response: xhr.responseText,
      };

      if (uajaxDebug) {
        console.error(`Failed to upload file to ${path}`, errorDetails);
      }

      const response = new UAJAXResponse(errorDetails.response, errorDetails.status);
      resolve(response);
    });
  });
};
