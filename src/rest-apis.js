export async function fetchData(baseUrl, queryParams) {
    try {
        // Construct the query string from the queryParams object
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `${baseUrl}?${queryString}`;

        // Make the GET request
        const response = await fetch(url);
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const postData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ensures the server knows the data format
            },
            body: JSON.stringify(data), // Convert the JavaScript object to JSON
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error('Error in POST request:', error);
        throw error; // Re-throw to handle it elsewhere, like in your Redux slice
    }
};

export async function deleteData(baseUrl, id, queryParams = {}) {
    try {
        // Construct the query string from the queryParams object
        const queryString = new URLSearchParams(queryParams).toString();

        // Combine baseUrl, pathParams, and queryParams into the full URL
        const url = `${baseUrl}/${id}${queryString ? `?${queryString}` : ''}`;
        console.log(url);

        // Make the DELETE request
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Return the response if needed
        return response;
    } catch (error) {
        console.error('Error in DELETE request:', error);
        throw error; // Re-throw to handle it elsewhere
    }
}


export async function updateData(baseUrl, id, queryParams = {}, body){
    try {
        // Construct the query string from the queryParams object
        const queryString = new URLSearchParams(queryParams).toString();

        // Combine baseUrl, pathParams, and queryParams into the full URL
        const url = `${baseUrl}/${id}${queryString ? `?${queryString}` : ''}`;
        console.log(url);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Ensures the server knows the data format
            },
            body: JSON.stringify(body), // Convert the JavaScript object to JSON
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error('Error in PUT request:', error);
        throw error; // Re-throw to handle it elsewhere, like in your Redux slice
    }
}