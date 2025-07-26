function convertTimeStamp(timestamp) {

    // Convert to milliseconds (JavaScript Date uses ms)
    const date = new Date(timestamp * 1000);

    // Format to HH:mm in local timezone
    const timeString = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Set to true if you want AM/PM format
    });

    return timeString;
}

async function fetchData(link) {
    try {
        let response = await fetch(link);
        let buffer = await response.arrayBuffer();
        let decoder = new TextDecoder('utf-8');
        let text = decoder.decode(buffer);
        let data = JSON.parse(text);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }
