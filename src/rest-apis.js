export async function fetchData(baseUrl, queryParams) {
    try {
        // Construct the query string from the queryParams object
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `${baseUrl}?${queryString}`;

        // Make the GET request
        const response = await fetch(url);

        // Check if the response is successful
        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }   

        // Parse the JSON response
        // const data = await response.json();
        // console.log('Data fetched:', data);
        // return data;
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