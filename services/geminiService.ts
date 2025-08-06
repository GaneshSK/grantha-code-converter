
export const getGranthaFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Server returned a non-JSON error response' }));
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.resultText;
  } catch (error) {
    console.error("Error calling backend API:", error);
    if (error instanceof Error) {
        return `API Error: ${error.message}`;
    }
    return "An unknown error occurred while processing the image.";
  }
};
